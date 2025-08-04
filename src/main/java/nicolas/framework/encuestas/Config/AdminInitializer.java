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

        try {
            if (userRepository.findUserByUsername(adminEmail).isEmpty()) {
                User admin = new User();
                admin.setUsername(adminEmail); // email como username
                admin.setPassword(passwordEncoder.encode(adminPassword));
                admin.setRole(Role.ADMIN);
                admin.setMustChangePassword(false); // no lo obliga a cambiar

                // Campos obligatorios que en la base no pueden ser null
                admin.setNombre("Admin");
                admin.setApellido("User");

                // Si hay otras columnas no nulas (ej: telefono), se puede poner valor por defecto:
                // admin.setTelefono(""); // descomentar si hace falta

                userRepository.save(admin);
                System.out.println("🛡️  Usuario admin creado automáticamente");
            } else {
                System.out.println("✅ Usuario admin ya existe");
            }
        } catch (Exception e) {
            System.err.println("❌ Error al inicializar usuario admin: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
