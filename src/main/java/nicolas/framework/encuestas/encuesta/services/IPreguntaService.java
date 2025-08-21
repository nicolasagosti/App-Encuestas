package nicolas.framework.encuestas.encuesta.services;


import nicolas.framework.encuestas.encuesta.dtos.PreguntaInputDTO;
import nicolas.framework.encuestas.encuesta.models.entities.Pregunta;
import org.springframework.data.crossstore.ChangeSetPersister;

import java.util.List;

public interface IPreguntaService {
    public void eliminarPregunta(Long id) throws ChangeSetPersister.NotFoundException;
    Pregunta editarPregunta(Long id, PreguntaInputDTO dto);
    void guardarPregunta(Pregunta pregunta);
    Pregunta crearPregunta(PreguntaInputDTO dto);
    public List<Pregunta> listarPreguntas();
    public List<Pregunta> buscarPreguntasPorId(List<Long> id);
}
