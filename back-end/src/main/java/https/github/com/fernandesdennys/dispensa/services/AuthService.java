package https.github.com.fernandesdennys.dispensa.services;

import https.github.com.fernandesdennys.dispensa.dtos.AuthResponseDTO;
import https.github.com.fernandesdennys.dispensa.dtos.LoginDTO;
import https.github.com.fernandesdennys.dispensa.dtos.RegistroDTO;
import https.github.com.fernandesdennys.dispensa.entities.Usuario;
import https.github.com.fernandesdennys.dispensa.exception.EmailJaCadastradoException;
import https.github.com.fernandesdennys.dispensa.repositories.UsuarioRepository;
import https.github.com.fernandesdennys.dispensa.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JwtService jwtService;
    @Autowired
    private AuthenticationManager authenticationManager;

    @Transactional
    public AuthResponseDTO registrar(RegistroDTO dto) {
        if (usuarioRepository.existePorEmail(dto.email())) {
            throw new EmailJaCadastradoException("Este e-mail já está cadastrado");
        }

        Usuario usuario = new Usuario();
        usuario.setNome(dto.nome());
        usuario.setEmail(dto.email());
        usuario.setSenha(passwordEncoder.encode(dto.senha()));
        usuario = usuarioRepository.save(usuario);

        String token = jwtService.gerarToken(usuario.getEmail());
        return new AuthResponseDTO(token, usuario.getId(), usuario.getNome(), usuario.getEmail());
    }

    public AuthResponseDTO login(LoginDTO dto) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(dto.email(), dto.senha())
        ); // lança BadCredentialsException automaticamente se inválido

        Usuario usuario = usuarioRepository.buscarPorEmail(dto.email()).orElseThrow();
        String token = jwtService.gerarToken(usuario.getEmail());
        return new AuthResponseDTO(token, usuario.getId(), usuario.getNome(), usuario.getEmail());
    }
}