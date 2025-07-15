package nicolas.framework.encuestas.encuesta.controllers;

import nicolas.framework.encuestas.encuesta.dtos.EncuestaInputDTO;
import nicolas.framework.encuestas.encuesta.dtos.PreguntaInputDTO;
import nicolas.framework.encuestas.encuesta.dtos.PreguntaOutputDTO;
import nicolas.framework.encuestas.encuesta.models.entities.Encuesta;
import nicolas.framework.encuestas.encuesta.models.entities.Pregunta;
import nicolas.framework.encuestas.encuesta.services.IEncuestaService;
import nicolas.framework.encuestas.encuesta.services.IPreguntaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/encuesta")
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

    @GetMapping("/preguntas")
    public ResponseEntity<List<PreguntaOutputDTO>> obtenerTodas() {
        List<PreguntaOutputDTO> lista = preguntaService.listarPreguntas()
                .stream()
                .map(PreguntaOutputDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(lista);
    }

    @PostMapping
    public ResponseEntity<Encuesta> agregarEncuesta(@RequestBody EncuestaInputDTO encuesta) {
        this.encuestaService.crearEncuesta(encuesta);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }



}
