package nicolas.framework.encuestas.encuesta.dtos;


import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
public class EncuestaOutputDTO {

    private Long id;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private List<PreguntaOutputDTO> preguntas;
    private List<GrupoOutputDTO> grupos;


    public EncuestaOutputDTO(LocalDate fechaInicio, LocalDate fechaFin, List<PreguntaOutputDTO> preguntas, Long id, List<GrupoOutputDTO> grupos) {
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
        this.preguntas = preguntas;
        this.id = id;
        this.grupos = grupos;
    }

}