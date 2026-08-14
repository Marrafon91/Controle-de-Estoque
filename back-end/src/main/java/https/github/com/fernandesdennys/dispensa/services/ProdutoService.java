package https.github.com.fernandesdennys.dispensa.services;

import https.github.com.fernandesdennys.dispensa.dtos.ProdutoDTO;
import https.github.com.fernandesdennys.dispensa.entities.Produto;
import https.github.com.fernandesdennys.dispensa.exception.ResourceNotFoundException;

import https.github.com.fernandesdennys.dispensa.repositories.ProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProdutoService {

    @Autowired
    private ProdutoRepository produtoRepository;

    @Transactional(readOnly = true)
    public List<ProdutoDTO> findAll() {

        List<Produto> categories = produtoRepository.findAll();
        return categories.stream()
                .map(ProdutoDTO::new)
                .toList();
    }

    @Transactional(readOnly = true)
    public ProdutoDTO findById(Integer id) {
        return produtoRepository.findById(id)
                .map(ProdutoDTO::new)
                .orElseThrow(() -> new ResourceNotFoundException("Produto com ID "  + id +  " não encontrada"));
    }
}
