// src/main/java/nicolas/framework/encuestas/Auth/Services/AuthService.java
package nicolas.framework.encuestas.Auth.Services;

import nicolas.framework.encuestas.Auth.AuthResponse;
import nicolas.framework.encuestas.Auth.dtos.LoginRequest;
import nicolas.framework.encuestas.Auth.dtos.RegisterRequest;
import nicolas.framework.encuestas.encuesta.models.repositories.UserRepository;
import nicolas.framework.encuestas.encuesta.models.entities.Role;
import nicolas.framework.encuestas.encuesta.models.entities.User;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    public AuthService(
            UserRepository userRepository,
            JwtService jwtService,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager
    ) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
    }

    public AuthResponse login(LoginRequest request) {
        // 1) Autentica credenciales
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        // 2) Busca el usuario
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario o contraseña inválidos")
                );

        // 3) Genera token en todos los casos
        String token = jwtService.getToken(user);

        System.out.println("Usuario: " + user.getUsername() + ", mustChangePassword: " + user.isMustChangePassword());
        // 4) Devuelve token + flag mustChangePassword
        return AuthResponse.builder()
                .token(token)
                .mustChangePassword(user.isMustChangePassword())
                .build();
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Ya existe un usuario con ese email"
            );
        }

        Role roleEnum;
        try {
            roleEnum = request.getRole() != null
                    ? Role.valueOf(request.getRole().toUpperCase())
                    : Role.USER;
        } catch (IllegalArgumentException ex) {
            roleEnum = Role.USER;
        }

        boolean mustChange = roleEnum != Role.ADMIN; // los ADMIN no deben cambiar

        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(roleEnum)
                .mustChangePassword(mustChange)
                .build();
        userRepository.save(user);

        String token = jwtService.getToken(user);
        return AuthResponse.builder()
                .token(token)
                .mustChangePassword(mustChange)
                .build();
    }


    public void changePassword(String username, String newPassword) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado")
                );
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setMustChangePassword(false);
        userRepository.save(user);
    }
}
