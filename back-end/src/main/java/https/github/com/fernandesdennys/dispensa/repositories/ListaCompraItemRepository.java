package https.github.com.fernandesdennys.dispensa.repositories;

import https.github.com.fernandesdennys.dispensa.entities.ListaCompraItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface ListaCompraItemRepository extends JpaRepository<ListaCompraItem, Long> {

    // PATCH /listas/{id}/itens/{itemId}
    @Query("""
                SELECT i FROM ListaCompraItem i
                JOIN FETCH i.produto
                WHERE i.id = :itemId AND i.listaCompra.id = :listaId
            """)
    Optional<ListaCompraItem> buscarItemDaLista(@Param("listaId") Integer listaId, @Param("itemId") Long itemId);

    @Modifying
    @Transactional
    @Query("""
                UPDATE ListaCompraItem i
                SET i.quantidadeComprada = :quantidadeComprada, i.comprado = :comprado
                WHERE i.id = :itemId AND i.listaCompra.id = :listaId
            """)
    int atualizarItem(
            @Param("listaId") Integer listaId,
            @Param("itemId") Long itemId,
            @Param("quantidadeComprada") BigDecimal quantidadeComprada,
            @Param("comprado") Boolean comprado
    );

    // usado no finalizar — pega todos os itens marcados como comprados pra dar entrada no estoque
    @Query("""
                SELECT i FROM ListaCompraItem i
                JOIN FETCH i.produto
                WHERE i.listaCompra.id = :listaId AND i.comprado = true
            """)
    List<ListaCompraItem> buscarItensCompradosDaLista(@Param("listaId") Integer listaId);
}