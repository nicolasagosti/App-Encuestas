package nicolas.framework.encuestas.encuesta.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
public class GrupoPromedioOutputDTO {

    private Long id;
    private String descripcion;
    private int cantidadDeColaboradores;
    private Float promedio;

    public GrupoPromedioOutputDTO(GrupoOutputDTO grupo, Float promedio) {

        this.id = grupo.getId();
        this.descripcion = grupo.getDescripcion();
        this.cantidadDeColaboradores = grupo.getCantidadDeColaboradores();
        this.promedio = promedio;
    }
}
