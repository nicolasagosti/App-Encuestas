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

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public int getCantidadDeColaboradores() {
        return cantidadDeColaboradores;
    }

    public void setCantidadDeColaboradores(int cantidadDeColaboradores) {
        this.cantidadDeColaboradores = cantidadDeColaboradores;
    }
}
