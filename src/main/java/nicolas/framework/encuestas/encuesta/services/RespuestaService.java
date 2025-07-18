package nicolas.framework.encuestas.encuesta.services;

import nicolas.framework.encuestas.encuesta.dtos.RespuestaInputDTO;
import nicolas.framework.encuestas.encuesta.models.entities.Respuesta;
import nicolas.framework.encuestas.encuesta.models.entities.User;
import nicolas.framework.encuestas.encuesta.models.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class RespuestaService implements IRespuestaService{
    @Autowired
    private RespuestaRepository respuestaRepository;

    @Autowired
    private UserRepository clienteRepository;

    @Autowired
    private GrupoRepository grupoRepository;

    @Autowired
    private PreguntaRepository preguntaRepository;

    @Override
    public void guardarRespuestas(Long clienteId, Long encuestaId, List<RespuestaInputDTO> dtos) {

        User cliente = clienteRepository.getReferenceById(clienteId);

        for (RespuestaInputDTO dto : dtos) {
            Respuesta r = new Respuesta();
            r.setCliente(cliente);
            r.setGrupo(grupoRepository.getReferenceById(dto.getGrupoId()));
            r.setPregunta(preguntaRepository.getReferenceById(dto.getPreguntaId()));
            r.setPuntaje(dto.getPuntaje());
            r.setJustificacion(dto.getJustificacion());
            r.setFechaRespuesta(LocalDate.now());
            respuestaRepository.save(r);
        }
    }
}
