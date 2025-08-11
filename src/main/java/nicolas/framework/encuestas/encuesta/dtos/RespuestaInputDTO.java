package nicolas.framework.encuestas.encuesta.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RespuestaInputDTO {
    private Long preguntaId;
    private Long grupoId;
    private int puntaje;
    private String justificacion;
}
