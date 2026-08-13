package https.github.com.fernandesdennys.dispensa.dtos;

import https.github.com.fernandesdennys.dispensa.entities.Category;

import java.time.LocalDateTime;

public record CategoryDTO(
        Long id,
        String name,
        String img,
        LocalDateTime createdAt
) {
    public CategoryDTO(Category category) {
        this(
                category.getId(),
                category.getName(),
                category.getImg(),
                category.getCreatedAt()
        );
    }
}
