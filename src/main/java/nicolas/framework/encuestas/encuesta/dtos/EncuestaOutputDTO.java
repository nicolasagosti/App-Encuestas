package nicolas.framework.encuestas.encuesta.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import nicolas.framework.encuestas.encuesta.models.entities.Respuesta;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor // incluye grupoDelCliente
public class EncuestaOutputDTO {
    private Long id;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private LocalDate fechaPCompletarInicio;
    private LocalDate fechaPCompletarFin;
    private List<PreguntaOutputDTO> preguntas;
    private List<RespuestaOutputDTO> respuestas;
    private List<GrupoOutputDTO> grupos;
    private GrupoOutputDTO grupoDelCliente;

    public EncuestaOutputDTO(LocalDate fechaInicio,
                             LocalDate fechaFin,
                             LocalDate fechaPCompletarInicio,
                             LocalDate fechaPCompletarFin,
                             List<PreguntaOutputDTO> preguntas,
                             List<GrupoOutputDTO> grupos,
                             List<RespuestaOutputDTO> respuestas) {
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
        this.fechaPCompletarInicio = fechaPCompletarInicio;
        this.fechaPCompletarFin = fechaPCompletarFin;
        this.preguntas = preguntas;
        this.grupos = grupos;
        this.grupoDelCliente = null;
        this.respuestas = respuestas;
    }

    public EncuestaOutputDTO(Long id, LocalDate fechaInicio,
                             LocalDate fechaFin,
                             LocalDate fechaPCompletarInicio,
                             LocalDate fechaPCompletarFin,
                             List<PreguntaOutputDTO> preguntas,
                             List<GrupoOutputDTO> grupos,
                             List<RespuestaOutputDTO> respuestas) {
        this.id = id;
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
        this.fechaPCompletarInicio = fechaPCompletarInicio;
        this.fechaPCompletarFin = fechaPCompletarFin;
        this.preguntas = preguntas;
        this.grupos = grupos;
        this.grupoDelCliente = null;
        this.respuestas = respuestas;
    }
}
