package https.github.com.fernandesdennys.dispensa.entities;

import https.github.com.fernandesdennys.dispensa.entities.enums.Unidade;
import jakarta.persistence.*;

import java.math.BigDecimal;

import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name = "tb_produto", uniqueConstraints = {@UniqueConstraint(name = "uk_produto_nome", columnNames = "nome")})
public class Produto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 120, unique = true)
    private String nome;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "categoria_id", nullable = false)
    private Categoria categoria;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 3)
    private Unidade unidade;

    @Column(nullable = false, precision = 10, scale = 3)
    private BigDecimal quantidadeAtual = BigDecimal.ZERO;

    @Column(nullable = false, precision = 10, scale = 3)
    private BigDecimal quantidadeMinima = BigDecimal.ZERO;

    @Column(nullable = false, precision = 10, scale = 3)
    private BigDecimal quantidadeIdeal = BigDecimal.ZERO;

    @Column(nullable = false)
    private Boolean ativo = true;

    @Column(nullable = false)
    private LocalDateTime criadoEm;

    @Column(nullable = false)
    private LocalDateTime atualizadoEm;

    public Produto() {
    }

    public Produto(Integer id, String nome, Categoria categoria, Unidade unidade, BigDecimal quantidadeAtual, BigDecimal quantidadeMinima, BigDecimal quantidadeIdeal, Boolean ativo, LocalDateTime criadoEm, LocalDateTime atualizadoEm) {
        this.id = id;
        this.nome = nome;
        this.categoria = categoria;
        this.unidade = unidade;
        this.quantidadeAtual = quantidadeAtual;
        this.quantidadeMinima = quantidadeMinima;
        this.quantidadeIdeal = quantidadeIdeal;
        this.ativo = ativo;
        this.criadoEm = criadoEm;
        this.atualizadoEm = atualizadoEm;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public Categoria getCategoria() {
        return categoria;
    }

    public void setCategoria(Categoria categoria) {
        this.categoria = categoria;
    }

    public Unidade getUnidade() {
        return unidade;
    }

    public void setUnidade(Unidade unidade) {
        this.unidade = unidade;
    }

    public BigDecimal getQuantidadeAtual() {
        return quantidadeAtual;
    }

    public void setQuantidadeAtual(BigDecimal quantidadeAtual) {
        this.quantidadeAtual = quantidadeAtual;
    }

    public BigDecimal getQuantidadeMinima() {
        return quantidadeMinima;
    }

    public void setQuantidadeMinima(BigDecimal quantidadeMinima) {
        this.quantidadeMinima = quantidadeMinima;
    }

    public BigDecimal getQuantidadeIdeal() {
        return quantidadeIdeal;
    }

    public void setQuantidadeIdeal(BigDecimal quantidadeIdeal) {
        this.quantidadeIdeal = quantidadeIdeal;
    }

    public Boolean getAtivo() {
        return ativo;
    }

    public void setAtivo(Boolean ativo) {
        this.ativo = ativo;
    }

    public LocalDateTime getCriadoEm() {
        return criadoEm;
    }

    public void setCriadoEm(LocalDateTime criadoEm) {
        this.criadoEm = criadoEm;
    }

    public LocalDateTime getAtualizadoEm() {
        return atualizadoEm;
    }

    public void setAtualizadoEm(LocalDateTime atualizadoEm) {
        this.atualizadoEm = atualizadoEm;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        Produto produto = (Produto) o;
        return Objects.equals(id, produto.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }
}
