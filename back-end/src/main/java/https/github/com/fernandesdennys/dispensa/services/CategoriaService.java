package https.github.com.fernandesdennys.dispensa.services;

import https.github.com.fernandesdennys.dispensa.dtos.CategoriaDTO;
import https.github.com.fernandesdennys.dispensa.entities.Categoria;
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

    @Transactional(readOnly = true)
    public List<CategoriaDTO> findAll() {
        Integer usuarioId = usuarioLogadoService.getUsuarioIdLogado();
        List<Categoria> categories = categoriaRepository.buscarTodas(usuarioId);
        return categories.stream()
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
}