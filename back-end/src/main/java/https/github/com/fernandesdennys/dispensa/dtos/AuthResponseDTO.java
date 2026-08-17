package https.github.com.fernandesdennys.dispensa.dtos;

public record AuthResponseDTO(String token, Integer usuarioId, String nome, String email) {
}