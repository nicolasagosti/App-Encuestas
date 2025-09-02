package nicolas.framework.encuestas.encuesta.services;

import nicolas.framework.encuestas.encuesta.dtos.RespuestaInputDTO;
import nicolas.framework.encuestas.encuesta.dtos.RespuestaOutputDTO;
import nicolas.framework.encuestas.encuesta.models.entities.Respuesta;

import java.util.List;

public interface IRespuestaService {

    public void guardarRespuestas(Long clienteId, Long encuestaId, List<RespuestaInputDTO> respuestas);
    public List<RespuestaOutputDTO> obtenerRespuestas(Long clienteId, Long encuestaId);
    public void editarRespuestas(Long clienteId, Long encuestaId, List<RespuestaInputDTO> dtos);
}
