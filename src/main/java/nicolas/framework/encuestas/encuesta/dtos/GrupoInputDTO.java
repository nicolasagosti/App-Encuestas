package nicolas.framework.encuestas.encuesta.dtos;


import lombok.Data;

@Data
public class GrupoInputDTO {
    private String descripcion;
    private int cantidadDeColaboradores;

    public GrupoInputDTO(String descripcion, int cantidadDeColaboradores) {
        this.descripcion = descripcion;
        this.cantidadDeColaboradores = cantidadDeColaboradores;
    }

    public GrupoInputDTO() {
    }

    public String getDescripcion() {
        return descripcion;
    }

    public int getCantidadDeColaboradores() {
        return cantidadDeColaboradores;
    }
}
