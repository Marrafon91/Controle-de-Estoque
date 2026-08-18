package https.github.com.fernandesdennys.dispensa.services;

import https.github.com.fernandesdennys.dispensa.dtos.CategoriaDTO;
import https.github.com.fernandesdennys.dispensa.entities.Categoria;
import https.github.com.fernandesdennys.dispensa.entities.Usuario;
import https.github.com.fernandesdennys.dispensa.exception.ResourceNotFoundException;
import https.github.com.fernandesdennys.dispensa.repositories.CategoriaRepository;
import https.github.com.fernandesdennys.dispensa.security.UsuarioLogadoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CategoriaService {

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Autowired
    private UsuarioLogadoService usuarioLogadoService;

    private static final List<String> CATEGORIAS_PADRAO = List.of(
            "Mercearia", "Limpeza", "Higiene", "Bebidas", "Carnes",
            "Grãos", "Hortaliças", "Laticínios", "Massas", "Frutas",
            "Congelados", "Temperos", "Produtos de Limpeza"
    );

    @Transactional(readOnly = true)
    public List<CategoriaDTO> findAll() {
        Integer usuarioId = usuarioLogadoService.getUsuarioIdLogado();
        return categoriaRepository.buscarTodas(usuarioId)
                .stream()
                .map(CategoriaDTO::new)
                .toList();
    }

    @Transactional(readOnly = true)
    public CategoriaDTO findById(Integer id) {
        Integer usuarioId = usuarioLogadoService.getUsuarioIdLogado();
        return categoriaRepository.buscarPorId(id, usuarioId)
                .map(CategoriaDTO::new)
                .orElseThrow(() -> new ResourceNotFoundException("Categoria com ID " + id + " não encontrada"));
    }

    // Cria as categorias padrão pro usuário logado, apenas se ele ainda não tiver nenhuma
    @Transactional
    public void semearPadrao() {
        Integer usuarioId = usuarioLogadoService.getUsuarioIdLogado();

        if (!categoriaRepository.buscarTodas(usuarioId).isEmpty()) {
            return; // já tem categoria, não duplica
        }

        Usuario usuario = usuarioLogadoService.getUsuarioLogado();

        List<Categoria> categorias = CATEGORIAS_PADRAO.stream()
                .map(nome -> {
                    Categoria c = new Categoria();
                    c.setNome(nome);
                    c.setUsuario(usuario);
                    return c;
                })
                .toList();

        categoriaRepository.saveAll(categorias);
    }
}