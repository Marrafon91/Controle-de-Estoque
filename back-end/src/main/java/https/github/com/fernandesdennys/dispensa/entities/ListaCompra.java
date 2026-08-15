package https.github.com.fernandesdennys.dispensa.entities;

import https.github.com.fernandesdennys.dispensa.entities.enums.StatusListaCompra;
import jakarta.persistence.*;


import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "tb_lista_compra")
public class ListaCompra {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 120)
    private String titulo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private StatusListaCompra status = StatusListaCompra.ABERTA;


    @Column(name = "criado_em", nullable = false)
    private LocalDateTime criadoEm;

    @Column(name = "finalizado_em")
    private LocalDateTime finalizadoEm;

    @OneToMany(
            mappedBy = "listaCompra",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<ListaCompraItem> itens = new ArrayList<>();

    @PrePersist
    protected void prePersist() {
        criadoEm = LocalDateTime.now();

        if (status == null) {
            status = StatusListaCompra.ABERTA;
        }
    }

    public ListaCompra() {
    }

    public ListaCompra(Integer id, String titulo, StatusListaCompra status, LocalDateTime criadoEm, LocalDateTime finalizadoEm) {
        this.id = id;
        this.titulo = titulo;
        this.status = status;
        this.criadoEm = criadoEm;
        this.finalizadoEm = finalizadoEm;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public StatusListaCompra getStatus() {
        return status;
    }

    public void setStatus(StatusListaCompra status) {
        this.status = status;
    }

    public LocalDateTime getCriadoEm() {
        return criadoEm;
    }

    public void setCriadoEm(LocalDateTime criadoEm) {
        this.criadoEm = criadoEm;
    }

    public LocalDateTime getFinalizadoEm() {
        return finalizadoEm;
    }

    public void setFinalizadoEm(LocalDateTime finalizadoEm) {
        this.finalizadoEm = finalizadoEm;
    }

    public List<ListaCompraItem> getItens() {
        return itens;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        ListaCompra that = (ListaCompra) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }
}
