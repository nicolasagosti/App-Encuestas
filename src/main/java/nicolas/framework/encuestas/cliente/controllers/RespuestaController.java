package nicolas.framework.encuestas.cliente.controllers;

import nicolas.framework.encuestas.cliente.dtos.RespuestaInputDTO;
import nicolas.framework.encuestas.encuesta.models.entities.Encuesta;
import nicolas.framework.encuestas.encuesta.services.EncuestaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/encuestas/{encuestaId}/preguntas")
public class RespuestaController {

    @Autowired
    public EncuestaService encuestaService;

    @PostMapping
    public ResponseEntity<Void> ResponderEncuesta(
            @PathVariable Long encuestaId, @RequestBody List<RespuestaInputDTO> respuestas) {

        Optional<Encuesta> encuesta = encuestaService.getEncuestaById(encuestaId);
        if (encuesta.isPresent()) {


        }
    }
}
