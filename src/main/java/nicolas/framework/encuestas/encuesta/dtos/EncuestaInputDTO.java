package nicolas.framework.encuestas.encuesta.dtos;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class EncuestaInputDTO {

    @NotNull(message = "El campo 'grupos' es obligatorio")
    private List<Long> grupos;

    @NotNull(message = "El campo 'preguntas' es obligatorio")
    private List<Long> preguntas;


    @NotNull(message = "El campo 'fecha de inicio' es obligatorio")
    @FutureOrPresent(message = "La fecha de inicio debe ser hoy o en el futuro")
    private LocalDate fechaInicio;


    @NotNull(message = "El campo 'fecha de fin' es obligatorio")
    @FutureOrPresent(message = "La fecha de fin debe ser en el futuro")
    private LocalDate fechaFin;

    public @NotBlank(message = "El campo 'fecha de inicio' es obligatorio") LocalDate getFechaInicio() {
        return fechaInicio;
    }

    public @NotBlank(message = "El campo 'fecha de fin' es obligatorio") LocalDate getFechaFin() {
        return fechaFin;
    }

    public EncuestaInputDTO(List<Long> grupos, List<Long> preguntas, LocalDate fechaInicio, LocalDate fechaFin) {

        this.grupos = grupos;
        this.preguntas = preguntas;
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
    }

    public @NotNull(message = "El campo 'grupos' es obligatorio") List<Long> getGrupos() {
        return grupos;
    }

    public void setGrupos(@NotNull(message = "El campo 'grupos' es obligatorio") List<Long> grupos) {
        this.grupos = grupos;
    }

    public @NotNull(message = "El campo 'preguntas' es obligatorio") List<Long> getPreguntas() {
        return preguntas;
    }

    public void setPreguntas(@NotNull(message = "El campo 'preguntas' es obligatorio") List<Long> preguntas) {
        this.preguntas = preguntas;
    }

    public void setFechaInicio(@NotNull(message = "El campo 'fecha de inicio' es obligatorio") @FutureOrPresent(message = "La fecha de inicio debe ser hoy o en el futuro") LocalDate fechaInicio) {
        this.fechaInicio = fechaInicio;
    }

    public void setFechaFin(@NotNull(message = "El campo 'fecha de fin' es obligatorio") @FutureOrPresent(message = "La fecha de fin debe ser en el futuro") LocalDate fechaFin) {
        this.fechaFin = fechaFin;
    }
}