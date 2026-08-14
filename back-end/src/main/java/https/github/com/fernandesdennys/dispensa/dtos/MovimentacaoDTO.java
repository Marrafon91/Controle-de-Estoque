package https.github.com.fernandesdennys.dispensa.dtos;

import https.github.com.fernandesdennys.dispensa.entities.Movimentacao;
import https.github.com.fernandesdennys.dispensa.entities.enums.TipoMovimentacao;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record MovimentacaoDTO(

        Long id,

        @NotNull(message = "O produto é obrigatório")
        Integer produtoId,

        @NotNull(message = "O tipo da movimentação é obrigatório")
        TipoMovimentacao tipo,

        @NotNull(message = "A quantidade é obrigatória")
        @DecimalMin(value = "0.001", message = "A quantidade deve ser maior que zero")
        @Digits(integer = 7, fraction = 3, message = "A quantidade deve ter no máximo 7 dígitos inteiros e 3 casas decimais")
        BigDecimal quantidade,

        @Size(max = 255, message = "A observação deve ter no máximo 255 caracteres")
        String observacao

) {
    public MovimentacaoDTO(Movimentacao entity) {
        this(
                entity.getId(),
                entity.getProduto().getId(),
                entity.getTipo(),
                entity.getQuantidade(),
                entity.getObservacao()
        );
    }
}
