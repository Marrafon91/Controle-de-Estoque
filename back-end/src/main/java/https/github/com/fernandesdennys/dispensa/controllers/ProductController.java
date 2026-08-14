package https.github.com.fernandesdennys.dispensa.controllers;

import https.github.com.fernandesdennys.dispensa.dtos.ProdutoDTO;

import https.github.com.fernandesdennys.dispensa.services.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/produtos")
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping
    public ResponseEntity<List<ProdutoDTO>> findAllCategories() {
        List<ProdutoDTO> result = productService.findAll();
        return ResponseEntity.ok(result);
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity<ProdutoDTO> findCategoriesById(@PathVariable Integer id) {
        ProdutoDTO result = productService.findById(id);
        return ResponseEntity.ok().body(result);
    }
}
