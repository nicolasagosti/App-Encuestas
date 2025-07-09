package nicolas.framework.encuestas.encuesta.controllers;

import nicolas.framework.encuestas.encuesta.models.entities.Encuesta;
import nicolas.framework.encuestas.encuesta.models.entities.Pregunta;
import nicolas.framework.encuestas.encuesta.services.IEncuestaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/encuesta")
public class EncuestaController {

    private final IEncuestaService encuestaService;

    public EncuestaController(IEncuestaService encuestaService) {
        this.encuestaService = encuestaService;
    }

    @GetMapping
    public ResponseEntity<List<Encuesta>> getAll() {
        List<Encuesta> encuestas = encuestaService.findAll();
        return ResponseEntity.ok(encuestas);
    }

    @PostMapping
    public ResponseEntity<Encuesta> crearEncuesta(){
        Pregunta pregunta = new Pregunta("que dia es hoy?");
        List<Pregunta> preguntas = new ArrayList<>();
        preguntas.add(pregunta);
        Encuesta encuesta = new Encuesta("15-abril/29-abril",preguntas);
        encuestaService.save(encuesta);
        return ResponseEntity.ok(encuesta);
    }




}
