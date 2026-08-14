package https.github.com.fernandesdennys.dispensa.entities;

import jakarta.persistence.*;

import java.util.*;

@Entity
@Table(name = "tb_categoria", uniqueConstraints = {@UniqueConstraint(name = "uk_categoria_nome", columnNames = "nome")})
public class Categoria {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 60, unique = true)
    private String nome;

    @OneToMany(mappedBy = "categoria")
    private List<Produto> produtos = new ArrayList<>();

    public Categoria() {
    }

    public Categoria(Integer id, String nome) {
        this.id = id;
        this.nome = nome;
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

    public List<Produto> getProdutos() {
        return produtos;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        Categoria categoria = (Categoria) o;
        return Objects.equals(id, categoria.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }
}

