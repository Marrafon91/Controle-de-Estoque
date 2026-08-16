package https.github.com.fernandesdennys.dispensa.dtos;

import jakarta.validation.constraints.NotNull;

public record ListaCompraItemInsertDTO(
        @NotNull(message = "O produto é obrigatório")
        Integer produtoId
) {
}
