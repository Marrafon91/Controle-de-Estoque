package https.github.com.fernandesdennys.dispensa.Mapper;

import https.github.com.fernandesdennys.dispensa.dtos.ProdutoDTO;
import https.github.com.fernandesdennys.dispensa.dtos.ProdutoInsertDTO;
import https.github.com.fernandesdennys.dispensa.dtos.ProdutoQuickInsertDTO;
import https.github.com.fernandesdennys.dispensa.dtos.ProdutoUpdateDTO;
import https.github.com.fernandesdennys.dispensa.entities.Produto;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(
        componentModel = "spring",
        uses = CategoriaMapperHelper.class
)
public interface ProdutoMapper {

    // =========================================================
    // INSERT NORMAL
    // =========================================================

    @Mapping(target = "categoria", source = "categoriaId")
    Produto toEntity(ProdutoInsertDTO dto);


    // =========================================================
    // INSERT RÁPIDO
    // =========================================================

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "categoria", ignore = true)
    @Mapping(target = "usuario", ignore = true)
    @Mapping(target = "quantidadeIdeal", ignore = true)
    @Mapping(target = "unidade", constant = "UN")
    @Mapping(target = "ativo", constant = "true")
    Produto toEntity(ProdutoQuickInsertDTO dto);


    // =========================================================
    // ENTITY → DTO
    // =========================================================

    @Mapping(target = "categoriaId", source = "categoria.id")
    ProdutoDTO toDTO(Produto produto);


    // =========================================================
    // UPDATE
    // =========================================================

    @Mapping(target = "categoria", source = "categoriaId")
    @Mapping(target = "id", ignore = true)
    void updateEntity(
            ProdutoUpdateDTO dto,
            @MappingTarget Produto produto
    );
}