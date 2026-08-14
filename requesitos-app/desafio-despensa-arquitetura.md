# Desafio: Sistema de Controle de Despensa e Lista de Compras

**Documento de Arquitetura e Regras do Desafio**

---

## 1. O problema

Construir um sistema para controlar o estoque de alimentos de uma casa e gerar automaticamente a lista de compras a partir desse estoque.

O sistema precisa responder três perguntas:

1. **O que eu tenho em casa?** (estoque atual, por produto)
2. **O que está acabando ou vencendo?** (nível mínimo e validade)
3. **O que eu preciso comprar?** (lista gerada a partir das duas respostas acima)

---

## 2. Stack obrigatória

| Camada | Tecnologia |
|---|---|
| Frontend | Next.js (App Router) + TypeScript |
| Estilo | styled-components |
| Estado global | Zustand (com persist / storage) |
| HTTP | Axios (encapsulado em um `httpClient`) |
| Validação (front) | Zod |
| Backend | Python + FastAPI |
| Validação (back) | Pydantic (schemas) |
| Banco | MySQL 8 |
| Acesso a dados | **SQL puro — ORM é proibido** |
| Driver | `mysql-connector-python` (pooling nativo, placeholder `%s`) |

**Regra de ouro:** nada de SQLAlchemy, Tortoise, Prisma, Peewee ou qualquer abstração que gere SQL. Toda query é escrita à mão, no `repository`, e **sempre parametrizada**.

---

## 3. Arquitetura do backend

Arquitetura procedural em camadas. Sem classes desnecessárias, sem herança, sem "domain model rico". Funções puras, responsabilidades separadas por pasta.

### 3.1 Fluxo de uma requisição

```
HTTP
 │
 ▼
routes/          → recebe request, valida entrada (schema Pydantic), chama service
 │                 NÃO tem regra de negócio. NÃO conhece SQL.
 ▼
services/        → regra de negócio, orquestração, transação
 │                 NÃO conhece HTTP (não retorna Response, não levanta HTTPException de status).
 │                 NÃO escreve SQL.
 ▼
repository/      → SQL puro, parametrizado. Recebe a conexão como argumento.
 │                 NÃO tem regra de negócio. NÃO valida.
 ▼
infra/database   → pool de conexões, contextmanager de transação
 │
 ▼
config/          → leitura de .env, objeto de settings
```

**Direção da dependência é sempre para baixo.** `repository` nunca importa `service`. `service` nunca importa `routes`.

### 3.2 Estrutura de pastas

```
backend/
├── .env.example
├── requirements.txt
├── main.py                      # cria o app FastAPI, registra routers e CORS
├── app/
│   ├── config/
│   │   └── settings.py          # Pydantic Settings, lê o .env
│   ├── infra/
│   │   └── database.py          # pool de conexões + get_connection() + transação
│   ├── schemas/
│   │   ├── produto_schema.py
│   │   ├── movimentacao_schema.py
│   │   └── lista_schema.py
│   ├── repository/
│   │   ├── produto_repository.py
│   │   ├── movimentacao_repository.py
│   │   └── lista_repository.py
│   ├── services/
│   │   ├── produto_service.py
│   │   ├── estoque_service.py
│   │   └── lista_service.py
│   ├── routes/
│   │   ├── produto_routes.py
│   │   ├── estoque_routes.py
│   │   └── lista_routes.py
│   └── core/
│       ├── exceptions.py        # exceções de domínio (NotFound, BusinessError...)
│       └── error_handler.py     # traduz exceção de domínio → HTTP status
└── migrations/
    ├── 001_schema.sql
    └── 002_seed.sql
```

### 3.3 Config (`app/config/settings.py`)

Nenhuma credencial no código. Tudo vem de variável de ambiente.

```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DB_HOST: str
    DB_PORT: int = 3306
    DB_USER: str
    DB_PASSWORD: str
    DB_NAME: str
    DB_POOL_SIZE: int = 5
    CORS_ORIGINS: str = "http://localhost:3000"

    class Config:
        env_file = ".env"

settings = Settings()
```

`.env.example` versionado, `.env` **no `.gitignore`**.

### 3.4 Infra (`app/infra/database.py`)

Pool de conexões + um contextmanager que garante `commit`/`rollback`/`close`.

