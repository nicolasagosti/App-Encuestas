package nicolas.framework.encuestas.encuesta.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
public class ClienteInputDTO {

    private String mail;

    public ClienteInputDTO() {
    }

    public ClienteInputDTO(String mail) {
        this.mail = mail;
    }

    public String getMail() {
        return mail;
    }

    public void setMail(String mail) {
        this.mail = mail;
    }
}
