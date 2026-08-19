package https.github.com.fernandesdennys.dispensa.controllers;

import https.github.com.fernandesdennys.dispensa.dtos.ProdutoDTO;

import https.github.com.fernandesdennys.dispensa.dtos.ProdutoInsertDTO;
import https.github.com.fernandesdennys.dispensa.dtos.ProdutoQuickInsertDTO;
import https.github.com.fernandesdennys.dispensa.dtos.ProdutoUpdateDTO;
import https.github.com.fernandesdennys.dispensa.services.ProdutoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;


@RestController
@RequestMapping("/produtos")
public class ProdutoController {

    @Autowired
    private ProdutoService produtoService;

    @GetMapping
    Page<ProdutoDTO> findAll(
            @RequestParam(required = false) Integer categoria_id,
            @RequestParam(defaultValue = "false") Boolean abaixo_minimo,
            @RequestParam(required = false) String busca,
            @RequestParam(defaultValue = "nome") String ordenar_por,
            @RequestParam(defaultValue = "10") Integer limite,
            @RequestParam(defaultValue = "0") Integer offset
    ) {
        Pageable pageable = PageRequest.of(offset / limite, limite);

        return produtoService.buscarProdutosPorCategoria(
                categoria_id,
                abaixo_minimo,
                busca,
                ordenar_por,
                pageable
        );
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity<ProdutoDTO> findById(@PathVariable Integer id) {
        ProdutoDTO result = produtoService.findById(id);
        return ResponseEntity.ok().body(result);
    }

    @PostMapping("/rapido")
    public ResponseEntity<ProdutoDTO> criarRapido(@Valid @RequestBody ProdutoQuickInsertDTO dto) {
        ProdutoDTO novoProduto = produtoService.criarRapido(dto);
        URI uri = URI.create("/produtos/" + novoProduto.id());
        return ResponseEntity.created(uri).body(novoProduto);
    }

    @PostMapping
    public ResponseEntity<ProdutoDTO> insertProduct(@RequestBody @Valid ProdutoInsertDTO dto) {
        ProdutoDTO result = produtoService.inserir(dto);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}")
                .buildAndExpand(result.id()).toUri();
        return ResponseEntity.created(uri).body(result);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProdutoDTO> updateProduct(@RequestBody @Valid ProdutoUpdateDTO dto,
                                                    @PathVariable Integer id) {
        ProdutoDTO result = produtoService.update(dto, id);
        return ResponseEntity.ok().body(result);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        produtoService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
