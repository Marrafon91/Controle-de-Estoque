package https.github.com.fernandesdennys.dispensa.dtos;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record ListaCompraItemUpdateDTO(

        @DecimalMin(value = "0.0", message = "A quantidade comprada não pode ser negativa")
        BigDecimal quantidadeComprada,

        @NotNull(message = "O campo 'comprado' é obrigatório")
        Boolean comprado
) {
}