```python
from contextlib import contextmanager
from mysql.connector import pooling
from app.config.settings import settings

_pool = pooling.MySQLConnectionPool(
    pool_name="despensa_pool",
    pool_size=settings.DB_POOL_SIZE,
    host=settings.DB_HOST,
    port=settings.DB_PORT,
    user=settings.DB_USER,
    password=settings.DB_PASSWORD,
    database=settings.DB_NAME,
    charset="utf8mb4",
    autocommit=False,
)

@contextmanager
def get_connection():
    conn = _pool.get_connection()
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()
```

Uso como dependência do FastAPI:

```python
def db_dependency():
    with get_connection() as conn:
        yield conn
```

### 3.5 Repository — regras

- Uma função = uma responsabilidade de dados (`buscar_por_id`, `listar`, `inserir`, `atualizar_quantidade`...).
- Recebe `conn` como **primeiro argumento**. O repository **não abre nem fecha conexão** — quem controla a transação é o service.
- Sempre `cursor(dictionary=True)` para retornar `dict`.
- Sempre fecha o cursor (use `with`).
- **Nunca** concatena/interpola valor em string SQL.

```python
def buscar_por_id(conn, produto_id: int) -> dict | None:
    sql = """
        SELECT p.id, p.nome, p.categoria_id, p.unidade,
               p.quantidade_atual, p.quantidade_minima, p.quantidade_ideal
          FROM produto p
         WHERE p.id = %s
           AND p.ativo = 1
    """
    with conn.cursor(dictionary=True) as cur:
        cur.execute(sql, (produto_id,))
        return cur.fetchone()
```

### 3.6 Services — regras

- É **o único lugar** onde existe regra de negócio.
- Orquestra vários repositories dentro da mesma transação.
- Levanta exceções de domínio (`NotFoundError`, `BusinessError`), nunca `HTTPException`.

```python
from app.repository import produto_repository, movimentacao_repository
from app.core.exceptions import NotFoundError, BusinessError

def registrar_consumo(conn, produto_id: int, quantidade: float, observacao: str | None):
    produto = produto_repository.buscar_por_id(conn, produto_id)
    if not produto:
        raise NotFoundError("Produto não encontrado")

    if quantidade <= 0:
        raise BusinessError("Quantidade deve ser maior que zero")

    if produto["quantidade_atual"] < quantidade:
        raise BusinessError("Estoque insuficiente para esse consumo")

    nova_quantidade = produto["quantidade_atual"] - quantidade

    produto_repository.atualizar_quantidade(conn, produto_id, nova_quantidade)
    movimentacao_repository.inserir(
        conn,
        produto_id=produto_id,
        tipo="SAIDA",
        quantidade=quantidade,
        observacao=observacao,
    )
    return {"produto_id": produto_id, "quantidade_atual": nova_quantidade}
```

### 3.7 Routes — regras

- Fina. Só entrada e saída.
- Declara `response_model`. Nunca devolve o `dict` cru do banco sem passar por schema.

```python
from fastapi import APIRouter, Depends, status
from app.infra.database import db_dependency
from app.schemas.movimentacao_schema import ConsumoRequest, EstoqueResponse
from app.services import estoque_service

router = APIRouter(prefix="/produtos", tags=["estoque"])

@router.post("/{produto_id}/consumo", response_model=EstoqueResponse, status_code=status.HTTP_200_OK)
def registrar_consumo(produto_id: int, payload: ConsumoRequest, conn = Depends(db_dependency)):
    return estoque_service.registrar_consumo(
        conn, produto_id, payload.quantidade, payload.observacao
    )
```

### 3.8 Schemas (Pydantic)

Separar sempre **Request** de **Response**. O schema de entrada é a primeira barreira de segurança.

```python
from pydantic import BaseModel, Field, field_validator

class ProdutoCreate(BaseModel):
    nome: str = Field(min_length=2, max_length=120)
    categoria_id: int = Field(gt=0)
    unidade: Literal["UN", "KG", "G", "L", "ML", "PCT"]
    quantidade_minima: float = Field(ge=0)
    quantidade_ideal: float = Field(ge=0)

    @field_validator("nome")
    @classmethod
    def limpar_nome(cls, v: str) -> str:
        return v.strip()
```

---

## 4. Modelagem do banco (MySQL)

