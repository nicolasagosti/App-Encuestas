package nicolas.framework.encuestas.encuesta.dtos;


import lombok.Data;

@Data
public class PreguntaInputDTO {
    String texto;

    public PreguntaInputDTO(String texto) {
        this.texto = texto;
    }
}
