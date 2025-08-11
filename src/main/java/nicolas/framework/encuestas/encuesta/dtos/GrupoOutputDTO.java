package nicolas.framework.encuestas.encuesta.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Optional;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GrupoOutputDTO {

    private Long id;
    private String descripcion;
    private int cantidadDeColaboradores;
    private String nombre;
    private Optional<List<ReferenteDTO>> referentes;

    // Constructor usado cuando no se pasa 'referentes'
    public GrupoOutputDTO(Long id, String descripcion, int cantidadDeColaboradores, String nombre) {
        this.id = id;
        this.descripcion = descripcion;
        this.cantidadDeColaboradores = cantidadDeColaboradores;
        this.nombre = nombre;
    }
}
