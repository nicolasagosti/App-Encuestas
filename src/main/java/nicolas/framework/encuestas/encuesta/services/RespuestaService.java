package nicolas.framework.encuestas.encuesta.services;

import nicolas.framework.encuestas.encuesta.dtos.RespuestaInputDTO;
import nicolas.framework.encuestas.encuesta.models.entities.Cliente;
import nicolas.framework.encuestas.encuesta.models.entities.Respuesta;
import nicolas.framework.encuestas.encuesta.models.repositories.ClienteRepository;
import nicolas.framework.encuestas.encuesta.models.repositories.GrupoRepository;
import nicolas.framework.encuestas.encuesta.models.repositories.PreguntaRepository;
import nicolas.framework.encuestas.encuesta.models.repositories.RespuestaRepository;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDate;
import java.util.List;

public class RespuestaService implements IRespuestaService{
    @Autowired
    private RespuestaRepository respuestaRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private GrupoRepository grupoRepository;

    @Autowired
    private PreguntaRepository preguntaRepository;

    @Override
    public void guardarRespuestas(Long clienteId, Long encuestaId, List<RespuestaInputDTO> dtos) {

        Cliente cliente = clienteRepository.getReferenceById(clienteId);

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
