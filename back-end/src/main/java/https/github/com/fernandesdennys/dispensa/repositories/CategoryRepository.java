package https.github.com.fernandesdennys.dispensa.repositories;

import https.github.com.fernandesdennys.dispensa.entities.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category,Long> {
}