```sql
CREATE TABLE categoria (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  nome         VARCHAR(60) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE produto (
  id                 INT AUTO_INCREMENT PRIMARY KEY,
  nome               VARCHAR(120) NOT NULL,
  categoria_id       INT NOT NULL,
  unidade            ENUM('UN','KG','G','L','ML','PCT') NOT NULL,
  quantidade_atual   DECIMAL(10,3) NOT NULL DEFAULT 0,
  quantidade_minima  DECIMAL(10,3) NOT NULL DEFAULT 0,
  quantidade_ideal   DECIMAL(10,3) NOT NULL DEFAULT 0,
  ativo              TINYINT(1) NOT NULL DEFAULT 1,
  criado_em          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_produto_categoria FOREIGN KEY (categoria_id) REFERENCES categoria(id),
  UNIQUE KEY uk_produto_nome (nome),
  KEY idx_produto_categoria (categoria_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE movimentacao (
  id           BIGINT AUTO_INCREMENT PRIMARY KEY,
  produto_id   INT NOT NULL,
  tipo         ENUM('ENTRADA','SAIDA','AJUSTE','DESCARTE') NOT NULL,
  quantidade   DECIMAL(10,3) NOT NULL,
  observacao   VARCHAR(255) NULL,
  criado_em    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_mov_produto FOREIGN KEY (produto_id) REFERENCES produto(id),
  KEY idx_mov_produto_data (produto_id, criado_em)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE lista_compra (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  titulo       VARCHAR(120) NOT NULL,
  status       ENUM('ABERTA','FINALIZADA','CANCELADA') NOT NULL DEFAULT 'ABERTA',
  criado_em    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  finalizado_em DATETIME NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE lista_compra_item (
  id                 BIGINT AUTO_INCREMENT PRIMARY KEY,
  lista_id           INT NOT NULL,
  produto_id         INT NOT NULL,
  quantidade_sugerida DECIMAL(10,3) NOT NULL,
  quantidade_comprada DECIMAL(10,3) NULL,
  comprado           TINYINT(1) NOT NULL DEFAULT 0,
  CONSTRAINT fk_item_lista FOREIGN KEY (lista_id) REFERENCES lista_compra(id) ON DELETE CASCADE,
  CONSTRAINT fk_item_produto FOREIGN KEY (produto_id) REFERENCES produto(id),
  UNIQUE KEY uk_lista_produto (lista_id, produto_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**Nível 2 (opcional):** tabela `lote` (`produto_id`, `quantidade`, `validade`) para controlar vencimento. Aí `produto.quantidade_atual` vira `SUM(lote.quantidade)` e o consumo passa a usar FEFO (*first expired, first out*).

> Use `DECIMAL` para quantidade, nunca `FLOAT`. Arredondamento binário em estoque gera bug silencioso.

---

## 5. Regras de negócio

### 5.1 Movimentação de estoque
- `ENTRADA` soma, `SAIDA` subtrai, `AJUSTE` define o valor absoluto, `DESCARTE` subtrai e é registrado separado (métrica de desperdício).
- Toda alteração de `quantidade_atual` **grava uma linha em `movimentacao`, na mesma transação**. Sem exceção. O histórico é a fonte de auditoria.
- Estoque nunca fica negativo.

### 5.2 Geração da lista de compras
Ao gerar uma lista, o serviço busca todos os produtos onde `quantidade_atual <= quantidade_minima` e calcula:

```
quantidade_sugerida = max(0, quantidade_ideal - quantidade_atual)
```

Regras adicionais:
- Se já existe lista com status `ABERTA`, não cria outra — ou atualiza a existente, ou retorna erro de negócio. Decida e documente.
- Produto inativo não entra na lista.
- Lista sem itens não deve ser criada (retorna erro de negócio explicando que nada está abaixo do mínimo).

### 5.3 Finalização da lista
Ao finalizar, cada item marcado como comprado gera uma `ENTRADA` de estoque com a `quantidade_comprada`. Tudo na mesma transação: ou entra tudo, ou não entra nada.

---

## 6. Segurança — requisito obrigatório de aceite

Esta seção é critério eliminatório. Sem ORM, a responsabilidade de não abrir buraco de SQL injection é 100% de quem escreve a query.

### 6.1 Parametrização — a regra absoluta

**Nunca** monte SQL com f-string, `%`, `.format()` ou concatenação de valores.

```python
# ❌ PROIBIDO — SQL injection
cur.execute(f"SELECT * FROM produto WHERE nome = '{nome}'")
cur.execute("SELECT * FROM produto WHERE id = " + str(produto_id))
cur.execute("SELECT * FROM produto WHERE nome = '%s'" % nome)

