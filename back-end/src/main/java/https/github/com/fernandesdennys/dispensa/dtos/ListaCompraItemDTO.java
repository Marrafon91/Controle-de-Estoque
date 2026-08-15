package https.github.com.fernandesdennys.dispensa.dtos;

import https.github.com.fernandesdennys.dispensa.entities.ListaCompraItem;

import java.math.BigDecimal;

public record ListaCompraItemDTO(
        Long id,
        Integer produtoId,
        String produtoNome,
        BigDecimal quantidadeSugerida,
        BigDecimal quantidadeComprada,
        Boolean comprado
) {
}