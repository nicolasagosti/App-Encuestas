package nicolas.framework.encuestas.encuesta.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClienteOutputDTO {
    private Long id;
    private String mail;
    private String nombre;
    private String apellido;
    private String telefono;
    private String role;
    private Boolean mustChangePassword;

    public ClienteOutputDTO(String mail,
                            String nombre,
                            String apellido,
                            String telefono,
                            String role,
                            boolean mustChangePassword) {
        this.mail = mail;
        this.nombre = nombre;
        this.apellido = apellido;
        this.telefono = telefono;
        this.role = role;
        this.mustChangePassword = mustChangePassword;
    }
}
