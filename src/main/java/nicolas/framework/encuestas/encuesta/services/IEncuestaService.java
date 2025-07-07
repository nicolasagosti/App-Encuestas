package nicolas.framework.encuestas.encuesta.services;

import nicolas.framework.encuestas.encuesta.dtos.EncuestaInputDTO;

public interface IEncuestaService {
    void crearEncuesta(EncuestaInputDTO encuesta);
}
