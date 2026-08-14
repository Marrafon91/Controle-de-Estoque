package https.github.com.fernandesdennys.dispensa.repositories;

import https.github.com.fernandesdennys.dispensa.entities.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoriaRepository extends JpaRepository<Categoria,Integer> {
}
