package nicolas.framework.encuestas.encuesta.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class GrupoOutputDTO {

    private Long id;
    private String descripcion;
    private int cantidadDeColaboradores;

    public GrupoOutputDTO(Long id,String descripcion, int cantidadDeColaboradores) {
        this.descripcion = descripcion;
        this.id = id;
        this.cantidadDeColaboradores = cantidadDeColaboradores;
    }


}
