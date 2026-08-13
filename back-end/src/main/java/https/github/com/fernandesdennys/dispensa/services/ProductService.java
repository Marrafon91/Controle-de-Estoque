package https.github.com.fernandesdennys.dispensa.services;

import https.github.com.fernandesdennys.dispensa.dtos.ProductDTO;
import https.github.com.fernandesdennys.dispensa.entities.Product;
import https.github.com.fernandesdennys.dispensa.exception.ResourceNotFoundException;

import https.github.com.fernandesdennys.dispensa.repositories.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Transactional(readOnly = true)
    public List<ProductDTO> findAll() {

        List<Product> categories = productRepository.findAll();
        return categories.stream()
                .map(ProductDTO::new)
                .toList();
    }

    @Transactional(readOnly = true)
    public ProductDTO findById(Long id) {
        return productRepository.findById(id)
                .map(ProductDTO::new)
                .orElseThrow(() -> new ResourceNotFoundException("Produto com ID "  + id +  " não encontrada"));
    }
}
