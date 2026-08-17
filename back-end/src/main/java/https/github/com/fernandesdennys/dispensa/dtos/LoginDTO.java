package https.github.com.fernandesdennys.dispensa.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginDTO(
        @NotBlank @Email(message = "E-mail inválido")
        String email,
        @NotBlank
        String senha
) {}