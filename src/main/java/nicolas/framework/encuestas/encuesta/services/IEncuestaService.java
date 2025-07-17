package nicolas.framework.encuestas.encuesta.services;

import nicolas.framework.encuestas.encuesta.dtos.EncuestaInputDTO;
import nicolas.framework.encuestas.encuesta.dtos.EncuestaOutputDTO;
import nicolas.framework.encuestas.encuesta.models.entities.Encuesta;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Optional;

public interface IEncuestaService {
    void crearEncuesta(EncuestaInputDTO encuesta);
    Encuesta getEncuestaById(Long id);
    public List<EncuestaOutputDTO> obtenerEncuestasDeCliente(Long clienteId);
    List<Encuesta> findAll();
}
