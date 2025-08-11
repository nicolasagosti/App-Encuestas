package nicolas.framework.encuestas.encuesta.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor // incluye grupoDelCliente
public class EncuestaOutputDTO {
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private List<PreguntaOutputDTO> preguntas;
    private Long id;
    private List<GrupoOutputDTO> grupos;
    private GrupoOutputDTO grupoDelCliente;

    //sin grupoDelCliente
    public EncuestaOutputDTO(LocalDate fechaInicio,
                             LocalDate fechaFin,
                             List<PreguntaOutputDTO> preguntas,
                             Long id,
                             List<GrupoOutputDTO> grupos) {
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
        this.preguntas = preguntas;
        this.id = id;
        this.grupos = grupos;
        this.grupoDelCliente = null;
    }
}
