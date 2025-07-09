package nicolas.framework.encuestas.Main;

import nicolas.framework.encuestas.encuesta.models.entities.Encuesta;
import nicolas.framework.encuestas.encuesta.services.IEncuestaService;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class MainController {
    private final IEncuestaService encuestaService;

    public MainController(IEncuestaService encuestaService) {
        this.encuestaService = encuestaService;
    }

    @GetMapping("/api/v1/main")
    public ResponseEntity<List<Encuesta>> main() {
        return ResponseEntity.ok(encuestaService.findAll());
    }

//    @PostMapping("/encuestas")
//    public ResponseEntity<Encuesta> crearEncuesta(@RequestBody Encuesta encuesta) {
//        Encuesta saved = encuestaService.save(encuesta);
//        return new ResponseEntity<>(saved, HttpStatusCode.valueOf(200));
//    }
}
