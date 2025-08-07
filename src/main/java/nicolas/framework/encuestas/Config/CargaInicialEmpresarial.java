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

    @Override
    @Transactional
    public void run(String... args) {
        if (bankRepository.count() > 0) {
            return; // ya se cargaron bancos
        }

        try {
            // 1. Cargar Bancos (sin logo)
            String BBVA = convertirImagenABase64("C:\\Users\\nicolas.longo\\Desktop\\App-Encuestas\\front\\front\\src\\pages\\FRANCE.png");
            String GALI = convertirImagenABase64("C:\\Users\\nicolas.longo\\Desktop\\App-Encuestas\\front\\front\\src\\pages\\galicia.png");
            bankService.cargarBancoDesdeCargaInicial("bbva.com", "BBVA", BBVA);
            bankService.cargarBancoDesdeCargaInicial("santander.com", "Santander", null);
            bankService.cargarBancoDesdeCargaInicial("galicia.com", "Galicia", GALI);

            // 2. Crear usuarios para cada banco
            crearUsuarioCompleto("ana@bbva.com", "Ana", "Pérez", "123456789");
            crearUsuarioCompleto("luis@bbva.com", "Luis", "Gómez", "234567891");
            crearUsuarioCompleto("carla@santander.com", "Carla", "Fernández", "345678912");
            crearUsuarioCompleto("juan@santander.com", "Juan", "Rodríguez", "456789123");
            crearUsuarioCompleto("martin@galicia.com", "Martín", "Ruiz", "567891234");
            crearUsuarioCompleto("florencia@galicia.com", "Florencia", "Díaz", "678912345");

            // 3. Crear preguntas
            List<Long> preguntas = List.of(
                    preguntaService.crearPregunta(new PreguntaInputDTO("¿Cómo calificarías tu experiencia general?")).getId(),
                    preguntaService.crearPregunta(new PreguntaInputDTO("¿Qué tan satisfecho estás con el soporte recibido?")).getId(),
                    preguntaService.crearPregunta(new PreguntaInputDTO("¿Recomendarías nuestro servicio a otros?")).getId()
            );


            System.out.println("✅ Carga inicial empresarial completada.");
        } catch (Exception e) {
            System.err.println("❌ Error en carga inicial: " + e.getMessage());
            e.printStackTrace();
        }
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

}