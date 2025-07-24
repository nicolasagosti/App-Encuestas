package nicolas.framework.encuestas.encuesta.services;

import nicolas.framework.encuestas.encuesta.dtos.GrupoPromedioOutputDTO;

import java.util.List;

public interface IEstadisticaService {

    public Float promedioDeGrupo(Long grupoId);
    public List<GrupoPromedioOutputDTO> promediosDeTodosLosGrupos ();

    }
