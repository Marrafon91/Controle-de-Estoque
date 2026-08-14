package https.github.com.fernandesdennys.dispensa.controllers;

import https.github.com.fernandesdennys.dispensa.dtos.CategoriaDTO;
import https.github.com.fernandesdennys.dispensa.services.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @GetMapping
    public ResponseEntity<List<CategoriaDTO>> findAllCategories() {
        List<CategoriaDTO> result = categoryService.findAll();
        return ResponseEntity.ok(result);
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity<CategoriaDTO> findCategoriesById(@PathVariable Integer id) {
        CategoriaDTO result = categoryService.findById(id);
        return ResponseEntity.ok().body(result);
    }
}