# ✅ CORRETO — o driver escapa e tipa o valor
cur.execute("SELECT * FROM produto WHERE nome = %s", (nome,))
```

O placeholder do `mysql-connector-python` é `%s` **para qualquer tipo** (string, int, data). Não coloque aspas em volta dele — `'%s'` quebra a parametrização e transforma o valor em literal.

### 6.2 LIKE também é parametrizado

O curinga vai no **valor**, não na string SQL:

```python
# ✅
termo = f"%{busca}%"
cur.execute("SELECT id, nome FROM produto WHERE nome LIKE %s", (termo,))
```

### 6.3 Cláusula IN dinâmica

Placeholders gerados por contagem, valores sempre pela tupla:

```python
ids = [1, 2, 5]
placeholders = ", ".join(["%s"] * len(ids))   # gera "%s, %s, %s"
sql = f"SELECT id, nome FROM produto WHERE id IN ({placeholders})"
cur.execute(sql, tuple(ids))
```

Aqui a f-string é aceitável **porque interpola apenas placeholders**, nunca dados do usuário. Sempre valide que a lista não está vazia antes.

### 6.4 O que não pode ser parametrizado: use whitelist

Nome de tabela, nome de coluna e direção de ordenação não aceitam placeholder. Nesses casos, **nunca** aceite o valor do usuário direto — mapeie contra uma lista fechada:

```python
COLUNAS_ORDENACAO = {
    "nome": "p.nome",
    "quantidade": "p.quantidade_atual",
    "criado_em": "p.criado_em",
}
DIRECOES = {"asc": "ASC", "desc": "DESC"}

def listar(conn, ordenar_por="nome", direcao="asc", limite=50, offset=0):
    coluna = COLUNAS_ORDENACAO.get(ordenar_por, "p.nome")   # fallback seguro
    ordem  = DIRECOES.get(direcao, "ASC")
    limite = min(max(int(limite), 1), 100)                  # cast + clamp
    offset = max(int(offset), 0)

    sql = f"""
        SELECT p.id, p.nome, p.quantidade_atual
          FROM produto p
         WHERE p.ativo = 1
         ORDER BY {coluna} {ordem}
         LIMIT %s OFFSET %s
    """
    with conn.cursor(dictionary=True) as cur:
        cur.execute(sql, (limite, offset))
        return cur.fetchall()
```

Se o valor não está no dicionário, cai no default. Não levante erro expondo nomes de coluna.

### 6.5 Filtros opcionais (WHERE dinâmico)

Monte condições e parâmetros em paralelo:

```python
def buscar(conn, categoria_id=None, abaixo_minimo=False):
    where = ["p.ativo = 1"]
    params = []

    if categoria_id is not None:
        where.append("p.categoria_id = %s")
        params.append(categoria_id)

    if abaixo_minimo:
        where.append("p.quantidade_atual <= p.quantidade_minima")

    sql = f"SELECT p.id, p.nome FROM produto p WHERE {' AND '.join(where)}"
    with conn.cursor(dictionary=True) as cur:
        cur.execute(sql, tuple(params))
        return cur.fetchall()
```

Note que a f-string monta só fragmentos escritos por você — nenhum dado do usuário entra na string.

### 6.6 Demais requisitos de segurança

| Item | Requisito |
|---|---|
| `executemany` | Use para inserts em lote. Continua parametrizado. |
| `multi=True` | **Proibido.** Executar múltiplos statements em um `execute` é o que transforma injection em RCE de banco. |
| Usuário do MySQL | Usuário da aplicação com `SELECT, INSERT, UPDATE, DELETE` apenas no schema do projeto. Sem `DROP`, sem `GRANT`, sem `root`. |
| Credenciais | Somente via `.env`. `.env` no `.gitignore`. `.env.example` sem valores reais. |
| Validação de entrada | Pydantic no backend + Zod no frontend. O front valida por UX; o back valida por segurança. Nunca confie no front. |
| Tipos na rota | `produto_id: int` no path param. FastAPI rejeita `/produtos/1 OR 1=1` com 422 antes de chegar no service. |
| Erros | Nunca devolva `str(exception)` do driver na resposta HTTP. Vaza nome de tabela, coluna e versão. Log detalhado no servidor, mensagem genérica para o cliente. |
| CORS | Origem explícita (`http://localhost:3000`), nunca `allow_origins=["*"]` junto com credenciais. |
| Transação | `commit` só no final do fluxo completo. Qualquer exceção → `rollback`. |
| Payload | Limite tamanho de string em todo schema (`max_length`). Sem limite = DoS por payload gigante. |

