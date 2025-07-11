package nicolas.framework.encuestas.encuesta.services;

import nicolas.framework.encuestas.encuesta.dtos.EncuestaInputDTO;
import nicolas.framework.encuestas.encuesta.models.entities.Encuesta;

import java.util.Optional;

public interface IEncuestaService {
    void crearEncuesta(EncuestaInputDTO encuesta);
    Optional<Encuesta> getEncuestaById(Long id);
}
