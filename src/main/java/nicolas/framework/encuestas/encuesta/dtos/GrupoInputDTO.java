package nicolas.framework.encuestas.encuesta.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GrupoInputDTO {
    private String descripcion;
    private int cantidadDeColaboradores;
    private String nombre;
}
