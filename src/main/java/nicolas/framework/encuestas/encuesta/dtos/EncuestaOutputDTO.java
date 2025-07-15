package nicolas.framework.encuestas.encuesta.dtos;


import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
public class EncuestaOutputDTO {

    private Long id;
    private String periodo;
    private List<PreguntaOutputDTO> preguntas;
    private List<GrupoOutputDTO> grupos;

    public EncuestaOutputDTO(Long id, String periodo, List<PreguntaOutputDTO> preguntas, List<GrupoOutputDTO> grupos) {
        this.id = id;
        this.periodo = periodo;
        this.preguntas = preguntas;
        this.grupos = grupos;
    }
}