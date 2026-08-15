package https.github.com.fernandesdennys.dispensa.controllers;

import https.github.com.fernandesdennys.dispensa.dtos.MovimentacaoDTO;
import https.github.com.fernandesdennys.dispensa.dtos.MovimentacaoInsertDTO;
import https.github.com.fernandesdennys.dispensa.entities.enums.TipoMovimentacao;
import https.github.com.fernandesdennys.dispensa.services.MovimentacaoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/produtos/{id}")
public class MovimentacaoController {

    @Autowired
    private MovimentacaoService service;

    @PostMapping("/entrada")
    public ResponseEntity<MovimentacaoDTO> entrada(@PathVariable Integer id, @Valid @RequestBody MovimentacaoInsertDTO dto) {
        MovimentacaoDTO movimentacao = service.registrarEntrada(id, dto);
        return ResponseEntity.ok(movimentacao);
    }

    @PostMapping("/consumo")
    public ResponseEntity<MovimentacaoDTO> consumo(@PathVariable Integer id, @Valid @RequestBody MovimentacaoInsertDTO dto) {
        MovimentacaoDTO movimentacao = service.registrarConsumo(id, dto);
        return ResponseEntity.ok(movimentacao);
    }

    @PostMapping("/descarte")
    public ResponseEntity<MovimentacaoDTO> descarte(@PathVariable Integer id, @Valid @RequestBody MovimentacaoInsertDTO dto) {
        MovimentacaoDTO movimentacao = service.registrarDescarte(id, dto);
        return ResponseEntity.ok(movimentacao);
    }

    @PostMapping("/ajuste")
    public ResponseEntity<MovimentacaoDTO> ajuste(@PathVariable Integer id, @Valid @RequestBody MovimentacaoInsertDTO dto) {
        MovimentacaoDTO movimentacao = service.registrarAjuste(id, dto);
        return ResponseEntity.ok(movimentacao);
    }

    @GetMapping("/movimentacoes")
    public ResponseEntity<Page<MovimentacaoDTO>> movimentacoes(
            @PathVariable Integer id,
            @RequestParam(required = false) TipoMovimentacao tipo,
            @RequestParam(required = false) String ordenarPor,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size) {

        Page<MovimentacaoDTO> resultado = service.historico(id, tipo, ordenarPor, page, size);
        return ResponseEntity.ok(resultado);
    }
}