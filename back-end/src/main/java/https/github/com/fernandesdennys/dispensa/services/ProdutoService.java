package https.github.com.fernandesdennys.dispensa.services;

import https.github.com.fernandesdennys.dispensa.Mapper.ProdutoMapper;
import https.github.com.fernandesdennys.dispensa.dtos.ProdutoDTO;
import https.github.com.fernandesdennys.dispensa.dtos.ProdutoInsertDTO;
import https.github.com.fernandesdennys.dispensa.dtos.ProdutoUpdateDTO;
import https.github.com.fernandesdennys.dispensa.entities.Produto;
import https.github.com.fernandesdennys.dispensa.exception.DatabaseException;
import https.github.com.fernandesdennys.dispensa.exception.ResourceNotFoundException;

import https.github.com.fernandesdennys.dispensa.repositories.ProdutoRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;


@Service
public class ProdutoService {

    @Autowired
    private ProdutoRepository produtoRepository;

    @Autowired
    private ProdutoMapper produtoMapper;

    @Transactional(readOnly = true)
    public Page<ProdutoDTO> buscarProdutosPorCategoria(
            Integer categoriaId,
            Boolean abaixoMinimo,
            String busca,
            String ordenarPor,
            Pageable pageable
    ) {
        Page<Produto> result = produtoRepository.buscarProdutos(
                categoriaId,
                abaixoMinimo,
                busca,
                ordenarPor,
                pageable
        );
        return result.map(ProdutoDTO::new);
    }

    @Transactional(readOnly = true)
    public ProdutoDTO findById(Integer id) {
        return produtoRepository.buscarPorId(id)
                .map(ProdutoDTO::new)
                .orElseThrow(() -> new ResourceNotFoundException("Produto com ID " + id + " não encontrada"));
    }

    @Transactional
    public ProdutoDTO insert(ProdutoInsertDTO dto) {
        try {
        Produto produto = produtoMapper.toEntity(dto);
        produto = produtoRepository.save(produto);
        return produtoMapper.toDTO(produto);
        } catch (DataIntegrityViolationException e) {
            throw new DatabaseException("Já existe um produto cadastrado com o nome " + dto.nome());
        }
    }

    @Transactional
    public ProdutoDTO update(ProdutoUpdateDTO dto, Integer id) {
        try {
            Produto produto = produtoRepository.getReferenceById(id);
            produtoMapper.updateEntity(dto, produto);
            produto = produtoRepository.save(produto);
            return produtoMapper.toDTO(produto);
        } catch (EntityNotFoundException e) {
            throw new ResourceNotFoundException("Produto com ID " + id + " não encontrado");
        } catch (DataIntegrityViolationException e) {
            throw new DatabaseException("Já existe um produto cadastrado com o nome " + dto.nome());
        }
    }

    @Transactional
    public void delete(Integer id) {
        int result = produtoRepository.softDelete(id, LocalDateTime.now());

        if (result == 0) {
            throw new ResourceNotFoundException("Produto com ID " + id + " não encontrado");
        }
    }

}
