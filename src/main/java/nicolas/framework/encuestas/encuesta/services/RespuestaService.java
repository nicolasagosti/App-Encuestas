package nicolas.framework.encuestas.encuesta.services;

import nicolas.framework.encuestas.encuesta.dtos.RespuestaInputDTO;
import nicolas.framework.encuestas.encuesta.models.entities.Encuesta;
import nicolas.framework.encuestas.encuesta.models.entities.Respuesta;
import nicolas.framework.encuestas.encuesta.models.entities.User;
import nicolas.framework.encuestas.encuesta.models.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class RespuestaService implements IRespuestaService {
    @Autowired
    private RespuestaRepository respuestaRepository;

    @Autowired
    private UserRepository clienteRepository;

    @Autowired
    private GrupoRepository grupoRepository;

    @Autowired
    private PreguntaRepository preguntaRepository;

    @Autowired
    private EncuestaRepository encuestaRepository; // 🔑 agregar este repo

    @Override
    public void guardarRespuestas(Long clienteId, Long encuestaId, List<RespuestaInputDTO> dtos) {

        User cliente = clienteRepository.getReferenceById(clienteId);
        Encuesta encuesta = encuestaRepository.findById(encuestaId)
                .orElseThrow(() -> new RuntimeException("Encuesta no encontrada con id " + encuestaId));

        for (RespuestaInputDTO dto : dtos) {
            Respuesta r = new Respuesta();
            r.setCliente(cliente);
            r.setGrupo(grupoRepository.getReferenceById(dto.getGrupoId()));
            r.setPregunta(preguntaRepository.getReferenceById(dto.getPreguntaId()));
            r.setEncuesta(encuesta);  // ✅ ahora sí se setea
            r.setPuntaje(dto.getPuntaje());
            r.setJustificacion(dto.getJustificacion());
            r.setFechaRespuesta(LocalDate.now());
            respuestaRepository.save(r);
        }
    }
}
