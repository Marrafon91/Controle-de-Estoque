package https.github.com.fernandesdennys.dispensa.dtos;

import https.github.com.fernandesdennys.dispensa.entities.Categoria;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;


public record CategoriaDTO(

        Integer id,

        @NotBlank(message = "O nome é obrigatório")
        @Size(max = 60, message = "O nome deve ter no máximo 60 caracteres")
        String nome

) {
    public CategoriaDTO(Categoria entity) {
        this(
                entity.getId(),
                entity.getNome()
        );
    }
}

