package nicolas.framework.encuestas.encuesta.services;

import nicolas.framework.encuestas.encuesta.models.entities.Pregunta;
import java.util.List;
import java.util.Optional;

public interface IPreguntaService {
    List<Pregunta> findAll();
    Optional<Pregunta> findById(Long id);
    Pregunta save(Pregunta pregunta);
    void deleteById(Long id);
}
