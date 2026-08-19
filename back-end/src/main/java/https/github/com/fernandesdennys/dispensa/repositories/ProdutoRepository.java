package https.github.com.fernandesdennys.dispensa.repositories;

import https.github.com.fernandesdennys.dispensa.entities.Categoria;
import https.github.com.fernandesdennys.dispensa.entities.Produto;
import https.github.com.fernandesdennys.dispensa.entities.enums.Unidade;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ProdutoRepository extends JpaRepository<Produto, Integer> {

    // =========================================================
    // BUSCAR POR ID
    // =========================================================

    @Query("""
                SELECT p
                FROM Produto p
                JOIN FETCH p.categoria
                WHERE p.id = :id
                AND p.usuario.id = :usuarioId
                AND p.ativo = true
            """)
    Optional<Produto> buscarPorId(
            @Param("id") Integer id,
            @Param("usuarioId") Integer usuarioId
    );


    // =========================================================
    // LISTAR PRODUTOS
    // =========================================================

    @Query("""
                SELECT p
                FROM Produto p
                JOIN FETCH p.categoria c
                WHERE p.ativo = true
                AND p.usuario.id = :usuarioId
                AND (:categoriaId IS NULL OR c.id = :categoriaId)
                AND (:abaixoMinimo = false OR p.quantidadeAtual < p.quantidadeMinima)
                AND (:busca IS NULL OR LOWER(p.nome) LIKE LOWER(CONCAT('%', :busca, '%')))
                ORDER BY
                    CASE WHEN :ordenarPor = 'nome' THEN p.nome END ASC,
                    CASE WHEN :ordenarPor = 'quantidade_atual' THEN p.quantidadeAtual END ASC,
                    CASE WHEN :ordenarPor = 'quantidade_minima' THEN p.quantidadeMinima END ASC,
                    CASE WHEN :ordenarPor = 'quantidade_ideal' THEN p.quantidadeIdeal END ASC,
                    CASE WHEN :ordenarPor = 'criado_em' THEN p.criadoEm END ASC,
                    p.nome ASC
            """)
    Page<Produto> buscarProdutos(
            @Param("usuarioId") Integer usuarioId,
            @Param("categoriaId") Integer categoriaId,
            @Param("abaixoMinimo") Boolean abaixoMinimo,
            @Param("busca") String busca,
            @Param("ordenarPor") String ordenarPor,
            Pageable pageable
    );


    // =========================================================
    // ATUALIZAR PRODUTO
    // =========================================================

    @Modifying
    @Transactional
    @Query("""
                UPDATE Produto p
                SET p.nome = :nome,
                    p.categoria = :categoria,
                    p.unidade = :unidade,
                    p.quantidadeAtual = :quantidadeAtual,
                    p.quantidadeMinima = :quantidadeMinima,
                    p.quantidadeIdeal = :quantidadeIdeal,
                    p.atualizadoEm = :atualizadoEm
                WHERE p.id = :id
                AND p.usuario.id = :usuarioId
                AND p.ativo = true
            """)
    int atualizarProduto(
            @Param("id") Integer id,
            @Param("usuarioId") Integer usuarioId,
            @Param("nome") String nome,
            @Param("categoria") Categoria categoria,
            @Param("unidade") Unidade unidade,
            @Param("quantidadeAtual") BigDecimal quantidadeAtual,
            @Param("quantidadeMinima") BigDecimal quantidadeMinima,
            @Param("quantidadeIdeal") BigDecimal quantidadeIdeal,
            @Param("atualizadoEm") LocalDateTime atualizadoEm
    );


    // =========================================================
    // PRODUTOS ABAIXO DO MÍNIMO
    // =========================================================

    @Query("""
                SELECT p
                FROM Produto p
                WHERE p.ativo = true
                AND p.usuario.id = :usuarioId
                AND p.quantidadeAtual < p.quantidadeMinima
            """)
    List<Produto> buscarProdutosAbaixoDoMinimo(
            @Param("usuarioId") Integer usuarioId
    );


    // =========================================================
    // ATUALIZAR QUANTIDADE
    // =========================================================

    @Modifying
    @Transactional
    @Query("""
                UPDATE Produto p
                SET p.quantidadeAtual = :quantidadeAtual,
                    p.atualizadoEm = :atualizadoEm
                WHERE p.id = :id
                AND p.usuario.id = :usuarioId
                AND p.ativo = true
            """)
    int atualizarQuantidade(
            @Param("id") Integer id,
            @Param("usuarioId") Integer usuarioId,
            @Param("quantidadeAtual") BigDecimal quantidadeAtual,
            @Param("atualizadoEm") LocalDateTime atualizadoEm
    );


    // =========================================================
    // SOFT DELETE
    // =========================================================

    @Modifying
    @Transactional
    @Query("""
                UPDATE Produto p
                SET p.ativo = false,
                    p.atualizadoEm = :atualizadoEm
                WHERE p.id = :id
                AND p.usuario.id = :usuarioId
                AND p.ativo = true
            """)
    int softDelete(
            @Param("id") Integer id,
            @Param("usuarioId") Integer usuarioId,
            @Param("atualizadoEm") LocalDateTime atualizadoEm
    );

    @Query("""
                SELECT CASE WHEN COUNT(p) > 0 THEN true ELSE false END
                FROM Produto p
                WHERE p.nome = :nome
                  AND p.usuario.id = :usuarioId
                  AND p.ativo = true
            """)
    boolean existeProdutoAtivo(
            @Param("nome") String nome,
            @Param("usuarioId") Integer usuarioId
    );
}