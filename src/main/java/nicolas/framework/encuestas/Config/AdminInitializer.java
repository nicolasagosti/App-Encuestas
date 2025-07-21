package nicolas.framework.encuestas.Config;


import jakarta.annotation.PostConstruct;
import nicolas.framework.encuestas.encuesta.models.entities.Role;
import nicolas.framework.encuestas.encuesta.models.entities.User;
import nicolas.framework.encuestas.encuesta.models.repositories.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminInitializer {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostConstruct
    public void initAdminUser() {
        String adminEmail = "admin@gmail.com";
        String adminPassword = "admin";

        // Si ya existe, no hace nada
        if (userRepository.findUserByUsername(adminEmail).isEmpty()) {
            User admin = new User();
            admin.setUsername("Administrador");
            admin.setUsername(adminEmail);
            admin.setPassword(passwordEncoder.encode(adminPassword));
            admin.setRole(Role.valueOf("ADMIN"));
            userRepository.save(admin);

            System.out.println("🛡️  Usuario admin creado automáticamente");
        } else {
            System.out.println("✅ Usuario admin ya existe");
        }
    }
}