package https.github.com.fernandesdennys.dispensa.services;

import https.github.com.fernandesdennys.dispensa.Mapper.MovimentacaoMapper;
import https.github.com.fernandesdennys.dispensa.dtos.MovimentacaoDTO;
import https.github.com.fernandesdennys.dispensa.dtos.MovimentacaoInsertDTO;
import https.github.com.fernandesdennys.dispensa.entities.Movimentacao;
import https.github.com.fernandesdennys.dispensa.entities.Produto;
import https.github.com.fernandesdennys.dispensa.entities.enums.TipoMovimentacao;
import https.github.com.fernandesdennys.dispensa.exception.EstoqueInsuficienteException;
import https.github.com.fernandesdennys.dispensa.exception.ResourceNotFoundException;
import https.github.com.fernandesdennys.dispensa.repositories.MovimentacaoRepository;
import https.github.com.fernandesdennys.dispensa.utils.OrdenacaoWhitelist;
import https.github.com.fernandesdennys.dispensa.utils.PaginacaoUtil;
import https.github.com.fernandesdennys.dispensa.repositories.ProdutoRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class MovimentacaoService {

    @Autowired
    private ProdutoRepository produtoRepository;

    @Autowired
    private MovimentacaoRepository movimentacaoRepository;

    @Autowired
    private MovimentacaoMapper mapper;

    @Transactional
    public MovimentacaoDTO registrarEntrada(Integer produtoId, MovimentacaoInsertDTO dto) {
        Produto produto = buscarProdutoAtivo(produtoId);
        BigDecimal resultante = produto.getQuantidadeAtual().add(dto.quantidade());
        return aplicarMovimentacao(produto, TipoMovimentacao.ENTRADA, dto, resultante);
    }

    @Transactional
    public MovimentacaoDTO registrarConsumo(Integer produtoId, MovimentacaoInsertDTO dto) {
        return registrarSaida(produtoId, dto, TipoMovimentacao.SAIDA);
    }

    @Transactional
    public MovimentacaoDTO registrarDescarte(Integer produtoId, MovimentacaoInsertDTO dto) {
        return registrarSaida(produtoId, dto, TipoMovimentacao.DESCARTE);
    }

    @Transactional
    public MovimentacaoDTO registrarAjuste(Integer produtoId, MovimentacaoInsertDTO dto) {
        Produto produto = buscarProdutoAtivo(produtoId);
        BigDecimal resultante = dto.quantidade();
        return aplicarMovimentacao(produto, TipoMovimentacao.AJUSTE, dto, resultante);
    }

    @Transactional(readOnly = true)
    public Page<MovimentacaoDTO> historico(Integer produtoId, TipoMovimentacao tipo,
                                           String ordenarPor, Integer page, Integer size) {
        buscarProdutoAtivo(produtoId);

        String colunaSegura = OrdenacaoWhitelist.resolverMovimentacao(ordenarPor);
        int pageClamped = PaginacaoUtil.clampPage(page);
        int sizeClamped = PaginacaoUtil.clampSize(size);

        Pageable pageable = PageRequest.of(pageClamped, sizeClamped, Sort.unsorted());

        return movimentacaoRepository.buscarPorProduto(produtoId, tipo, colunaSegura, pageable)
                .map(mapper::toDTO);
    }

    private MovimentacaoDTO registrarSaida(Integer produtoId, MovimentacaoInsertDTO dto, TipoMovimentacao tipo) {
        Produto produto = buscarProdutoAtivo(produtoId);
        BigDecimal resultante = produto.getQuantidadeAtual().subtract(dto.quantidade());

        if (resultante.compareTo(BigDecimal.ZERO) < 0) {
            throw new EstoqueInsuficienteException(
                    String.format("Estoque insuficiente: disponível %.1f, solicitado %.2f", produto.getQuantidadeAtual(), dto.quantidade()));
        }

        return aplicarMovimentacao(produto, tipo, dto, resultante);
    }

    private MovimentacaoDTO aplicarMovimentacao(Produto produto, TipoMovimentacao tipo,
                                                MovimentacaoInsertDTO dto, BigDecimal resultante) {
        int linhasAfetadas = produtoRepository.atualizarQuantidade(produto.getId(), resultante, LocalDateTime.now());
        if (linhasAfetadas == 0) {
            throw new ResourceNotFoundException("Produto não encontrado ou inativo: id " + produto.getId());
        }

        Movimentacao movimentacao = mapper.toEntity(dto); // seta só quantidade + observacao
        movimentacao.setProduto(produto);
        movimentacao.setTipo(tipo);

        movimentacao = movimentacaoRepository.save(movimentacao);

        return mapper.toDTO(movimentacao);
    }

    private Produto buscarProdutoAtivo(Integer produtoId) {
        try {
            Produto produto = produtoRepository.getReferenceById(produtoId);
            produto.getNome(); // força inicialização do proxy, valida existência já
            if (!produto.getAtivo()) {
                throw new ResourceNotFoundException("Produto não encontrado: id " + produtoId);
            }
            return produto;
        } catch (EntityNotFoundException e) {
            throw new ResourceNotFoundException("Produto não encontrado: id " + produtoId);
        }
    }
}