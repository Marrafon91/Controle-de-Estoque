package https.github.com.fernandesdennys.dispensa.entities.enums;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum Unidade {
    UN,
    KG,
    G,
    L,
    ML,
    PCT;

    @JsonCreator
    public static Unidade fromString(String value) {
        for (Unidade u : values()) {
            if (u.name().equalsIgnoreCase(value.trim())) {
                return u;
            }
        }
        throw new IllegalArgumentException("Unidade inválida: " + value + " valores aceitos [Un, KG, G, L, ML, PCT]");
    }
}
