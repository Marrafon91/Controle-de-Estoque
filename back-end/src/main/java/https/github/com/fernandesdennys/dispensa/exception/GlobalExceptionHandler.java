package https.github.com.fernandesdennys.dispensa.exception;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import tools.jackson.databind.exc.InvalidFormatException;

import java.time.Instant;

@RestControllerAdvice
public class GlobalExceptionHandler {


    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<CustomError> business(ResourceNotFoundException e, HttpServletRequest request) {
        HttpStatus status = HttpStatus.BAD_REQUEST;
        CustomError error = new CustomError(Instant.now(), status.value(), e.getMessage(), request.getRequestURI());
        return ResponseEntity.status(status).body(error);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<CustomError> handleMessageNotReadable(
            HttpMessageNotReadableException e, WebRequest request) {

        Throwable cause = e.getCause();

        // Caso específico: valor inválido pra um Enum
        if (cause instanceof InvalidFormatException ife && ife.getTargetType().isEnum()) {
            String campo = ife.getPath().isEmpty() ? "campo desconhecido" : ife.getPath().getFirst().getPropertyName();
            Object valorInvalido = ife.getValue();
            Object[] valoresValidos = ife.getTargetType().getEnumConstants();

            String mensagem = String.format(
                    "Valor '%s' inválido para o campo '%s'. Valores aceitos: %s",
                    valorInvalido, campo, java.util.Arrays.toString(valoresValidos)
            );

            CustomError err = new CustomError (
                    Instant.now(),
                    HttpStatus.BAD_REQUEST.value(),
                    "Enum inválido",
                    mensagem
            );
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(err);
        }

        // Fallback genérico pra outros erros de parse de JSON
        CustomError err = new CustomError(
                Instant.now(),
                HttpStatus.BAD_REQUEST.value(),
                "Corpo da requisição inválido",
                "Não foi possível interpretar o JSON enviado"
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(err);
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
