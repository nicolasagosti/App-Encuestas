package nicolas.framework.encuestas.encuesta.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PreguntaOutputDTO {
    private Long id;
    private String texto;
}
