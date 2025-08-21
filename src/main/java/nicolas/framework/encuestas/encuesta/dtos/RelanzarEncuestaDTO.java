package nicolas.framework.encuestas.encuesta.dtos;

import lombok.Data;

import java.time.LocalDate;

@Data
public class RelanzarEncuestaDTO {

    LocalDate fechaInicio;
    LocalDate fechaFin;
}
