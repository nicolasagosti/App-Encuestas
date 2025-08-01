// src/main/java/nicolas/framework/encuestas/Auth/AuthController.java
package nicolas.framework.encuestas.Auth;

import nicolas.framework.encuestas.Auth.dtos.ChangePasswordRequest;
import nicolas.framework.encuestas.Auth.dtos.LoginRequest;
import nicolas.framework.encuestas.Auth.dtos.RegisterRequest;
import nicolas.framework.encuestas.Auth.Services.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PutMapping("/change-password")
    public ResponseEntity<Void> changePassword(@RequestBody ChangePasswordRequest req) {
        authService.changePassword(req.getEmail(), req.getNewPassword());
        return ResponseEntity.noContent().build();
    }
}
