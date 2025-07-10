package nicolas.framework.encuestas.encuesta.controllers;

import nicolas.framework.encuestas.encuesta.dtos.EncuestaInputDTO;
import nicolas.framework.encuestas.encuesta.models.entities.Encuesta;
import nicolas.framework.encuestas.encuesta.models.entities.Pregunta;
import nicolas.framework.encuestas.encuesta.services.IEncuestaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/encuesta")
public class EncuestaController {

    private IEncuestaService encuestaService;

    public EncuestaController(IEncuestaService encuestaService) {
        this.encuestaService = encuestaService;
    }

    @GetMapping
    public ResponseEntity<List<Encuesta>> getAll() {
        List<Encuesta> encuestas = encuestaService.findAll();
        return ResponseEntity.ok(encuestas);
    }

    @PostMapping
    public ResponseEntity<Encuesta> agregarEncuesta(@RequestBody EncuestaInputDTO encuesta) {
        this.encuestaService.crearEncuesta(encuesta);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }




}
