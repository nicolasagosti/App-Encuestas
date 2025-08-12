package nicolas.framework.encuestas.Auth.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {
    private String username;
    private String password;
    private String role;
    private boolean mustChangePassword = true;
    private String nombre;
    private String apellido;
    private String telefono;



    public RegisterRequest(String mail, String number) {
        this.username = mail;
        this.password = number;
        this.mustChangePassword = true;
    }

}

