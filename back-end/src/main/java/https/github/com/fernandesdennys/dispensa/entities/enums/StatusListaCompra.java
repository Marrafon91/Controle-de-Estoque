package https.github.com.fernandesdennys.dispensa.entities.enums;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum StatusListaCompra {
    ABERTA,
    FINALIZADA,
    CANCELADA;

    @JsonCreator
    public static StatusListaCompra fromString(String value) {
        for (StatusListaCompra s : values()) {
            if (s.name().equalsIgnoreCase(value.trim())) {
                return s;
            }
        }
        throw new IllegalArgumentException("Status da lista de compra inválido: " + value + " valores aceitos [ABERTA, FINALIZADA, CANCELADA]");
    }
}
