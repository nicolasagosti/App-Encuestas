package nicolas.framework.encuestas.encuesta.services;

import nicolas.framework.encuestas.encuesta.dtos.RespuestaInputDTO;
import nicolas.framework.encuestas.encuesta.dtos.RespuestaOutputDTO;
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

    @Override
    public List<RespuestaOutputDTO> obtenerRespuestas(Long clienteId, Long encuestaId) {
        return respuestaRepository.findAll().stream()
                .filter(r -> r.getCliente().getId().equals(clienteId)
                        && r.getEncuesta().getId().equals(encuestaId))
                .map(r -> new RespuestaOutputDTO(
                        r.getId(),
                        r.getCliente().getId(),
                        r.getGrupo().getId(),
                        r.getPregunta().getId(),
                        r.getEncuesta().getId(),
                        r.getPuntaje(),
                        r.getJustificacion(),
                        r.getFechaRespuesta()
                ))
                .toList();
    }

    @Override
    public void editarRespuestas(Long clienteId, Long encuestaId, List<RespuestaInputDTO> dtos) {
        User cliente = clienteRepository.getReferenceById(clienteId);
        Encuesta encuesta = encuestaRepository.findById(encuestaId)
                .orElseThrow(() -> new RuntimeException("Encuesta no encontrada con id " + encuestaId));

        for (RespuestaInputDTO dto : dtos) {
            // Buscar si ya existe la respuesta para esa pregunta, cliente y encuesta
            Respuesta respuestaExistente = respuestaRepository.findByClienteIdAndEncuestaIdAndPreguntaId(
                    clienteId, encuestaId, dto.getPreguntaId()
            ).orElse(null);

            if (respuestaExistente != null) {
                // 🔄 Actualizar la respuesta existente
                respuestaExistente.setPuntaje(dto.getPuntaje());
                respuestaExistente.setJustificacion(dto.getJustificacion());
                respuestaExistente.setFechaRespuesta(LocalDate.now());
                respuestaRepository.save(respuestaExistente);
            } else {
                // ➕ Crear nueva respuesta (respuesta parcial)
                Respuesta nueva = new Respuesta();
                nueva.setCliente(cliente);
                nueva.setGrupo(grupoRepository.getReferenceById(dto.getGrupoId()));
                nueva.setPregunta(preguntaRepository.getReferenceById(dto.getPreguntaId()));
                nueva.setEncuesta(encuesta);
                nueva.setPuntaje(dto.getPuntaje());
                nueva.setJustificacion(dto.getJustificacion());
                nueva.setFechaRespuesta(LocalDate.now());
                respuestaRepository.save(nueva);
            }
        }
    }



}
