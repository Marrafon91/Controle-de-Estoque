package https.github.com.fernandesdennys.dispensa.controllers;

import https.github.com.fernandesdennys.dispensa.dtos.ListaCompraDTO;
import https.github.com.fernandesdennys.dispensa.dtos.ListaCompraGerarDTO;
import https.github.com.fernandesdennys.dispensa.dtos.ListaCompraItemUpdateDTO;
import https.github.com.fernandesdennys.dispensa.entities.enums.StatusListaCompra;
import https.github.com.fernandesdennys.dispensa.services.ListaCompraService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/listas")
public class ListaCompraController {

    @Autowired
    private ListaCompraService service;

    @PostMapping("/gerar")
    public ResponseEntity<ListaCompraDTO> gerar(@Valid @RequestBody ListaCompraGerarDTO dto) {
        ListaCompraDTO novaLista = service.gerar(dto);
        URI uri = URI.create("/listas/" + novaLista.id());
        return ResponseEntity.created(uri).body(novaLista);
    }

    @GetMapping
    public ResponseEntity<List<ListaCompraDTO>> listar(
            @RequestParam(required = false) StatusListaCompra status) {
        return ResponseEntity.ok(service.listar(status));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ListaCompraDTO> buscarPorId(@PathVariable Integer id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @PatchMapping("/{id}/itens/{itemId}")
    public ResponseEntity<ListaCompraDTO> atualizarItem(
            @PathVariable Integer id,
            @PathVariable Long itemId,
            @Valid @RequestBody ListaCompraItemUpdateDTO dto) {
        return ResponseEntity.ok(service.atualizarItem(id, itemId, dto));
    }

    @PostMapping("/{id}/finalizar")
    public ResponseEntity<ListaCompraDTO> finalizar(@PathVariable Integer id) {
        return ResponseEntity.ok(service.finalizar(id));
    }

    @PostMapping("/{id}/cancelar")
    public ResponseEntity<ListaCompraDTO> cancelar(@PathVariable Integer id) {
        return ResponseEntity.ok(service.cancelar(id));
    }
}