package nicolas.framework.encuestas.encuesta.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GrupoPromedioPorFechaOutputDTO {
    private Long grupoId;
    private String grupoDescripcion;
    private Map<String, Float> promediosPorTrimestre;
}
