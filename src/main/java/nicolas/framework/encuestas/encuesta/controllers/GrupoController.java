package nicolas.framework.encuestas.encuesta.controllers;

import io.swagger.v3.oas.annotations.tags.Tag;
import nicolas.framework.encuestas.encuesta.dtos.GrupoInputDTO;
import nicolas.framework.encuestas.encuesta.dtos.GrupoOutputDTO;
import nicolas.framework.encuestas.encuesta.services.IGrupoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Grupos")
@RestController
@RequestMapping("/grupos")
public class GrupoController {

    @Autowired
    private IGrupoService grupoService;

    @PostMapping
    public ResponseEntity<HttpStatus> agregarGrupo(@RequestBody GrupoInputDTO grupo){

        grupoService.registrarGrupo(grupo);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<GrupoOutputDTO>> obtenerGrupos() {
        return ResponseEntity.ok(grupoService.todosLosGrupos());
    }
}