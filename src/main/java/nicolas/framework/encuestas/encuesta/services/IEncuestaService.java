package nicolas.framework.encuestas.encuesta.services;

import nicolas.framework.encuestas.encuesta.models.entities.Encuesta;
import java.util.List;
import java.util.Optional;

public interface IEncuestaService {
    List<Encuesta> findAll();
    Optional<Encuesta> findById(Long id);
    Encuesta save(Encuesta encuesta);
    void deleteById(Long id);
}
