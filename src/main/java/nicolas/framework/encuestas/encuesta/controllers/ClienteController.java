package nicolas.framework.encuestas.encuesta.controllers;


import nicolas.framework.encuestas.encuesta.dtos.EncuestaOutputDTO;
import nicolas.framework.encuestas.encuesta.models.repositories.ClienteRepository;
import nicolas.framework.encuestas.encuesta.services.IEncuestaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

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