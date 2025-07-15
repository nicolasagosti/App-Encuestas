package nicolas.framework.encuestas.encuesta.dtos;

import nicolas.framework.encuestas.encuesta.models.entities.Pregunta;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data

public class PreguntaOutputDTO {

    private Long id;
    private String texto;

    public PreguntaOutputDTO(Long id, String texto) {
        this.id = id;
        this.texto = texto;
    }
}