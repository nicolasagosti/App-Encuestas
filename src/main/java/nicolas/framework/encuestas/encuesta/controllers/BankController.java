// src/main/java/nicolas/framework/encuestas/encuesta/controllers/BankController.java
package nicolas.framework.encuestas.encuesta.controllers;

import nicolas.framework.encuestas.encuesta.dtos.BankInputDTO;
import nicolas.framework.encuestas.encuesta.services.IBankService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/banco")
public class BankController {

    private final IBankService bankService;

    public BankController(IBankService bankService) {
        this.bankService = bankService;
    }

    /**
     * Agrega un nuevo banco.
     * Espera multipart/form-data con:
     *  - extension (text)
     *  - logo      (file)
     */
    @PostMapping(
            path = "/agregar",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<BankInputDTO> agregarBanco(
            @RequestParam("extension") String extension,
            @RequestParam("logo") MultipartFile logo
    ) {
        try {
            BankInputDTO dto = bankService.addBank(extension, logo);
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(dto);
        } catch (IllegalArgumentException e) {
            // Parámetro inválido (p.ej. extension vacía)
            return ResponseEntity
                    .badRequest()
                    .build();
        } catch (IOException e) {
            // Error al leer el archivo
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .build();
        }
    }

    /**
     * Obtiene un banco por su extensión.
     * Devuelve JSON con extensión y logo en Base64.
     */
    @GetMapping(
            path = "/obtener/{extension}",
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<BankInputDTO> obtenerBanco(
            @PathVariable("extension") String extension
    ) {
        BankInputDTO dto = bankService.getBank(extension);
        if (dto == null) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .build();
        }
        return ResponseEntity
                .ok(dto);
    }
}
