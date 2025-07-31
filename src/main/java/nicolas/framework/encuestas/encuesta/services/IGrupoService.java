package nicolas.framework.encuestas.encuesta.services;



import nicolas.framework.encuestas.encuesta.dtos.GrupoInputDTO;
import nicolas.framework.encuestas.encuesta.dtos.GrupoOutputDTO;
import nicolas.framework.encuestas.encuesta.models.entities.Grupo;

import java.util.List;

public interface IGrupoService {

    public GrupoOutputDTO buscarGrupo(Long id);
    public List<GrupoOutputDTO> todosLosGrupos();
    public List<Grupo> buscarGrupos(List<Long> ids);
    public GrupoOutputDTO registrarGrupo(GrupoInputDTO grupo);
}
