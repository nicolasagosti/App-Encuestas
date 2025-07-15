package nicolas.framework.encuestas.encuesta.dtos;

import lombok.Data;

import java.util.List;

@Data
public class EncuestaInputDTO {

    private List<Long> grupos;
    private List<Long> preguntas;
    private String periodo;

    public List<Long> getGrupos() {
        return grupos;
    }

    public List<Long> getPreguntas() {
        return preguntas;
    }

    public String getPeriodo() {
        return periodo;
    }
}