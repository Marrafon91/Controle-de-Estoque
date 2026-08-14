package https.github.com.fernandesdennys.dispensa.repositories;

import https.github.com.fernandesdennys.dispensa.entities.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CategoriaRepository extends JpaRepository<Categoria,Integer> {

    @Query("""
        SELECT c
        FROM Categoria c
        ORDER BY c.nome
    """)
    List<Categoria> buscarTodas();
}
