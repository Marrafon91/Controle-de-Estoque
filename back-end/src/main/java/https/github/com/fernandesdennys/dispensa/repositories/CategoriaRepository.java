package https.github.com.fernandesdennys.dispensa.repositories;

import https.github.com.fernandesdennys.dispensa.entities.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CategoriaRepository extends JpaRepository<Categoria,Integer> {

    @Query("""
        SELECT c
        FROM Categoria c
        ORDER BY c.nome
    """)
    List<Categoria> buscarTodas();

    @Query("SELECT c FROM Categoria c WHERE c.id = :id")
    Optional<Categoria> buscarPorId(@Param("id") Integer id);
}
