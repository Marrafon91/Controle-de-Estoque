package https.github.com.fernandesdennys.dispensa.Mapper;

import https.github.com.fernandesdennys.dispensa.entities.Categoria;
import https.github.com.fernandesdennys.dispensa.exception.ResourceNotFoundException;
import https.github.com.fernandesdennys.dispensa.repositories.CategoriaRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * Componente auxiliar usado pelo MapStruct (via "uses") para converter
 * categoriaId (Integer) em uma entidade Categoria de verdade, buscando no banco.
 * Sem isso, o MapStruct simplesmente ignora o campo e deixa "categoria" nulo
 * no Produto, causando erro de NOT NULL no insert/update.
 */
@Component
public class CategoriaMapperHelper {

    private final CategoriaRepository categoriaRepository;

    public CategoriaMapperHelper(CategoriaRepository categoriaRepository) {
        this.categoriaRepository = categoriaRepository;
    }

    public Categoria map(Integer categoriaId) {
        if (categoriaId == null) {
            return null;
        }
        return categoriaRepository.findById(categoriaId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Categoria não encontrada: id " + categoriaId));
    }
}