package nicolas.framework.encuestas.encuesta.controllers;

import nicolas.framework.encuestas.encuesta.services.IEncuestaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/encuestas")
public class EncuestaController {

    @Autowired
    private IEncuestaService encuestaService;

}
