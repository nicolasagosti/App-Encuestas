// src/main/java/nicolas/framework/encuestas/Auth/Services/AuthService.java
package nicolas.framework.encuestas.Auth.Services;

import nicolas.framework.encuestas.Auth.AuthResponse;
import nicolas.framework.encuestas.Auth.dtos.LoginRequest;
import nicolas.framework.encuestas.Auth.dtos.RegisterRequest;
import nicolas.framework.encuestas.encuesta.models.repositories.UserRepository;
import nicolas.framework.encuestas.encuesta.models.entities.Role;
import nicolas.framework.encuestas.encuesta.models.entities.User;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    public AuthService(UserRepository userRepository,
                       JwtService jwtService,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );
        UserDetails user = userRepository
                .findByUsername(request.getUsername())
                .orElseThrow();
        String token = jwtService.getToken(user);
        return AuthResponse.builder()
                .token(token)
                .build();
    }

    public AuthResponse register(RegisterRequest request) {
        // Determinar el role; por defecto USER
        Role roleEnum;
        try {
            if (request.getRole() != null) {
                roleEnum = Role.valueOf(request.getRole().toUpperCase());
            } else {
                roleEnum = Role.USER;
            }
        } catch (IllegalArgumentException ex) {
            // Si viene algo distinto de ADMIN/USER, usar USER
            roleEnum = Role.USER;
        }

        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(roleEnum)
                .build();

        userRepository.save(user);

        String token = jwtService.getToken(user);
        return AuthResponse.builder()
                .token(token)
                .build();
    }
}
