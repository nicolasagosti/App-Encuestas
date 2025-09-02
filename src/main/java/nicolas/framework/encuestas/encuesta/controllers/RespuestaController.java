package nicolas.framework.encuestas.encuesta.controllers;

import io.swagger.v3.oas.annotations.tags.Tag;
import nicolas.framework.encuestas.encuesta.dtos.RespuestaInputDTO;
import nicolas.framework.encuestas.encuesta.dtos.RespuestaOutputDTO;
import nicolas.framework.encuestas.encuesta.models.entities.Respuesta;
import nicolas.framework.encuestas.encuesta.services.IRespuestaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Respuestas")
@RestController
@RequestMapping("/clientes/{clienteId}/encuestas/{encuestaId}/respuestas")
public class RespuestaController {

    @Autowired
    public IRespuestaService respuestaService;

    @PostMapping
    public ResponseEntity<List<Respuesta>> responderEncuesta(@PathVariable Long clienteId,
                                                             @PathVariable Long encuestaId,
                                                             @RequestBody List<RespuestaInputDTO> respuestas) {
        respuestaService.guardarRespuestas(clienteId, encuestaId, respuestas);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping
    public ResponseEntity<List<RespuestaOutputDTO>> obtenerRespuestas(@PathVariable Long clienteId,
                                                                      @PathVariable Long encuestaId) {
        List<RespuestaOutputDTO> respuestas = respuestaService.obtenerRespuestas(clienteId, encuestaId);
        if (respuestas.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(respuestas);
    }

    // ✅ Nuevo endpoint para editar respuestas parciales
    @PutMapping
    public ResponseEntity<Void> editarRespuestas(@PathVariable Long clienteId,
                                                 @PathVariable Long encuestaId,
                                                 @RequestBody List<RespuestaInputDTO> respuestas) {
        respuestaService.editarRespuestas(clienteId, encuestaId, respuestas);
        return ResponseEntity.ok().build();
    }
}
