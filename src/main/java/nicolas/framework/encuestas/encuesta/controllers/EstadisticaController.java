package nicolas.framework.encuestas.encuesta.controllers;

import io.swagger.v3.oas.annotations.tags.Tag;
import nicolas.framework.encuestas.encuesta.dtos.ClientePromedioOutputDTO;
import nicolas.framework.encuestas.encuesta.dtos.GrupoPromedioOutputDTO;
import nicolas.framework.encuestas.encuesta.services.IEstadisticaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;


@Tag(name = "Estadisticas")
@RestController
@RequestMapping("/estadisticas")
public class EstadisticaController {

    @Autowired
    IEstadisticaService estadisticaService;

    @GetMapping("/{grupoId}")
    public ResponseEntity<Float> promedioDeGrupo(@PathVariable Long grupoId) {
        return ResponseEntity.ok(estadisticaService.promedioDeGrupo(grupoId));
    }

    @GetMapping
    public ResponseEntity<List<GrupoPromedioOutputDTO>> todosLosGrupos(){
        List<GrupoPromedioOutputDTO> estadisticas = estadisticaService.promediosDeTodosLosGrupos();
        return ResponseEntity.ok(estadisticas);
    }

    @GetMapping("/grupos/periodo")
    public ResponseEntity<List<GrupoPromedioOutputDTO>> todosLosGruposPorPeriodo(@RequestParam LocalDate fechaInicio, @RequestParam LocalDate fechaFin){
        List<GrupoPromedioOutputDTO> estadisticas = estadisticaService.promediosDeTodosLosGruposPorPeriodo(fechaInicio, fechaFin);
        return ResponseEntity.ok(estadisticas);
    }

    @GetMapping("/clientes")
    public ResponseEntity<List<ClientePromedioOutputDTO>> todosLosClientes(){
        List<ClientePromedioOutputDTO> estadisticas = estadisticaService.promediosDeTodosLosClientes();
        return ResponseEntity.ok(estadisticas);
    }

    @GetMapping("/clientes/periodo")
    public ResponseEntity<List<ClientePromedioOutputDTO>> todosLosClientesPorPeriodo(@RequestParam LocalDate fechaInicio, @RequestParam LocalDate fechaFin){
        List<ClientePromedioOutputDTO> estadisticas = estadisticaService.promediosDeTodosLosClientesPorPeriodo(fechaInicio, fechaFin);
        return ResponseEntity.ok(estadisticas);
    }


}