### 6.7 Handler global de erro

```python
@app.exception_handler(Exception)
async def erro_generico(request, exc):
    logger.exception("Erro não tratado")   # detalhe fica no log
    return JSONResponse(status_code=500, content={"detail": "Erro interno"})
```

---

## 7. Arquitetura do frontend

Procedural. Sem Redux, sem clean architecture, sem container/presentational. Componentes + hooks + uma camada de serviços.

### 7.1 Estrutura

```
frontend/src/
├── app/
│   ├── layout.tsx
│   ├── registry.tsx            # StyledComponentsRegistry (SSR)
│   ├── page.tsx                # dashboard
│   ├── produtos/page.tsx
│   ├── estoque/page.tsx
│   └── lista/page.tsx
├── components/
│   ├── ui/                     # Button, Input, Card, Badge...
│   └── produto/
├── services/
│   ├── httpClient.ts           # instância única do axios
│   ├── produtoService.ts
│   ├── estoqueService.ts
│   └── listaService.ts
├── schemas/                    # Zod: valida form E valida resposta da API
│   ├── produtoSchema.ts
│   └── listaSchema.ts
├── store/
│   ├── useProdutoStore.ts
│   └── usePreferenciasStore.ts # persist → localStorage
├── styles/
│   ├── theme.ts
│   └── GlobalStyle.ts
└── types/
```

### 7.2 httpClient

Única instância de Axios. Nenhum componente importa `axios` diretamente.

```ts
import axios from "axios";

export const httpClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10_000,
  headers: { "Content-Type": "application/json" },
});

httpClient.interceptors.response.use(
  (res) => res,
  (error) => {
    const mensagem =
      error.response?.data?.detail ?? "Não foi possível concluir a operação.";
    return Promise.reject(new Error(mensagem));
  }
);
```

### 7.3 Service + Zod

Zod valida **a resposta da API**, não só o formulário. Se o contrato quebrar, você descobre na borda e não três componentes depois.

```ts
import { z } from "zod";
import { httpClient } from "./httpClient";

export const produtoSchema = z.object({
  id: z.number(),
  nome: z.string(),
  unidade: z.enum(["UN", "KG", "G", "L", "ML", "PCT"]),
  quantidade_atual: z.coerce.number(),
  quantidade_minima: z.coerce.number(),
});

export type Produto = z.infer<typeof produtoSchema>;

export async function listarProdutos(): Promise<Produto[]> {
  const { data } = await httpClient.get("/produtos");
  return z.array(produtoSchema).parse(data);
}
```

### 7.4 Zustand + storage

```ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

type PreferenciasState = {
  ordenacao: "nome" | "quantidade";
  apenasAbaixoMinimo: boolean;
  setOrdenacao: (o: "nome" | "quantidade") => void;
  toggleAbaixoMinimo: () => void;
};

export const usePreferenciasStore = create<PreferenciasState>()(
  persist(
    (set) => ({
      ordenacao: "nome",
      apenasAbaixoMinimo: false,
      setOrdenacao: (ordenacao) => set({ ordenacao }),
      toggleAbaixoMinimo: () =>
        set((s) => ({ apenasAbaixoMinimo: !s.apenasAbaixoMinimo })),
    }),
    { name: "despensa:preferencias" }
  )
);
```

Regra: **estado de servidor não vai para o storage**. Persista preferências de UI e o rascunho da lista de compras em andamento. Estoque sempre vem da API.

### 7.5 styled-components no App Router

Precisa de registry para SSR, senão o estilo pisca na primeira renderização.

```ts
// next.config.ts
export default { compiler: { styledComponents: true } };
```

