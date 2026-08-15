package https.github.com.fernandesdennys.dispensa.dtos;

import https.github.com.fernandesdennys.dispensa.entities.ListaCompra;
import https.github.com.fernandesdennys.dispensa.entities.enums.StatusListaCompra;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;
import java.util.List;

public record ListaCompraDTO(
        Integer id,

        @NotBlank(message = "O título é obrigatório")
        @Size(max = 120, message = "O título deve ter no máximo 120 caracteres")
        String titulo,
        StatusListaCompra status,
        LocalDateTime criadoEm,
        LocalDateTime finalizadoEm,
        List<ListaCompraItemDTO> itens
) {
}
