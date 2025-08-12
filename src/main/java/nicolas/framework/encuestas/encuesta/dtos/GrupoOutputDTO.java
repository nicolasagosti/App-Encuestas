package nicolas.framework.encuestas.encuesta.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import nicolas.framework.encuestas.encuesta.models.entities.Grupo;

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
    private List<ReferenteDTO> referentes;

}
