package https.github.com.fernandesdennys.dispensa.entities;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.util.Objects;

@Entity
@Table(name = "tb_lista_compra_item", uniqueConstraints = { @UniqueConstraint(name = "uk_lista_produto", columnNames = {"lista_id", "produto_id"})})
public class ListaCompraItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "lista_id", nullable = false)
    private ListaCompra listaCompra;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "produto_id", nullable = false)
    private Produto produto;

    @Column(name = "quantidade_sugerida", nullable = false, precision = 10, scale = 3)
    private BigDecimal quantidadeSugerida;

    @Column(name = "quantidade_comprada", precision = 10, scale = 3
    )
    private BigDecimal quantidadeComprada;

    @Column(nullable = false)
    private Boolean comprado = false;

    public ListaCompraItem() {
    }

    public ListaCompraItem(Long id, ListaCompra listaCompra, Produto produto, BigDecimal quantidadeSugerida, BigDecimal quantidadeComprada, Boolean comprado) {
        this.id = id;
        this.listaCompra = listaCompra;
        this.produto = produto;
        this.quantidadeSugerida = quantidadeSugerida;
        this.quantidadeComprada = quantidadeComprada;
        this.comprado = comprado;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ListaCompra getListaCompra() {
        return listaCompra;
    }

    public void setListaCompra(ListaCompra listaCompra) {
        this.listaCompra = listaCompra;
    }

    public Produto getProduto() {
        return produto;
    }

    public void setProduto(Produto produto) {
        this.produto = produto;
    }

    public BigDecimal getQuantidadeSugerida() {
        return quantidadeSugerida;
    }

    public void setQuantidadeSugerida(BigDecimal quantidadeSugerida) {
        this.quantidadeSugerida = quantidadeSugerida;
    }

    public BigDecimal getQuantidadeComprada() {
        return quantidadeComprada;
    }

    public void setQuantidadeComprada(BigDecimal quantidadeComprada) {
        this.quantidadeComprada = quantidadeComprada;
    }

    public Boolean getComprado() {
        return comprado;
    }

    public void setComprado(Boolean comprado) {
        this.comprado = comprado;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        ListaCompraItem that = (ListaCompraItem) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }
}
