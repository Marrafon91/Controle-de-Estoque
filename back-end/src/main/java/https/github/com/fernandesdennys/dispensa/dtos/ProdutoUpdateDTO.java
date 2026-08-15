package https.github.com.fernandesdennys.dispensa.dtos;

import https.github.com.fernandesdennys.dispensa.entities.Produto;
import https.github.com.fernandesdennys.dispensa.entities.enums.Unidade;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public record ProdutoUpdateDTO(

        @NotBlank(message = "O nome é obrigatório")
        @Size(max = 120, message = "O nome deve ter no máximo 120 caracteres")
        String nome,

        @NotNull(message = "A categoria é obrigatória")
        Integer categoriaId,

        @NotNull(message = "A unidade é obrigatória")
        Unidade unidade,

        @NotNull(message = "A quantidade atual é obrigatória")
        @DecimalMin(value = "0.0", message = "A quantidade atual não pode ser negativa")
        @Digits(integer = 7, fraction = 3,
                message = "A quantidade atual deve ter no máximo 7 dígitos inteiros e 3 casas decimais")
        BigDecimal quantidadeAtual,

        @NotNull(message = "A quantidade mínima é obrigatória")
        @DecimalMin(value = "0.0", message = "A quantidade mínima não pode ser negativa")
        @Digits(integer = 7, fraction = 3,
                message = "A quantidade mínima deve ter no máximo 7 dígitos inteiros e 3 casas decimais")
        BigDecimal quantidadeMinima,

        @NotNull(message = "A quantidade ideal é obrigatória")
        @DecimalMin(value = "0.0", message = "A quantidade ideal não pode ser negativa")
        @Digits(integer = 7, fraction = 3,
                message = "A quantidade ideal deve ter no máximo 7 dígitos inteiros e 3 casas decimais")
        BigDecimal quantidadeIdeal,

        @NotNull(message = "O campo ativo é obrigatório")
        Boolean ativo
) {
    public ProdutoUpdateDTO(Produto entity) {
        this(
                entity.getNome(),
                entity.getCategoria().getId(),
                entity.getUnidade(),
                entity.getQuantidadeAtual(),
                entity.getQuantidadeMinima(),
                entity.getQuantidadeIdeal(),
                entity.getAtivo()
        );
    }
}