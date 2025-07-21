package nicolas.framework.encuestas.encuesta.controllers;

import io.swagger.v3.oas.annotations.tags.Tag;
import nicolas.framework.encuestas.encuesta.services.IEstadisticaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


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


}
