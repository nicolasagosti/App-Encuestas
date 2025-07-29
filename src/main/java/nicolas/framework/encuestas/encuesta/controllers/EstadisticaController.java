package nicolas.framework.encuestas.encuesta.controllers;

import io.swagger.v3.oas.annotations.tags.Tag;
import nicolas.framework.encuestas.encuesta.dtos.GrupoPromedioOutputDTO;
import nicolas.framework.encuestas.encuesta.dtos.GrupoPromedioPorFechaOutputDTO;
import nicolas.framework.encuestas.encuesta.services.IEstadisticaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping("/trimestrales")
    public ResponseEntity<List<GrupoPromedioPorFechaOutputDTO>> todosLosGruposPorTrimestre(){
        List<GrupoPromedioPorFechaOutputDTO> estadisticas = estadisticaService.promediosDeTodosLosGruposPorTrimestre();
        return ResponseEntity.ok(estadisticas);
    }


}
