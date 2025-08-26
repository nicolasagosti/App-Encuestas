package nicolas.framework.encuestas.encuesta.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EncuestaInputDTO {
    private List<Long> grupos;
    private List<Long> preguntas;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private LocalDate fechaPCompletarInicio;
    private LocalDate fechaPCompletarFin;
}
