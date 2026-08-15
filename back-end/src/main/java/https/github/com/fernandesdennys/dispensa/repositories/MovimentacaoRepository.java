package https.github.com.fernandesdennys.dispensa.repositories;

import https.github.com.fernandesdennys.dispensa.entities.Movimentacao;
import https.github.com.fernandesdennys.dispensa.entities.enums.TipoMovimentacao;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MovimentacaoRepository extends JpaRepository<Movimentacao, Long> {

    @Query("""
                SELECT m
                FROM Movimentacao m
                JOIN FETCH m.produto p
                WHERE p.id = :produtoId
                AND (:tipo IS NULL OR m.tipo = :tipo)
                ORDER BY
                    CASE WHEN :ordenarPor = 'criado_em' THEN m.criadoEm END DESC,
                    CASE WHEN :ordenarPor = 'quantidade' THEN m.quantidade END DESC,
                    m.criadoEm DESC
            """)
    Page<Movimentacao> buscarPorProduto(
            @Param("produtoId") Integer produtoId,
            @Param("tipo") TipoMovimentacao tipo,
            @Param("ordenarPor") String ordenarPor,
            Pageable pageable
    );
}
