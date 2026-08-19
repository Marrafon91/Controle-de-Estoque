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
import https.github.com.fernandesdennys.dispensa.repositories.ProdutoRepository;
import https.github.com.fernandesdennys.dispensa.security.UsuarioLogadoService;
import https.github.com.fernandesdennys.dispensa.utils.OrdenacaoWhitelist;
import https.github.com.fernandesdennys.dispensa.utils.PaginacaoUtil;
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

    @Autowired
    private UsuarioLogadoService usuarioLogadoService;


    // =========================================================
    // ENTRADA
    // =========================================================

    @Transactional
    public MovimentacaoDTO registrarEntrada(
            Integer produtoId,
            MovimentacaoInsertDTO dto
    ) {

        Produto produto = buscarProdutoAtivo(produtoId);

        BigDecimal resultante =
                produto.getQuantidadeAtual()
                        .add(dto.quantidade());

        return aplicarMovimentacao(
                produto,
                TipoMovimentacao.ENTRADA,
                dto,
                resultante
        );
    }


    // =========================================================
    // CONSUMO
    // =========================================================

    @Transactional
    public MovimentacaoDTO registrarConsumo(
            Integer produtoId,
            MovimentacaoInsertDTO dto
    ) {

        return registrarSaida(
                produtoId,
                dto,
                TipoMovimentacao.SAIDA
        );
    }


    // =========================================================
    // DESCARTE
    // =========================================================

    @Transactional
    public MovimentacaoDTO registrarDescarte(
            Integer produtoId,
            MovimentacaoInsertDTO dto
    ) {

        return registrarSaida(
                produtoId,
                dto,
                TipoMovimentacao.DESCARTE
        );
    }


    // =========================================================
    // AJUSTE
    // =========================================================

    @Transactional
    public MovimentacaoDTO registrarAjuste(
            Integer produtoId,
            MovimentacaoInsertDTO dto
    ) {

        Produto produto = buscarProdutoAtivo(produtoId);

        BigDecimal resultante = dto.quantidade();

        return aplicarMovimentacao(
                produto,
                TipoMovimentacao.AJUSTE,
                dto,
                resultante
        );
    }


    // =========================================================
    // HISTÓRICO
    // =========================================================

    @Transactional(readOnly = true)
    public Page<MovimentacaoDTO> historico(
            Integer produtoId,
            TipoMovimentacao tipo,
            String ordenarPor,
            Integer page,
            Integer size
    ) {

        // Verifica se o produto pertence ao usuário logado
        buscarProdutoAtivo(produtoId);

        String colunaSegura =
                OrdenacaoWhitelist.resolverMovimentacao(ordenarPor);

        int pageClamped =
                PaginacaoUtil.clampPage(page);

        int sizeClamped =
                PaginacaoUtil.clampSize(size);

        Pageable pageable =
                PageRequest.of(
                        pageClamped,
                        sizeClamped,
                        Sort.unsorted()
                );

        return movimentacaoRepository
                .buscarPorProduto(
                        produtoId,
                        tipo,
                        colunaSegura,
                        pageable
                )
                .map(mapper::toDTO);
    }


    // =========================================================
    // SAÍDA
    // =========================================================

    private MovimentacaoDTO registrarSaida(
            Integer produtoId,
            MovimentacaoInsertDTO dto,
            TipoMovimentacao tipo
    ) {

        Produto produto = buscarProdutoAtivo(produtoId);

        BigDecimal resultante =
                produto.getQuantidadeAtual()
                        .subtract(dto.quantidade());

        if (resultante.compareTo(BigDecimal.ZERO) < 0) {

            throw new EstoqueInsuficienteException(
                    String.format(
                            "Estoque insuficiente: disponível %.1f, solicitado %.2f",
                            produto.getQuantidadeAtual(),
                            dto.quantidade()
                    )
            );
        }

        return aplicarMovimentacao(
                produto,
                tipo,
                dto,
                resultante
        );
    }


    // =========================================================
    // APLICA MOVIMENTAÇÃO
    // =========================================================

    private MovimentacaoDTO aplicarMovimentacao(
            Produto produto,
            TipoMovimentacao tipo,
            MovimentacaoInsertDTO dto,
            BigDecimal resultante
    ) {

        Integer usuarioId =
                usuarioLogadoService.getUsuarioIdLogado();

        int linhasAfetadas =
                produtoRepository.atualizarQuantidade(
                        produto.getId(),
                        usuarioId,
                        resultante,
                        LocalDateTime.now()
                );

        if (linhasAfetadas == 0) {

            throw new ResourceNotFoundException(
                    "Produto não encontrado, inativo ou não pertence ao usuário: id "
                            + produto.getId()
            );
        }

        Movimentacao movimentacao =
                mapper.toEntity(dto);

        movimentacao.setProduto(produto);
        movimentacao.setTipo(tipo);

        movimentacao =
                movimentacaoRepository.save(movimentacao);

        return mapper.toDTO(movimentacao);
    }


    // =========================================================
    // BUSCAR PRODUTO DO USUÁRIO LOGADO
    // =========================================================

    private Produto buscarProdutoAtivo(Integer produtoId) {

        Integer usuarioId =
                usuarioLogadoService.getUsuarioIdLogado();

        return produtoRepository
                .buscarPorId(produtoId, usuarioId)
                .orElseThrow(
                        () -> new ResourceNotFoundException(
                                "Produto não encontrado ou não pertence ao usuário: id "
                                        + produtoId
                        )
                );
    }
}