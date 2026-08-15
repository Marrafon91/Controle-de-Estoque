package https.github.com.fernandesdennys.dispensa.repositories;

import https.github.com.fernandesdennys.dispensa.entities.ListaCompra;
import https.github.com.fernandesdennys.dispensa.entities.enums.StatusListaCompra;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ListaCompraRepository extends JpaRepository<ListaCompra, Integer> {

    // GET /listas/{id} — JOIN FETCH em itens + produto pra evitar N+1 na serialização
    @Query("""
                SELECT DISTINCT l FROM ListaCompra l
                LEFT JOIN FETCH l.itens i
                LEFT JOIN FETCH i.produto
                WHERE l.id = :id
            """)
    Optional<ListaCompra> buscarPorIdComItens(@Param("id") Integer id);

    // POST /listas/{id}/finalizar
    @Modifying
    @Transactional
    @Query("""
                UPDATE ListaCompra l
                SET l.status = :status, l.finalizadoEm = :finalizadoEm
                WHERE l.id = :id AND l.status = 'ABERTA'
            """)
    int finalizar(@Param("id") Integer id, @Param("status") StatusListaCompra status, @Param("finalizadoEm") LocalDateTime finalizadoEm);

    @Modifying
    @Transactional
    @Query("""
            UPDATE ListaCompra l
            SET l.status = 'CANCELADA'
            WHERE l.id = :id AND l.status = 'ABERTA'
        """)
    int cancelar(@Param("id") Integer id);

    @Query("""
            SELECT DISTINCT l FROM ListaCompra l
            LEFT JOIN FETCH l.itens i
            LEFT JOIN FETCH i.produto
            WHERE (:status IS NULL OR l.status = :status)
            ORDER BY l.criadoEm DESC
        """)
    List<ListaCompra> buscarTodas(@Param("status") StatusListaCompra status);
}