package nicolas.framework.encuestas.encuesta.dtos;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ClienteOutputDTO {

    private String mail;
    private Long id;

    public ClienteOutputDTO(String mail, Long id) {
        this.mail = mail;
        this.id = id;
    }

}
