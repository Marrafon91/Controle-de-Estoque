package https.github.com.fernandesdennys.dispensa.utils;

import java.util.Set;

public class OrdenacaoWhitelist {

    private OrdenacaoWhitelist() {}

    private static final Set<String> PRODUTO_CAMPOS = Set.of(
            "nome", "quantidade_atual", "quantidade_minima", "quantidade_ideal", "criado_em"
    );

    private static final Set<String> MOVIMENTACAO_CAMPOS = Set.of(
            "criado_em", "quantidade"
    );

    public static String resolverProduto(String campoRequisitado) {
        if (campoRequisitado == null || !PRODUTO_CAMPOS.contains(campoRequisitado)) {
            return "nome"; // default seguro — nunca deixa passar valor arbitrário
        }
        return campoRequisitado;
    }

    public static String resolverMovimentacao(String campoRequisitado) {
        if (campoRequisitado == null || !MOVIMENTACAO_CAMPOS.contains(campoRequisitado)) {
            return "criado_em";
        }
        return campoRequisitado;
    }
}
