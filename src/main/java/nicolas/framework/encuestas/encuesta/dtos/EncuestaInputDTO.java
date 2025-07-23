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


    public List<Long> getGrupos() {
        return grupos;
    }

    public List<Long> getPreguntas() {
        return preguntas;
    }

    public @NotBlank(message = "El campo 'fecha de inicio' es obligatorio") LocalDate getFechaInicio() {
        return fechaInicio;
    }

    public @NotBlank(message = "El campo 'fecha de fin' es obligatorio") LocalDate getFechaFin() {
        return fechaFin;
    }
}