package nicolas.framework.encuestas.encuesta.services;

import nicolas.framework.encuestas.encuesta.models.entities.Respuesta;
import nicolas.framework.encuestas.encuesta.models.repositories.RespuestaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EstadisticaService implements IEstadisticaService {

    @Autowired
    RespuestaRepository respuestaRepository;


    @Override
    public Float promedioDeGrupo(Long grupoId) {
        int totalPuntos = respuestaRepository.findAllByGrupo_Id(grupoId).stream().mapToInt(Respuesta::getPuntaje).sum();

       int cantRespuestas = respuestaRepository.findAllByGrupo_Id(grupoId).size();
       //Actualmente el promedio se calcula mediante la suma de los puntos dividido la cantidad de preguntas

        return (float) totalPuntos / (float) cantRespuestas;
    }
}
