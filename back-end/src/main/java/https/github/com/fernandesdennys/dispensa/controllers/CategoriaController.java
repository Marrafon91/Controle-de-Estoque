package https.github.com.fernandesdennys.dispensa.controllers;

import https.github.com.fernandesdennys.dispensa.dtos.CategoriaDTO;
import https.github.com.fernandesdennys.dispensa.services.CategoriaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categorias")
public class CategoriaController {

    @Autowired
    private CategoriaService categoriaService;

    @GetMapping
    public ResponseEntity<List<CategoriaDTO>> findAllCategories() {
        List<CategoriaDTO> result = categoriaService.findAll();
        return ResponseEntity.ok(result);
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity<CategoriaDTO> findCategoriesById(@PathVariable Integer id) {
        CategoriaDTO result = categoriaService.findById(id);
        return ResponseEntity.ok().body(result);
    }
}
