package nicolas.framework.encuestas.encuesta.controllers;

import io.swagger.v3.oas.annotations.tags.Tag;
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

    @GetMapping("/grupos/periodo/por-banco")
    public ResponseEntity<List<GrupoPromedioOutputDTO>> todosLosGruposPorBanco(
            @RequestParam LocalDate fechaInicio, @RequestParam LocalDate fechaFin, @RequestParam String banco
    ){
        List<GrupoPromedioOutputDTO> estadisticas = estadisticaService.promediosDeGruposPorBanco(fechaInicio,fechaFin,banco);
        return ResponseEntity.ok(estadisticas);
    }

    @GetMapping("/grupos/periodo/por-cliente")
    public ResponseEntity<List<GrupoPromedioOutputDTO>> todosLosGruposPorReferente(
            @RequestParam LocalDate fechaInicio, @RequestParam LocalDate fechaFin, @RequestParam String referente){
        List <GrupoPromedioOutputDTO> estadisticas = estadisticaService.promediosDeGruposPorReferente(fechaInicio, fechaFin, referente);
        return ResponseEntity.ok(estadisticas);
    }

}
