package https.github.com.fernandesdennys.dispensa.repositories;

import https.github.com.fernandesdennys.dispensa.entities.Produto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProdutoRepository extends JpaRepository<Produto, Integer> {
}
