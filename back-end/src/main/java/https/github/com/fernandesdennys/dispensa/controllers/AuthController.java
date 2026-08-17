package https.github.com.fernandesdennys.dispensa.controllers;

import https.github.com.fernandesdennys.dispensa.dtos.AuthResponseDTO;
import https.github.com.fernandesdennys.dispensa.dtos.LoginDTO;
import https.github.com.fernandesdennys.dispensa.dtos.RegistroDTO;
import https.github.com.fernandesdennys.dispensa.services.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired private AuthService service;

    @PostMapping("/registrar")
    public ResponseEntity<AuthResponseDTO> registrar(@Valid @RequestBody RegistroDTO dto) {
        return ResponseEntity.ok(service.registrar(dto));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@Valid @RequestBody LoginDTO dto) {
        return ResponseEntity.ok(service.login(dto));
    }
}