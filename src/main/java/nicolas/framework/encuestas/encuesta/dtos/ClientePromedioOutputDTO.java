package nicolas.framework.encuestas.encuesta.dtos;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ClientePromedioOutputDTO {

    Long id;
    String mail;
    Float promedio;

    public ClientePromedioOutputDTO(ClienteOutputDTO cliente, Float promedio) {

        this.id = cliente.getId();
        this.mail = cliente.getMail();
        this.promedio = promedio;
    }
}
