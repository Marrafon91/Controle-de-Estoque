package https.github.com.fernandesdennys.dispensa.entities.enums;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum TipoMovimentacao {
    ENTRADA,
    SAIDA,
    AJUSTE,
    DESCARTE;

    @JsonCreator
    public static TipoMovimentacao fromString(String value) {
        for (TipoMovimentacao t : values()) {
            if (t.name().equalsIgnoreCase(value.trim())) {
                return t;
            }
        }
        throw new IllegalArgumentException("Tipo de movimentação inválido: " + value + " valores aceitos [ENTRADA, SAIDA, AJUSTE, DESCARTE]");
    }
}
