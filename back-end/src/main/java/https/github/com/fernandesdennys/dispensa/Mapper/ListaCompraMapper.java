package https.github.com.fernandesdennys.dispensa.Mapper;

import https.github.com.fernandesdennys.dispensa.dtos.ListaCompraDTO;
import https.github.com.fernandesdennys.dispensa.dtos.ListaCompraItemDTO;
import https.github.com.fernandesdennys.dispensa.entities.ListaCompra;
import https.github.com.fernandesdennys.dispensa.entities.ListaCompraItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ListaCompraMapper {

    ListaCompraDTO toDTO(ListaCompra entity); // "itens" bate por nome, MapStruct usa itemToDTO abaixo pra cada elemento

    @Mapping(target = "produtoId", source = "produto.id")
    @Mapping(target = "produtoNome", source = "produto.nome")
    ListaCompraItemDTO itemToDTO(ListaCompraItem entity);
}