package https.github.com.fernandesdennys.dispensa.dtos;

import https.github.com.fernandesdennys.dispensa.entities.enums.Unidade;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

public record ProdutoQuickInsertDTO(
        @NotBlank(message = "O nome é obrigatório")
        String nome,

        @NotNull(message = "A categoria é obrigatória")
        Integer categoriaId,

        @NotNull(message = "A unidade é obrigatória")
        Unidade unidade,

        @NotNull
        @DecimalMin(
                value = "0.0",
                message = "A quantidade não pode ser negativa"
        )
        BigDecimal quantidadeAtual,

        @NotNull
        @DecimalMin(
                value = "0.0",
                message = "O estoque mínimo deve ser maior que zero"
        )
        BigDecimal quantidadeMinima,

        LocalDate dataValidade
) {
}