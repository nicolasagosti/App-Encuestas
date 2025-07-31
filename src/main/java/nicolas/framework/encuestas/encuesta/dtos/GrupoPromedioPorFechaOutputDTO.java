package nicolas.framework.encuestas.encuesta.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Map;

@Data
public class GrupoPromedioPorFechaOutputDTO {
    private Long grupoId;
    private String grupoDescripcion;
    private Map<String, Float> promediosPorTrimestre;

    public GrupoPromedioPorFechaOutputDTO() {
    }

    public GrupoPromedioPorFechaOutputDTO(Long grupoId, String grupoDescripcion, Map<String, Float> promediosPorTrimestre) {
        this.grupoId = grupoId;
        this.grupoDescripcion = grupoDescripcion;
        this.promediosPorTrimestre = promediosPorTrimestre;
    }
}
