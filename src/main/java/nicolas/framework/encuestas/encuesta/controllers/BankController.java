package nicolas.framework.encuestas.encuesta.controllers;

import nicolas.framework.encuestas.encuesta.dtos.BankInputDTO;
import nicolas.framework.encuestas.encuesta.services.IBankService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/banco")
public class BankController {

    private final IBankService bankService;

    public BankController(IBankService bankService) {
        this.bankService = bankService;
    }

    @PostMapping(
            path = "/agregar",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<BankInputDTO> agregarBanco(
            @RequestParam("extension") String extension,
            @RequestParam("nombre") String nombre,
            @RequestParam("logo") MultipartFile logo
    ) {
        try {
            BankInputDTO dto = bankService.addBank(extension, nombre, logo);
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(dto);
        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .badRequest()
                    .body(null);
        } catch (IOException e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }


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
        return ResponseEntity.ok(dto);
    }


    @GetMapping(
            path = {"/todos", ""},
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<List<BankInputDTO>> obtenerTodosLosBancos() {
        List<BankInputDTO> bancos = bankService.getBanks();
        return ResponseEntity.ok(bancos);
    }
}
