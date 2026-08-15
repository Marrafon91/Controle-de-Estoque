package https.github.com.fernandesdennys.dispensa.dtos;

import https.github.com.fernandesdennys.dispensa.entities.Movimentacao;
import https.github.com.fernandesdennys.dispensa.entities.enums.TipoMovimentacao;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record MovimentacaoDTO(

        Long id,
        Integer produtoId,
        TipoMovimentacao tipo,
        BigDecimal quantidade,
        String observacao,
        LocalDateTime criadoEm

) {
    public MovimentacaoDTO(Movimentacao entity) {
        this(
                entity.getId(),
                entity.getProduto().getId(),
                entity.getTipo(),
                entity.getQuantidade(),
                entity.getObservacao(),
                entity.getCriadoEm()
        );
    }
}