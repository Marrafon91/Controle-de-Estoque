package https.github.com.fernandesdennys.dispensa.security;

import https.github.com.fernandesdennys.dispensa.entities.Usuario;
import https.github.com.fernandesdennys.dispensa.repositories.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class UsuarioLogadoService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    public Usuario getUsuarioLogado() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        assert auth != null;
        String email = auth.getName();
        return usuarioRepository.buscarPorEmail(email).orElseThrow();
    }

    public Integer getUsuarioIdLogado() {
        return getUsuarioLogado().getId();
    }
}