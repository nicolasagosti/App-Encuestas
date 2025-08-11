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
    public ResponseEntity<?> crearGrupo(@RequestBody GrupoInputDTO dto) {
        try {
            GrupoOutputDTO grupoDTO = grupoService.registrarGrupo(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(grupoDTO);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<GrupoOutputDTO>> obtenerGrupos() {
        return ResponseEntity.ok(grupoService.todosLosGrupos());
    }


    @PutMapping("/{id}")
    public ResponseEntity<?> editarGrupo(@PathVariable Long id, @RequestBody GrupoInputDTO dto) {
        try {
            GrupoOutputDTO actualizado = grupoService.editarGrupo(id, dto);
            return ResponseEntity.ok(actualizado);
        } catch (nicolas.framework.encuestas.Exception.ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }
}
