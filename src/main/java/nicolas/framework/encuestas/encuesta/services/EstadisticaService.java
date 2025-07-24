package nicolas.framework.encuestas.encuesta.services;

import nicolas.framework.encuestas.encuesta.dtos.GrupoOutputDTO;
import nicolas.framework.encuestas.encuesta.dtos.GrupoPromedioOutputDTO;
import nicolas.framework.encuestas.encuesta.models.entities.Respuesta;
import nicolas.framework.encuestas.encuesta.models.repositories.RespuestaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class EstadisticaService implements IEstadisticaService {

    @Autowired
    RespuestaRepository respuestaRepository;

    @Autowired
    GrupoService grupoService;


    @Override
    public Float promedioDeGrupo(Long grupoId) {
        List<Respuesta> respuestas = respuestaRepository.findByGrupoId(grupoId);
        if (respuestas.isEmpty()) return null;

        float suma = 0;
        for (Respuesta r : respuestas) {
            suma += r.getPuntaje();
        }
        return suma / respuestas.size();
    }

    @Override
    public List<GrupoPromedioOutputDTO> promediosDeTodosLosGrupos (){

            List<GrupoOutputDTO> grupos = grupoService.todosLosGrupos();

            List<GrupoPromedioOutputDTO> grupoPromedios = new ArrayList<>();

            for (GrupoOutputDTO grupo : grupos) {
                Float promedio = promedioDeGrupo(grupo.getId());
                grupoPromedios.add(new GrupoPromedioOutputDTO(grupo, promedio));
            }

            return grupoPromedios;
    }
}
