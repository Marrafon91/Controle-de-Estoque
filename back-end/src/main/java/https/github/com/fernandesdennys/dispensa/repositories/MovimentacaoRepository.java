package https.github.com.fernandesdennys.dispensa.repositories;

import https.github.com.fernandesdennys.dispensa.entities.Movimentacao;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MovimentacaoRepository extends JpaRepository<Movimentacao, Long> {
}
