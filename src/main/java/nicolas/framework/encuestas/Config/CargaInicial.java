package nicolas.framework.encuestas.Config;

import nicolas.framework.encuestas.Auth.Services.AuthService;
import nicolas.framework.encuestas.Auth.dtos.RegisterRequest;
import nicolas.framework.encuestas.encuesta.dtos.EncuestaInputDTO;
import nicolas.framework.encuestas.encuesta.dtos.GrupoInputDTO;
import nicolas.framework.encuestas.encuesta.dtos.PreguntaInputDTO;
import nicolas.framework.encuestas.encuesta.models.entities.User;
import nicolas.framework.encuestas.encuesta.models.repositories.UserRepository;
import nicolas.framework.encuestas.encuesta.services.IClienteService;
import nicolas.framework.encuestas.encuesta.services.IEncuestaService;
import nicolas.framework.encuestas.encuesta.services.IGrupoService;
import nicolas.framework.encuestas.encuesta.services.IPreguntaService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Component
public class CargaInicial implements CommandLineRunner {

    private final AuthService authService;
    private final IClienteService clienteService;
    private final IPreguntaService preguntaService;
    private final IGrupoService grupoService;
    private final IEncuestaService encuestaService;
    private final UserRepository usuarioRepository;

    public CargaInicial(
            AuthService authService,
            IClienteService clienteService,
            IPreguntaService preguntaService,
            IGrupoService grupoService,
            IEncuestaService encuestaService,
            UserRepository usuarioRepository
    ) {
        this.authService = authService;
        this.clienteService = clienteService;
        this.preguntaService = preguntaService;
        this.grupoService = grupoService;
        this.encuestaService = encuestaService;
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (usuarioRepository.count() != 0) {
            return; // ya hay datos
        }

        try {
            // 👉 1. Crear clientes (registrar y completar nombre/apellido obligatorios)
            registerAndComplete("u1@gmail.com", "1234", "Usuario", "Uno");
            registerAndComplete("u2@gmail.com", "1234", "Usuario", "Dos");

            Long idCliente1 = clienteService.obtenerIdDeCLiente("u1@gmail.com");
            Long idCliente2 = clienteService.obtenerIdDeCLiente("u2@gmail.com");

            // 👉 2. Crear preguntas
            List<Long> preguntasIds = List.of(
                    preguntaService.crearPregunta(new PreguntaInputDTO("¿Cómo calificarías tu experiencia general?")).getId(),
                    preguntaService.crearPregunta(new PreguntaInputDTO("¿Qué tan satisfecho estás con el soporte recibido?")).getId(),
                    preguntaService.crearPregunta(new PreguntaInputDTO("¿Recomendarías nuestro servicio a otros?")).getId(),
                    preguntaService.crearPregunta(new PreguntaInputDTO("¿La aplicación fue fácil de usar?")).getId(),
                    preguntaService.crearPregunta(new PreguntaInputDTO("¿Hubo demoras en el servicio?")).getId()
            );

            // 👉 3. Crear grupos
            Long grupo1Id = grupoService.registrarGrupo(new GrupoInputDTO("Grupo A", 5, "Grupo A")).getId();
            Long grupo2Id = grupoService.registrarGrupo(new GrupoInputDTO("Grupo B", 5, "Grupo B")).getId();
            Long grupo3Id = grupoService.registrarGrupo(new GrupoInputDTO("Grupo C", 5, "Grupo C")).getId();

            // 👉 4. Asignar grupos a clientes
            clienteService.asignarGruposACliente(idCliente1, List.of(grupo1Id, grupo2Id));
            clienteService.asignarGruposACliente(idCliente2, List.of(grupo2Id, grupo3Id));

            // 👉 5. Crear encuestas para grupos
            LocalDate hoy = LocalDate.now();
            LocalDate fin = hoy.plusDays(7);

            encuestaService.crearEncuesta(new EncuestaInputDTO(List.of(grupo1Id), preguntasIds, hoy, fin));
            encuestaService.crearEncuesta(new EncuestaInputDTO(List.of(grupo2Id), preguntasIds, hoy, fin));
            encuestaService.crearEncuesta(new EncuestaInputDTO(List.of(grupo3Id), preguntasIds, hoy, fin));

            System.out.println("✅ Carga de datos inicial completada.");
        } catch (Exception e) {
            System.err.println("❌ Error en carga inicial: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private void registerAndComplete(String email, String password, String nombre, String apellido) {
        authService.register(new RegisterRequest(email, password));

        usuarioRepository.findUserByUsername(email).ifPresent(user -> {
            boolean changed = false;
            if (user.getNombre() == null || user.getNombre().isBlank()) {
                user.setNombre(nombre);
                changed = true;
            }
            if (user.getApellido() == null || user.getApellido().isBlank()) {
                user.setApellido(apellido);
                changed = true;
            }
            // si hay otros campos NOT NULL en la entidad, setealos aquí también, por ejemplo:
            if (user.getTelefono() == null) {
                user.setTelefono(""); // o algún valor por defecto válido
                changed = true;
            }

            if (changed) {
                usuarioRepository.save(user);
            }
        });
    }
}
