package https.github.com.fernandesdennys.dispensa.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ListaCompraGerarDTO(

        @NotBlank(message = "O título é obrigatório")
        @Size(max = 120, message = "O título deve ter no máximo 120 caracteres")
        String titulo
) {
}
