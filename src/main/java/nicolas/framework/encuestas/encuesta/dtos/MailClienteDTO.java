package nicolas.framework.encuestas.encuesta.dtos;

import lombok.Data;

@Data
public class MailClienteDTO {
    private String mailCliente;

    public MailClienteDTO(String mailCliente) {
        this.mailCliente = mailCliente;
    }

    public MailClienteDTO() {
    }

    public String getMailCliente() {
        return mailCliente;
    }

    public void setMailCliente(String mailCliente) {
        this.mailCliente = mailCliente;
    }
}

