// src/main/java/nicolas/framework/encuestas/encuesta/controllers/ClienteController.java
package nicolas.framework.encuestas.encuesta.controllers;

import nicolas.framework.encuestas.encuesta.dtos.EncuestaOutputDTO;
import nicolas.framework.encuestas.encuesta.models.repositories.ClienteRepository;
import nicolas.framework.encuestas.encuesta.services.IEncuestaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/clientes")
public class ClienteController {

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private IEncuestaService encuestaService;

    @GetMapping("/{clienteId}/encuestas")
    public ResponseEntity<List<EncuestaOutputDTO>> obtenerEncuestas(@PathVariable long clienteId) {
        List<EncuestaOutputDTO> encuestas = encuestaService.obtenerEncuestasDeCliente(clienteId);
        return ResponseEntity.ok(encuestas);
    }

}
