package https.github.com.fernandesdennys.dispensa.services;

import https.github.com.fernandesdennys.dispensa.dtos.CategoryDTO;
import https.github.com.fernandesdennys.dispensa.entities.Category;
import https.github.com.fernandesdennys.dispensa.exception.ResourceNotFoundException;
import https.github.com.fernandesdennys.dispensa.repositories.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Transactional(readOnly = true)
    public List<CategoryDTO> findAll() {

        List<Category> categories = categoryRepository.findAll();
        return categories.stream()
                .map(CategoryDTO::new)
                .toList();
    }

    @Transactional(readOnly = true)
    public CategoryDTO findById(Long id) {
        return categoryRepository.findById(id)
                .map(CategoryDTO::new)
                .orElseThrow(() -> new ResourceNotFoundException("Categoria com ID "  + id +  " não encontrada"));
    }

}
