package nicolas.framework.encuestas.encuesta.services;

import nicolas.framework.encuestas.encuesta.dtos.RespuestaInputDTO;

import java.util.List;

public interface IRespuestaService {

    public void guardarRespuestas(Long clienteId, Long encuestaId, List<RespuestaInputDTO> respuestas);
}