```tsx
// app/registry.tsx
"use client";
import { useState } from "react";
import { useServerInsertedHTML } from "next/navigation";
import { ServerStyleSheet, StyleSheetManager } from "styled-components";

export default function StyledComponentsRegistry({ children }: { children: React.ReactNode }) {
  const [sheet] = useState(() => new ServerStyleSheet());

  useServerInsertedHTML(() => {
    const styles = sheet.getStyleElement();
    sheet.instance.clearTag();
    return <>{styles}</>;
  });

  if (typeof window !== "undefined") return <>{children}</>;

  return <StyleSheetManager sheet={sheet.instance}>{children}</StyleSheetManager>;
}
```

Use `theme.ts` com tokens (cores, espaçamento, radius) via `ThemeProvider`. Nada de hex solto no componente.

---

## 8. Contrato da API

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/categorias` | Lista categorias |
| `GET` | `/produtos` | Lista produtos (filtros: `categoria_id`, `abaixo_minimo`, `busca`, `ordenar_por`, `limite`, `offset`) |
| `POST` | `/produtos` | Cadastra produto |
| `GET` | `/produtos/{id}` | Detalhe |
| `PUT` | `/produtos/{id}` | Atualiza cadastro |
| `DELETE` | `/produtos/{id}` | Soft delete (`ativo = 0`) |
| `POST` | `/produtos/{id}/entrada` | Registra entrada de estoque |
| `POST` | `/produtos/{id}/consumo` | Registra saída |
| `POST` | `/produtos/{id}/ajuste` | Ajuste absoluto de inventário |
| `GET` | `/produtos/{id}/movimentacoes` | Histórico paginado |
| `POST` | `/listas/gerar` | Gera lista a partir do estoque abaixo do mínimo |
| `GET` | `/listas/{id}` | Detalhe com itens |
| `PATCH` | `/listas/{id}/itens/{item_id}` | Marca item como comprado / edita quantidade |
| `POST` | `/listas/{id}/finalizar` | Finaliza e dá entrada no estoque |

Padrão de erro (único, em toda a API):

```json
{ "detail": "Estoque insuficiente para esse consumo" }
```

Status: `400` regra de negócio, `404` não encontrado, `422` validação (automático do FastAPI), `500` genérico.

---

## 9. Entregas por nível

**Nível 1 — MVP (obrigatório)**
CRUD de produtos e categorias, entrada/saída de estoque com histórico, geração e finalização da lista de compras, telas correspondentes no front.

**Nível 2**
Controle de lotes com data de validade e consumo FEFO, alerta de "vence em 7 dias", dashboard com indicadores (itens abaixo do mínimo, vencendo, descarte do mês).

**Nível 3**
Autenticação com JWT e `bcrypt`/`argon2` (jamais senha em texto ou MD5/SHA1), múltiplas despensas por usuário, sugestão de recompra baseada no consumo médio das últimas 8 semanas, exportar lista em PDF/texto.

---

## 10. Critérios de avaliação

| Peso | Critério |
|---|---|
| 30% | **Segurança**: toda query parametrizada, whitelist em `ORDER BY`, sem credencial no repo, erros sem vazamento. Uma única query vulnerável reprova este item. |
| 25% | **Arquitetura**: camadas respeitadas, sem SQL no service, sem regra no repository, transação correta. |
| 20% | **Funcionalidade**: os fluxos do Nível 1 funcionam de ponta a ponta. |
| 15% | **Frontend**: services isolados, Zod validando a borda, Zustand sem virar depósito de estado de servidor, tema consistente. |
| 10% | **Entrega**: README com passo a passo de setup, `.env.example`, migrations rodáveis, commits com mensagem legível. |

---

## 11. Checklist final antes de entregar

- [ ] Nenhum `f"...{variavel}..."` dentro de uma string SQL com dado de usuário
- [ ] Todo `cur.execute` recebe tupla de parâmetros quando há valor dinâmico
- [ ] `ORDER BY` e nomes de coluna vêm de dicionário whitelist
- [ ] `LIMIT`/`OFFSET` com `int()` e clamp
- [ ] `.env` no `.gitignore` e `.env.example` versionado
- [ ] Usuário MySQL sem privilégio administrativo
- [ ] Nenhum `str(exception)` do driver chega na resposta HTTP
- [ ] CORS com origem explícita
- [ ] Toda mudança de estoque tem `movimentacao` correspondente, na mesma transação
- [ ] Rollback testado: force um erro no meio do `finalizar lista` e confirme que nada foi gravado
- [ ] Front não importa `axios` fora de `httpClient.ts`
- [ ] Zod valida a resposta da API, não só o formulário
