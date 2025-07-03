package nicolas.framework.encuestas.Services;

import nicolas.framework.encuestas.Auth.AuthResponse;
import nicolas.framework.encuestas.Auth.LoginRequest;
import nicolas.framework.encuestas.Auth.RegisterRequest;

import lombok.RequiredArgsConstructor;
import nicolas.framework.encuestas.Repositories.UserRepository;
import nicolas.framework.encuestas.Role;
import nicolas.framework.encuestas.User;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final JwtService jwtService;

    public AuthResponse login(LoginRequest request) {
        return null;
    }

    public AuthResponse register(RegisterRequest request) {
        User user = User.builder()
                .username(request.getUsername())
                .password(request.getPassword())
                .role(Role.USER)
                .build();

        userRepository.save(user);

        return AuthResponse.builder()
                .token(jwtService.getToken(user))
                .build();
    }
}
