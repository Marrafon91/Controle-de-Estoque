package https.github.com.fernandesdennys.dispensa.services;

import https.github.com.fernandesdennys.dispensa.Mapper.ProdutoMapper;
import https.github.com.fernandesdennys.dispensa.dtos.ProdutoDTO;
import https.github.com.fernandesdennys.dispensa.dtos.ProdutoInsertDTO;
import https.github.com.fernandesdennys.dispensa.dtos.ProdutoQuickInsertDTO;
import https.github.com.fernandesdennys.dispensa.dtos.ProdutoUpdateDTO;
import https.github.com.fernandesdennys.dispensa.entities.Categoria;
import https.github.com.fernandesdennys.dispensa.entities.Produto;
import https.github.com.fernandesdennys.dispensa.entities.Usuario;
import https.github.com.fernandesdennys.dispensa.entities.enums.Unidade;
import https.github.com.fernandesdennys.dispensa.exception.DatabaseException;
import https.github.com.fernandesdennys.dispensa.exception.ResourceNotFoundException;
import https.github.com.fernandesdennys.dispensa.repositories.CategoriaRepository;
import https.github.com.fernandesdennys.dispensa.repositories.ProdutoRepository;
import https.github.com.fernandesdennys.dispensa.security.UsuarioLogadoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class ProdutoService {

    @Autowired
    private ProdutoRepository produtoRepository;

    @Autowired
    private ProdutoMapper produtoMapper;

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Autowired
    private UsuarioLogadoService usuarioLogadoService;

    @Transactional(readOnly = true)
    public Page<ProdutoDTO> buscarProdutosPorCategoria(
            Integer categoriaId,
            Boolean abaixoMinimo,
            String busca,
            String ordenarPor,
            Pageable pageable
    ) {
        Integer usuarioId = usuarioLogadoService.getUsuarioIdLogado();
        Page<Produto> result = produtoRepository.buscarProdutos(
                usuarioId,
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
        Integer usuarioId = usuarioLogadoService.getUsuarioIdLogado();
        return produtoRepository.buscarPorId(id, usuarioId)
                .map(ProdutoDTO::new)
                .orElseThrow(() -> new ResourceNotFoundException("Produto com ID " + id + " não encontrada"));
    }

    @Transactional
    public ProdutoDTO criarRapido(ProdutoQuickInsertDTO dto) {
        try {
            Usuario usuario = usuarioLogadoService.getUsuarioLogado();
            Categoria categoria = categoriaRepository.buscarPorId(dto.categoriaId(), usuario.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada: id " + dto.categoriaId()));

            Produto produto = new Produto();
            produto.setNome(dto.nome());
            produto.setCategoria(categoria);
            produto.setUnidade(Unidade.UN);
            produto.setQuantidadeAtual(dto.quantidadeAtual());
            produto.setQuantidadeMinima(dto.quantidadeMinima());
            produto.setQuantidadeIdeal(dto.quantidadeMinima().multiply(BigDecimal.valueOf(2)));
            produto.setAtivo(true);
            produto.setUsuario(usuario);
            produto.setDataValidade(dto.dataValidade());

            produto = produtoRepository.save(produto);
            return produtoMapper.toDTO(produto);
        } catch (DataIntegrityViolationException e) {
            throw new DatabaseException("Já existe um produto cadastrado com o nome " + dto.nome());
        }
    }

    @Transactional
    public ProdutoDTO inserir(ProdutoInsertDTO dto) {
        try {
            Usuario usuario = usuarioLogadoService.getUsuarioLogado();
            Produto entity = produtoMapper.toEntity(dto);
            entity.setUsuario(usuario);
            entity = produtoRepository.save(entity);
            return produtoMapper.toDTO(entity);
        } catch (DataIntegrityViolationException e) {
            throw new DatabaseException("Já existe um produto cadastrado com o nome " + dto.nome());
        }
    }

    @Transactional
    public ProdutoDTO update(ProdutoUpdateDTO dto, Integer id) {
        try {
            Integer usuarioId = usuarioLogadoService.getUsuarioIdLogado();
            // buscarPorId já valida posse (usuarioId) — entidade retornada é gerenciada, pode ser mutada e salva
            Produto produto = produtoRepository.buscarPorId(id, usuarioId)
                    .orElseThrow(() -> new ResourceNotFoundException("Produto com ID " + id + " não encontrado"));

            produtoMapper.updateEntity(dto, produto);
            produto = produtoRepository.save(produto);
            return produtoMapper.toDTO(produto);
        } catch (DataIntegrityViolationException e) {
            throw new DatabaseException("Já existe um produto cadastrado com o nome " + dto.nome());
        }
    }

    @Transactional
    public void delete(Integer id) {
        Integer usuarioId = usuarioLogadoService.getUsuarioIdLogado();
        int result = produtoRepository.softDelete(id, usuarioId, LocalDateTime.now());

        if (result == 0) {
            throw new ResourceNotFoundException("Produto com ID " + id + " não encontrado");
        }
    }
}