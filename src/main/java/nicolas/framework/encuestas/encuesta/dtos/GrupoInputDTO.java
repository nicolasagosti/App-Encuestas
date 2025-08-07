package nicolas.framework.encuestas.encuesta.dtos;

import lombok.Data;

@Data
public class GrupoInputDTO {
    private String descripcion;
    private int cantidadDeColaboradores;
    private String nombre;


    public GrupoInputDTO(String descripcion, int cantidadDeColaboradores, String nombre) {
        this.descripcion = descripcion;
        this.cantidadDeColaboradores = cantidadDeColaboradores;
        this.nombre = nombre;
    }

    public GrupoInputDTO() {
    }

    public String getDescripcion() {
        return descripcion;
    }

    public int getCantidadDeColaboradores() {
        return cantidadDeColaboradores;
    }

    public String getNombre() {
        return nombre;
    }
}
