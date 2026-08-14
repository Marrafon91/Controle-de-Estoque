package https.github.com.fernandesdennys.dispensa.controllers;

import https.github.com.fernandesdennys.dispensa.dtos.ProdutoDTO;

import https.github.com.fernandesdennys.dispensa.services.ProdutoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/produtos")
public class ProdutoController {

    @Autowired
    private ProdutoService produtoService;

    @GetMapping
    Page<ProdutoDTO> todosProdutos(
            @RequestParam(required = false) Integer categoria_id,
            @RequestParam(defaultValue = "false") Boolean abaixo_minimo,
            @RequestParam(required = false) String busca,
            @RequestParam(defaultValue = "nome") String ordenar_por,
            @RequestParam(defaultValue = "10") Integer limite,
            @RequestParam(defaultValue = "0") Integer offset
    ) {
        Pageable pageable = PageRequest.of(offset / limite,limite);

        return produtoService.buscarProdutosPorCategoria(
                categoria_id,
                abaixo_minimo,
                busca,
                ordenar_por,
                pageable
        );
    }

    @GetMapping(value = "/all")
    public ResponseEntity<List<ProdutoDTO>> findAllProdutos() {
        List<ProdutoDTO> result = produtoService.findAll();
        return ResponseEntity.ok(result);
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity<ProdutoDTO> findProdutosById(@PathVariable Integer id) {
        ProdutoDTO result = produtoService.findById(id);
        return ResponseEntity.ok().body(result);
    }
}
