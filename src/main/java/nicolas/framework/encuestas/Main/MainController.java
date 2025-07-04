package nicolas.framework.encuestas.Main;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MainController {

    @GetMapping("/api/v1/main")
    public ResponseEntity<String> main() {
        return ResponseEntity.ok("SOLO LLEGAN A ESTA PANTALLA USUARIOS AUTENTICADOS");
    }
}
