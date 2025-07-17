// src/main/java/nicolas/framework/encuestas/encuesta/controllers/EncuestaController.java
package nicolas.framework.encuestas.encuesta.controllers;

import jakarta.validation.Valid;
import nicolas.framework.encuestas.encuesta.dtos.EncuestaInputDTO;
import nicolas.framework.encuestas.encuesta.dtos.PreguntaInputDTO;
import nicolas.framework.encuestas.encuesta.models.entities.Encuesta;
import nicolas.framework.encuestas.encuesta.models.entities.Pregunta;
import nicolas.framework.encuestas.encuesta.services.IEncuestaService;
import nicolas.framework.encuestas.encuesta.services.IPreguntaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/encuestas")
public class EncuestaController {

    @Autowired
    private IEncuestaService encuestaService;

    @Autowired
    private IPreguntaService preguntaService;

    @PostMapping("/preguntas")
    public ResponseEntity<Pregunta> crearPregunta(@RequestBody PreguntaInputDTO dto) {
        Pregunta pregunta = preguntaService.crearPregunta(dto);
        return new ResponseEntity<>(pregunta, HttpStatus.CREATED);
    }

    @DeleteMapping("/preguntas/{id}")
    public ResponseEntity<Void> eliminarPregunta(@PathVariable Long id) throws ChangeSetPersister.NotFoundException {
        preguntaService.eliminarPregunta(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/preguntas/{id}")
    public ResponseEntity<Pregunta> actualizarPregunta(
            @PathVariable Long id,
            @RequestBody PreguntaInputDTO dto
    ) {
        Pregunta actualizada = preguntaService.editarPregunta(id, dto);
        return ResponseEntity.ok(actualizada);
    }

    @GetMapping("/preguntas")
    public ResponseEntity<List<Pregunta>> obtenerTodas() {
        return ResponseEntity.ok(preguntaService.listarPreguntas());
    }

    @PostMapping
    public ResponseEntity<Encuesta> agregarEncuesta(@Valid @RequestBody EncuestaInputDTO encuesta) {
        this.encuestaService.crearEncuesta(encuesta);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Encuesta>> getEncuestas() {
        List<Encuesta> encuestas = encuestaService.findAll();
        return ResponseEntity.ok(encuestas);
    }
}
