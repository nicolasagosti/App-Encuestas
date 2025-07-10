package nicolas.framework.encuestas.encuesta.dtos;

import lombok.Data;

import java.util.List;

@Data
public class EncuestaInputDTO {

    private List<String> preguntas;
    private String periodo;

    public List<String> getPreguntas() {
        return preguntas;
    }

    public String getPeriodo() {
        return periodo;
    }
}