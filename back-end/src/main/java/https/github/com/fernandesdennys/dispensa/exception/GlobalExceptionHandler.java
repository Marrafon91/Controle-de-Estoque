package https.github.com.fernandesdennys.dispensa.exception;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;

@RestControllerAdvice
public class GlobalExceptionHandler {


    @ExceptionHandler(EstoqueInsuficienteException.class)
    public ResponseEntity<CustomError> business(EstoqueInsuficienteException e, HttpServletRequest request) {
        HttpStatus status = HttpStatus.UNPROCESSABLE_CONTENT;
        CustomError error = new CustomError(Instant.now(), status.value(), e.getMessage(), request.getRequestURI());
        return ResponseEntity.status(status).body(error);
    }

    //ENUM throw
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<CustomError> httpMessageNotReadable(HttpMessageNotReadableException e, HttpServletRequest request) {
        HttpStatus status = HttpStatus.BAD_REQUEST;
        String mensagem = extrairMensagemLimpa(e);
        CustomError err = new CustomError(Instant.now(), status.value(), mensagem, request.getRequestURI());
        return ResponseEntity.status(status).body(err);
    }

    private String extrairMensagemLimpa(Throwable e) {
        Throwable causaRaiz = e;
        while (causaRaiz.getCause() != null) {
            causaRaiz = causaRaiz.getCause();
        }
        return causaRaiz.getMessage();
    }

    @ExceptionHandler(ForbiddenException.class)
    public ResponseEntity<CustomError> forbidden(ForbiddenException e, HttpServletRequest request) {
        HttpStatus status = HttpStatus.FORBIDDEN;
        CustomError err = new CustomError(Instant.now(), status.value(), e.getMessage(), request.getRequestURI());
        return ResponseEntity.status(status).body(err);
    }


    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<CustomError> resourceNotFound(ResourceNotFoundException e, HttpServletRequest request) {
        HttpStatus status = HttpStatus.NOT_FOUND;
        CustomError error = new CustomError(Instant.now(), status.value(), e.getMessage(), request.getRequestURI());
        return ResponseEntity.status(status).body(error);
    }

    @ExceptionHandler(ListaVaziaException.class)
    public ResponseEntity<CustomError> listaVazia(ListaVaziaException e, HttpServletRequest request) {
        HttpStatus status = HttpStatus.UNPROCESSABLE_CONTENT;
        CustomError err = new CustomError(Instant.now(), status.value(), e.getMessage(), request.getRequestURI());
        return ResponseEntity.status(status).body(err);
    }

    @ExceptionHandler(ListaJaFinalizadaException.class)
    public ResponseEntity<CustomError> listaJaFinalizada(ListaJaFinalizadaException e, HttpServletRequest request) {
        HttpStatus status = HttpStatus.CONFLICT;
        CustomError err = new CustomError(Instant.now(), status.value(), e.getMessage(), request.getRequestURI());
        return ResponseEntity.status(status).body(err);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ValidationError> methodArgumentNotValid(MethodArgumentNotValidException e, HttpServletRequest request) {
        HttpStatus status = HttpStatus.UNPROCESSABLE_CONTENT;
        ValidationError error = new ValidationError(Instant.now(), status.value(), "Erro de Validação", request.getRequestURI());
        for (FieldError f : e.getBindingResult().getFieldErrors()) {
            error.addError(f.getField(), f.getDefaultMessage());
        }
        return ResponseEntity.status(status).body(error);
    }

    @ExceptionHandler(DatabaseException.class)
    public ResponseEntity<CustomError> database(DatabaseException e, HttpServletRequest request) {
        HttpStatus status = HttpStatus.CONFLICT;
        CustomError err = new CustomError(Instant.now(), status.value(), e.getMessage(), request.getRequestURI());
        return ResponseEntity.status(status).body(err);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<CustomError> generic(Exception e, HttpServletRequest request) {
        HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;
        CustomError error = new CustomError(Instant.now(), status.value(), "Erro inesperado", request.getRequestURI());
        return ResponseEntity.status(status).body(error);
    }
}
