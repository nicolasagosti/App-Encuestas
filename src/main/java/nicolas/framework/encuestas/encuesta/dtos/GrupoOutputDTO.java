package nicolas.framework.encuestas.encuesta.dtos;

import lombok.NoArgsConstructor;

@NoArgsConstructor
public class GrupoOutputDTO {

    private Long id;
    private String descripcion;
    private int cantidadDeColaboradores;
    private String nombre; // nuevo

    public GrupoOutputDTO(Long id, String descripcion, int cantidadDeColaboradores, String nombre) {
        this.id = id;
        this.descripcion = descripcion;
        this.cantidadDeColaboradores = cantidadDeColaboradores;
        this.nombre = nombre;
    }

    public Long getId() {
        return id;
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

    public void setId(Long id) {
        this.id = id;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public void setCantidadDeColaboradores(int cantidadDeColaboradores) {
        this.cantidadDeColaboradores = cantidadDeColaboradores;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
}
