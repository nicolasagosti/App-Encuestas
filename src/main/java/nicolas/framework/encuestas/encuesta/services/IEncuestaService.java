package nicolas.framework.encuestas.encuesta.services;

import nicolas.framework.encuestas.encuesta.dtos.EncuestaInputDTO;
import nicolas.framework.encuestas.encuesta.models.entities.Encuesta;
import java.util.List;
import java.util.Optional;

public interface IEncuestaService {

    public void crearEncuesta(EncuestaInputDTO encuestaDTO);
    List<Encuesta> findAll();
    Optional<Encuesta> findById(Long id);
    void deleteById(Long id);
}
