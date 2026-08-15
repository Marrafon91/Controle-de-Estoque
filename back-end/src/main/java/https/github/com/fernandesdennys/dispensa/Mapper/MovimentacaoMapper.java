package https.github.com.fernandesdennys.dispensa.Mapper;

import https.github.com.fernandesdennys.dispensa.dtos.MovimentacaoDTO;
import https.github.com.fernandesdennys.dispensa.dtos.MovimentacaoInsertDTO;
import https.github.com.fernandesdennys.dispensa.entities.Movimentacao;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface MovimentacaoMapper {

    // produto, tipo e criadoEm são setados manualmente pelo Service —
    // não vêm do DTO de request (criadoEm é @CreatedDate, preenchido pela auditoria)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "produto", ignore = true)
    @Mapping(target = "tipo", ignore = true)
    @Mapping(target = "criadoEm", ignore = true)
    Movimentacao toEntity(MovimentacaoInsertDTO dto);

    @Mapping(target = "produtoId", source = "produto.id")
    MovimentacaoDTO toDTO(Movimentacao entity);
}