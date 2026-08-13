package https.github.com.fernandesdennys.dispensa.dtos;

import https.github.com.fernandesdennys.dispensa.entities.Product;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record ProductDTO(
        Long id,
        String name,
        Integer quantity,
        String unit,
        Integer minimumStock,
        LocalDate expirationDate,
        String location,
        String notes,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public ProductDTO(Product product) {
        this(
                product.getId(),
                product.getName(),
                product.getQuantity(),
                product.getUnit(),
                product.getMinimumStock(),
                product.getExpirationDate(),
                product.getLocation(),
                product.getNotes(),
                product.getCreatedAt(),
                product.getUpdatedAt()
        );
    }
}
