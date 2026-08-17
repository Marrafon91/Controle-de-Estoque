package https.github.com.fernandesdennys.dispensa.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegistroDTO(
        @NotBlank(message = "O nome é obrigatório")
        String nome,
        @NotBlank @Email(message = "E-mail inválido")
        String email,
        @NotBlank @Size(min = 6, message = "A senha deve ter no mínimo 6 caracteres")
        String senha
) {}