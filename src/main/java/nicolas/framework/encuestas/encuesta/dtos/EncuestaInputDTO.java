package nicolas.framework.encuestas.encuesta.dtos;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
public class EncuestaInputDTO {
    private List<Long> grupos;
    private List<Long> preguntas;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;

    public EncuestaInputDTO() {
    }

    public EncuestaInputDTO(List<Long> grupos, List<Long> preguntas, LocalDate fechaInicio, LocalDate fechaFin) {
        this.grupos = grupos;
        this.preguntas = preguntas;
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
    }

    public List<Long> getGrupos() {
        return grupos;
    }

    public void setGrupos(List<Long> grupos) {
        this.grupos = grupos;
    }

    public List<Long> getPreguntas() {
        return preguntas;
    }

    public void setPreguntas(List<Long> preguntas) {
        this.preguntas = preguntas;
    }

    public LocalDate getFechaInicio() {
        return fechaInicio;
    }

    public void setFechaInicio(LocalDate fechaInicio) {
        this.fechaInicio = fechaInicio;
    }

    public LocalDate getFechaFin() {
        return fechaFin;
    }

    public void setFechaFin(LocalDate fechaFin) {
        this.fechaFin = fechaFin;
    }
}
