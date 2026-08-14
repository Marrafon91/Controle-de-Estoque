package https.github.com.fernandesdennys.dispensa.dtos;

import https.github.com.fernandesdennys.dispensa.entities.ListaCompraItem;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record ListaCompraItemDTO(

        Long id,

        @NotNull(message = "A lista de compra é obrigatória")
        Integer listaId,

        @NotNull(message = "O produto é obrigatório")
        Integer produtoId,

        @NotNull(message = "A quantidade sugerida é obrigatória")
        @DecimalMin(
                value = "0.001",
                message = "A quantidade sugerida deve ser maior que zero"
        )
        @Digits(
                integer = 7,
                fraction = 3,
                message = "A quantidade sugerida deve ter no máximo 7 dígitos inteiros e 3 casas decimais"
        )
        BigDecimal quantidadeSugerida,

        @DecimalMin(
                value = "0.0",
                message = "A quantidade comprada não pode ser negativa"
        )
        @Digits(
                integer = 7,
                fraction = 3,
                message = "A quantidade comprada deve ter no máximo 7 dígitos inteiros e 3 casas decimais"
        )
        BigDecimal quantidadeComprada,

        Boolean comprado

) {
    public ListaCompraItemDTO(ListaCompraItem entity) {
        this(
                entity.getId(),
                entity.getListaCompra().getId(),
                entity.getProduto().getId(),
                entity.getQuantidadeSugerida(),
                entity.getQuantidadeComprada(),
                entity.getComprado()
        );
    }
}
