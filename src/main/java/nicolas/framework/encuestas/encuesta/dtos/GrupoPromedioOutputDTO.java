package nicolas.framework.encuestas.encuesta.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
public class GrupoPromedioOutputDTO {

    private Long id;
    private String descripcion;
    private int cantidadDeColaboradores;
    private int totalReferentes;
    private int referentesQueRespondieron;
    private Float promedio;

    public GrupoPromedioOutputDTO(GrupoOutputDTO grupo, Float promedio, int referentes, int referentesQueRespondieron) {

        this.id = grupo.getId();
        this.descripcion = grupo.getDescripcion();
        this.cantidadDeColaboradores = grupo.getCantidadDeColaboradores();
        this.promedio = promedio;
        this.totalReferentes = referentes;
        this.referentesQueRespondieron = referentesQueRespondieron;
    }
}
