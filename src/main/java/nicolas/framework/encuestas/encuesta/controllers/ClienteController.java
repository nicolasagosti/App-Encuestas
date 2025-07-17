// src/main/java/nicolas/framework/encuestas/encuesta/controllers/ClienteController.java
package nicolas.framework.encuestas.encuesta.controllers;

import nicolas.framework.encuestas.encuesta.dtos.ClienteInputDTO;
import nicolas.framework.encuestas.encuesta.dtos.EncuestaOutputDTO;
import nicolas.framework.encuestas.encuesta.services.IClienteService;
import nicolas.framework.encuestas.encuesta.services.IEncuestaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/clientes")
public class ClienteController {

    private final IClienteService clienteService;
    private final IEncuestaService encuestaService;

    public ClienteController(IClienteService clienteService,
                             IEncuestaService encuestaService) {
        this.clienteService = clienteService;
        this.encuestaService = encuestaService;
    }


    @PostMapping("/{clienteId}/grupos")
    public ResponseEntity<HttpStatus> asignarGruposACliente(@PathVariable Long clienteId,
                                                            @RequestBody List<Long> idGrupos) {
        clienteService.asignarGruposACliente(clienteId, idGrupos);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @GetMapping("/{clienteId}/encuestas")
    public ResponseEntity<List<EncuestaOutputDTO>> obtenerEncuestas(@PathVariable Long clienteId) {
        List<EncuestaOutputDTO> encuestas = encuestaService.obtenerEncuestasDeCliente(clienteId);
        return ResponseEntity.ok(encuestas);
    }
}
