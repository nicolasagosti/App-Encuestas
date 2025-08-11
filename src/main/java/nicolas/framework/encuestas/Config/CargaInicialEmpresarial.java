package nicolas.framework.encuestas.Config;

import nicolas.framework.encuestas.Auth.Services.AuthService;
import nicolas.framework.encuestas.Auth.dtos.RegisterRequest;
import nicolas.framework.encuestas.encuesta.dtos.EncuestaInputDTO;
import nicolas.framework.encuestas.encuesta.dtos.GrupoInputDTO;
import nicolas.framework.encuestas.encuesta.dtos.PreguntaInputDTO;
import nicolas.framework.encuestas.encuesta.models.entities.User;
import nicolas.framework.encuestas.encuesta.models.repositories.BankRepository;
import nicolas.framework.encuestas.encuesta.models.repositories.UserRepository;
import nicolas.framework.encuestas.encuesta.services.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.Base64;
import java.util.List;

import java.time.LocalDate;
import java.util.List;

@Component
public class CargaInicialEmpresarial implements CommandLineRunner {

    private final AuthService authService;
    private final IClienteService clienteService;
    private final IPreguntaService preguntaService;
    private final IGrupoService grupoService;
    private final IEncuestaService encuestaService;
    private final BankService bankService;
    private final BankRepository bankRepository;
    private final UserRepository userRepository;

    public CargaInicialEmpresarial(
            AuthService authService,
            IClienteService clienteService,
            IPreguntaService preguntaService,
            IGrupoService grupoService,
            IEncuestaService encuestaService,
            BankService bankService,
            BankRepository bankRepository,
            UserRepository userRepository
    ) {
        this.authService = authService;
        this.clienteService = clienteService;
        this.preguntaService = preguntaService;
        this.grupoService = grupoService;
        this.encuestaService = encuestaService;
        this.bankService = bankService;
        this.bankRepository = bankRepository;
        this.userRepository = userRepository;
    }



    private void crearUsuarioCompleto(String email, String nombre, String apellido, String telefono) {
        authService.register(new RegisterRequest(email, "1234"));
        userRepository.findUserByUsername(email).ifPresent(user -> {
            user.setNombre(nombre);
            user.setApellido(apellido);
            user.setTelefono(telefono);
            userRepository.save(user);
        });
    }

    private String convertirImagenABase64(String ruta) {
        try {
            Path path = Paths.get(ruta);
            byte[] bytes = Files.readAllBytes(path);
            return Base64.getEncoder().encodeToString(bytes);
        } catch (IOException e) {
            throw new RuntimeException("No se pudo leer la imagen: " + ruta, e);
        }
    }

    @Override
    public void run(String... args) throws Exception {

    }
}