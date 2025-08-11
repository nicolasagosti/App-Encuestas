package nicolas.framework.encuestas.encuesta.dtos;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class EditarClienteInputDTO {
    private String username;
    private String password;
    private Boolean mustChangePassword;
    private String nombre;
    private String apellido;
    private String telefono;
}
