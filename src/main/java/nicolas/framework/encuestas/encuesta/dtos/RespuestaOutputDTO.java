package nicolas.framework.encuestas.encuesta.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RespuestaOutputDTO {
    private Long id;
    private Long clienteId;
    private Long grupoId;
    private Long preguntaId;
    private int puntaje;
    private String justificacion;
    private LocalDate fechaRespuesta;
}
