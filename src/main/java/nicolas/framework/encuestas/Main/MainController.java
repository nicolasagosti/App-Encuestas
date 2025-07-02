package nicolas.framework.encuestas.Main;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class MainController {

    @PostMapping(value = "main")
    public String welcome() {
        return "Welcome form secure endpoint";
    }

}
