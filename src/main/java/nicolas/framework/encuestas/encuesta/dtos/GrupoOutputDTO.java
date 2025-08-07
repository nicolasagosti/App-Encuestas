package nicolas.framework.encuestas.encuesta.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Optional;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class GrupoOutputDTO {

    private Long id;
    private String descripcion;
    private int cantidadDeColaboradores;
    private String nombre; // nuevo
    private Optional <List<ReferenteDTO>> referentes;


    public GrupoOutputDTO(Long id, String descripcion, int cantidadDeColaboradores, String nombre) {
        this.id = id;
        this.descripcion = descripcion;
        this.cantidadDeColaboradores = cantidadDeColaboradores;
        this.nombre = nombre;
    }
}
