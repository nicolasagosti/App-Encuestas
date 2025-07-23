package nicolas.framework.encuestas.encuesta.services;



import nicolas.framework.encuestas.encuesta.dtos.GrupoInputDTO;
import nicolas.framework.encuestas.encuesta.dtos.GrupoOutputDTO;
import nicolas.framework.encuestas.encuesta.models.entities.Grupo;

import java.util.List;

public interface IGrupoService {


    public List<GrupoOutputDTO> todosLosGrupos();
    public List<Grupo> buscarGrupos(List<Long> ids);
    public Grupo registrarGrupo(GrupoInputDTO grupo);
}
