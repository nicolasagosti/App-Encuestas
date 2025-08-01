package nicolas.framework.encuestas.encuesta.controllers;

import io.swagger.v3.oas.annotations.tags.Tag;
import nicolas.framework.encuestas.encuesta.dtos.ClienteOutputDTO;
import nicolas.framework.encuestas.encuesta.dtos.EncuestaOutputDTO;
import nicolas.framework.encuestas.encuesta.dtos.MailClienteDTO;
import nicolas.framework.encuestas.encuesta.services.IClienteService;
import nicolas.framework.encuestas.encuesta.services.IEncuestaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Clientes")
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

    @PostMapping("/{grupoId}")
    public ResponseEntity<HttpStatus> asignarClientesAGrupo(@PathVariable Long grupoId,
                                                            @RequestBody List<Long> idClientes) {
        clienteService.asignarClientesAGrupo(grupoId, idClientes);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @PostMapping("/id")
    public ResponseEntity<Long> obtenerIdDeCliente(@RequestBody MailClienteDTO dto) {
        Long id = clienteService.obtenerIdDeCLiente(dto.getMailCliente());
        return ResponseEntity.ok(id);
    }

    @GetMapping("/{clienteId}/encuestas")
    public ResponseEntity<List<EncuestaOutputDTO>> obtenerEncuestasDeCliente(@PathVariable Long clienteId) {
        List<EncuestaOutputDTO> encuestas = encuestaService.obtenerEncuestasPendientes(clienteId);
        return ResponseEntity.ok(encuestas);
    }

    @GetMapping
    public ResponseEntity<List<ClienteOutputDTO>> obtenerClientes() {
        List<ClienteOutputDTO> clientes = clienteService.obtenerClientes();
        return ResponseEntity.ok(clientes);
    }

    @GetMapping("/must-change-password")
    public ResponseEntity<Boolean> debeCambiarPassword(@RequestParam("email") String email) {
        boolean flag = clienteService.obtenerMustChangePassword(email);
        return ResponseEntity.ok(flag);
    }
}
