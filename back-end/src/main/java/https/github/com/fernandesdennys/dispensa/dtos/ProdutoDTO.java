package https.github.com.fernandesdennys.dispensa.dtos;

import https.github.com.fernandesdennys.dispensa.entities.Produto;
import https.github.com.fernandesdennys.dispensa.entities.enums.Unidade;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public record ProdutoDTO(
        Integer id,
        String nome,
        Integer categoriaId,
        Unidade unidade,
        BigDecimal quantidadeAtual,
        BigDecimal quantidadeMinima,
        BigDecimal quantidadeIdeal,
        Boolean ativo
) {
    public ProdutoDTO(Produto entity) {
        this(
                entity.getId(),
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