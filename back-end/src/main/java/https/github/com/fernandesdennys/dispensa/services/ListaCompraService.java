package https.github.com.fernandesdennys.dispensa.services;

import https.github.com.fernandesdennys.dispensa.Mapper.ListaCompraMapper;
import https.github.com.fernandesdennys.dispensa.dtos.ListaCompraDTO;
import https.github.com.fernandesdennys.dispensa.dtos.ListaCompraGerarDTO;
import https.github.com.fernandesdennys.dispensa.entities.*;
import https.github.com.fernandesdennys.dispensa.entities.enums.StatusListaCompra;
import https.github.com.fernandesdennys.dispensa.entities.enums.TipoMovimentacao;
import https.github.com.fernandesdennys.dispensa.exception.*;
import https.github.com.fernandesdennys.dispensa.repositories.*;
import https.github.com.fernandesdennys.dispensa.security.UsuarioLogadoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ListaCompraService {

    @Autowired
    private ListaCompraRepository listaCompraRepository;

    @Autowired
    private ListaCompraItemRepository listaCompraItemRepository;

    @Autowired
    private ProdutoRepository produtoRepository;

    @Autowired
    private MovimentacaoRepository movimentacaoRepository;

    @Autowired
    private ListaCompraMapper mapper;

    @Autowired
    private UsuarioLogadoService usuarioLogadoService;


    // =========================================================
    // GERAR LISTA DE COMPRA
    // =========================================================

    @Transactional
    public ListaCompraDTO gerar(ListaCompraGerarDTO dto) {

        Usuario usuario = usuarioLogadoService.getUsuarioLogado();

        List<Produto> produtosAbaixoMinimo =
                produtoRepository.buscarProdutosAbaixoDoMinimo(usuario.getId());

        ListaCompra lista = new ListaCompra();

        lista.setTitulo(dto.titulo());
        lista.setStatus(StatusListaCompra.ABERTA);
        lista.setUsuario(usuario);

        for (Produto produto : produtosAbaixoMinimo) {

            ListaCompraItem item = new ListaCompraItem();

            item.setListaCompra(lista);
            item.setProduto(produto);

            BigDecimal quantidadeSugerida =
                    produto.getQuantidadeIdeal()
                            .subtract(produto.getQuantidadeAtual());

            item.setQuantidadeSugerida(quantidadeSugerida);
            item.setComprado(false);

            lista.getItens().add(item);
        }

        lista = listaCompraRepository.save(lista);

        return mapper.toDTO(lista);
    }


    // =========================================================
    // LISTAR LISTAS
    // =========================================================

    @Transactional(readOnly = true)
    public List<ListaCompraDTO> listar(StatusListaCompra status) {

        Integer usuarioId =
                usuarioLogadoService.getUsuarioIdLogado();

        return listaCompraRepository
                .buscarTodas(usuarioId, status)
                .stream()
                .map(mapper::toDTO)
                .toList();
    }


    // =========================================================
    // BUSCAR LISTA POR ID
    // =========================================================

    @Transactional(readOnly = true)
    public ListaCompraDTO buscarPorId(Integer id) {

        Integer usuarioId =
                usuarioLogadoService.getUsuarioIdLogado();

        ListaCompra lista =
                listaCompraRepository
                        .buscarPorIdComItens(id, usuarioId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Lista não encontrada: id " + id
                                )
                        );

        return mapper.toDTO(lista);
    }


    // =========================================================
    // ADICIONAR PRODUTO NA LISTA
    // =========================================================

    @Transactional
    public ListaCompraDTO adicionarItem(
            Integer listaId,
            Integer produtoId
    ) {

        Integer usuarioId =
                usuarioLogadoService.getUsuarioIdLogado();

        // Primeiro valida se a lista pertence ao usuário
        ListaCompra lista =
                listaCompraRepository
                        .buscarPorIdComItens(listaId, usuarioId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Lista não encontrada: id " + listaId
                                )
                        );

        if (lista.getStatus() != StatusListaCompra.ABERTA) {
            throw new ListaJaFinalizadaException(
                    "Lista " + listaId +
                            " já está finalizada ou cancelada"
            );
        }

        if (listaCompraItemRepository
                .existeItemParaProduto(listaId, produtoId)) {

            throw new ItemJaExisteNaListaException(
                    "Este produto já está na lista"
            );
        }

        // IMPORTANTE:
        // busca o produto verificando também o usuário
        Produto produto =
                produtoRepository
                        .buscarPorId(produtoId, usuarioId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Produto não encontrado: id " + produtoId
                                )
                        );

        BigDecimal sugestao =
                produto.getQuantidadeIdeal()
                        .subtract(produto.getQuantidadeAtual());

        if (sugestao.compareTo(BigDecimal.ZERO) <= 0) {
            sugestao = BigDecimal.ONE;
        }

        ListaCompraItem item = new ListaCompraItem();

        item.setListaCompra(lista);
        item.setProduto(produto);
        item.setQuantidadeSugerida(sugestao);
        item.setComprado(false);

        lista.getItens().add(item);

        lista = listaCompraRepository.save(lista);

        return mapper.toDTO(lista);
    }


    // =========================================================
    // ATUALIZAR ITEM DA LISTA
    // =========================================================

    @Transactional
    public ListaCompraDTO atualizarItem(
            Integer listaId,
            Long itemId,
            https.github.com.fernandesdennys.dispensa.dtos.ListaCompraItemUpdateDTO dto
    ) {

        Integer usuarioId =
                usuarioLogadoService.getUsuarioIdLogado();

        // Valida que a lista pertence ao usuário
        listaCompraRepository
                .buscarPorIdComItens(listaId, usuarioId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Lista não encontrada: id " + listaId
                        )
                );

        int linhasAfetadas =
                listaCompraItemRepository.atualizarItem(
                        listaId,
                        itemId,
                        dto.quantidadeComprada(),
                        dto.comprado()
                );

        if (linhasAfetadas == 0) {
            throw new ResourceNotFoundException(
                    "Item " + itemId +
                            " não encontrado na lista " + listaId
            );
        }

        return buscarPorId(listaId);
    }


    // =========================================================
    // SINCRONIZAR LISTA
    // =========================================================

    @Transactional
    public ListaCompraDTO sincronizar(Integer id) {

        Integer usuarioId =
                usuarioLogadoService.getUsuarioIdLogado();

        ListaCompra lista =
                listaCompraRepository
                        .buscarPorIdComItens(id, usuarioId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Lista não encontrada: id " + id
                                )
                        );

        if (lista.getStatus() != StatusListaCompra.ABERTA) {
            throw new ListaJaFinalizadaException(
                    "Lista " + id +
                            " já está finalizada ou cancelada"
            );
        }

        Set<Integer> produtoIdsExistentes =
                lista.getItens()
                        .stream()
                        .map(item -> item.getProduto().getId())
                        .collect(Collectors.toSet());

        // Busca somente produtos do usuário logado
        List<Produto> abaixoMinimo =
                produtoRepository.buscarProdutosAbaixoDoMinimo(
                        usuarioId
                );

        for (Produto produto : abaixoMinimo) {

            if (!produtoIdsExistentes.contains(produto.getId())) {

                ListaCompraItem novoItem =
                        new ListaCompraItem();

                novoItem.setListaCompra(lista);
                novoItem.setProduto(produto);

                BigDecimal quantidadeSugerida =
                        produto.getQuantidadeIdeal()
                                .subtract(produto.getQuantidadeAtual());

                novoItem.setQuantidadeSugerida(
                        quantidadeSugerida
                );

                novoItem.setComprado(false);

                lista.getItens().add(novoItem);
            }
        }

        lista = listaCompraRepository.save(lista);

        return mapper.toDTO(lista);
    }


    // =========================================================
    // FINALIZAR LISTA
    // =========================================================

    @Transactional
    public ListaCompraDTO finalizar(Integer id) {

        Integer usuarioId =
                usuarioLogadoService.getUsuarioIdLogado();

        ListaCompra lista =
                listaCompraRepository
                        .buscarPorIdComItens(id, usuarioId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Lista não encontrada: id " + id
                                )
                        );

        if (lista.getStatus() != StatusListaCompra.ABERTA) {
            throw new ListaJaFinalizadaException(
                    "Lista " + id +
                            " já está finalizada ou cancelada"
            );
        }

        List<ListaCompraItem> itensComprados =
                listaCompraItemRepository
                        .buscarItensCompradosDaLista(id);

        for (ListaCompraItem item : itensComprados) {

            BigDecimal quantidade =
                    item.getQuantidadeComprada() != null
                            ? item.getQuantidadeComprada()
                            : item.getQuantidadeSugerida();

            Produto produto = item.getProduto();

            BigDecimal novaQuantidade =
                    produto.getQuantidadeAtual()
                            .add(quantidade);

            // Atualiza o estoque somente se o produto
            // pertencer ao usuário logado
            int linhasAfetadas =
                    produtoRepository.atualizarQuantidade(
                            produto.getId(),
                            usuarioId,
                            novaQuantidade,
                            LocalDateTime.now()
                    );

            if (linhasAfetadas == 0) {
                throw new ResourceNotFoundException(
                        "Produto não encontrado ou não pertence ao usuário: id "
                                + produto.getId()
                );
            }

            // Registra a movimentação
            Movimentacao mov = new Movimentacao();

            mov.setProduto(produto);
            mov.setTipo(TipoMovimentacao.ENTRADA);
            mov.setQuantidade(quantidade);
            mov.setObservacao(
                    "Compra via lista #" + id
            );

            movimentacaoRepository.save(mov);
        }

        int linhasAfetadas =
                listaCompraRepository.finalizar(
                        id,
                        usuarioId,
                        StatusListaCompra.FINALIZADA,
                        LocalDateTime.now()
                );

        if (linhasAfetadas == 0) {
            throw new ListaJaFinalizadaException(
                    "Lista " + id +
                            " já está finalizada ou cancelada"
            );
        }

        return buscarPorId(id);
    }


    // =========================================================
    // CANCELAR LISTA
    // =========================================================

    @Transactional
    public ListaCompraDTO cancelar(Integer id) {

        Integer usuarioId =
                usuarioLogadoService.getUsuarioIdLogado();

        int linhasAfetadas =
                listaCompraRepository.cancelar(
                        id,
                        usuarioId
                );

        if (linhasAfetadas == 0) {
            throw new ResourceNotFoundException(
                    "Lista não encontrada ou já finalizada/cancelada: id "
                            + id
            );
        }

        return buscarPorId(id);
    }
}