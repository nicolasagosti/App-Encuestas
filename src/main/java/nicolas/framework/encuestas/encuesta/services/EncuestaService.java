package nicolas.framework.encuestas.encuesta.services;

import nicolas.framework.encuestas.Exception.ResourceNotFoundException;
import nicolas.framework.encuestas.encuesta.dtos.*;
import nicolas.framework.encuestas.encuesta.models.entities.Encuesta;
import nicolas.framework.encuestas.encuesta.models.entities.Grupo;
import nicolas.framework.encuestas.encuesta.models.entities.Pregunta;
import nicolas.framework.encuestas.encuesta.models.entities.Respuesta;
import nicolas.framework.encuestas.encuesta.models.repositories.EncuestaRepository;
import nicolas.framework.encuestas.encuesta.models.repositories.RespuestaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class EncuestaService implements IEncuestaService {

    @Autowired
    private EncuestaRepository encuestaRepository;

    @Autowired
    private IPreguntaService preguntaService;

    @Autowired
    private IGrupoService grupoService;

    @Autowired
    private RespuestaRepository respuestaRepository;

    @Override
    public void crearEncuesta(EncuestaInputDTO encuestaDTO) {
        List<Pregunta> preguntas = preguntaService.buscarPreguntasPorId(encuestaDTO.getPreguntas());
        List<Grupo> grupos = grupoService.buscarGrupos(encuestaDTO.getGrupos());
        Encuesta encuesta = new Encuesta(encuestaDTO.getFechaInicio(), encuestaDTO.getFechaFin(), encuestaDTO.getFechaPCompletarInicio(), encuestaDTO.getFechaPCompletarFin(), preguntas, grupos);
        encuestaRepository.save(encuesta);
    }

    @Override
    public void relanzarEncuesta(Long id, RelanzarEncuestaDTO fechas) {
        Optional<Encuesta> encuestaOpt = encuestaRepository.findById(id);
        if (encuestaOpt.isPresent()) {
            Encuesta encuestaOriginal = encuestaOpt.get();

            List<Grupo> grupos = new ArrayList<>(encuestaOriginal.getGrupos());
            List<Pregunta> preguntas = new ArrayList<>();

            for (Pregunta preguntaOriginal : encuestaOriginal.getPreguntas()) {
                Pregunta nuevaPregunta = new Pregunta();
                nuevaPregunta.setTexto(preguntaOriginal.getTexto());

                preguntas.add(nuevaPregunta);
                preguntaService.guardarPregunta(nuevaPregunta);
            }

            Encuesta nuevaEncuesta = new Encuesta(
                    fechas.getFechaInicio(),
                    fechas.getFechaFin(),
                    fechas.getFechaPCompletarInicio(),
                    fechas.getFechaPCompletarFin(),
                    preguntas,
                    grupos
            );

            encuestaRepository.save(nuevaEncuesta);
        }
    }

    @Override
    public List<EncuestaOutputDTO> obtenerEncuestasPendientes(Long clienteId) {
        List<Encuesta> todasLasEncuestas = encuestaRepository.findDistinctByGruposClientesId(clienteId);
        List<EncuestaOutputDTO> encuestasPendientes = new ArrayList<>();
        LocalDate hoy = LocalDate.now();

        for (Encuesta encuesta : todasLasEncuestas) {
            // 📌 Filtramos por rango de fechas de participación
            if (encuesta.getFechaPCompletarInicio().isAfter(hoy) || encuesta.getFechaPCompletarFin().isBefore(hoy)) {
                continue;
            }

            List<Grupo> gruposDelCliente = encuesta.getGrupos().stream()
                    .filter(g -> g.getClientes().stream().anyMatch(c -> c.getId().equals(clienteId)))
                    .toList();

            for (Grupo grupo : gruposDelCliente) {
                boolean respondioTodas = true;

                for (Pregunta pregunta : encuesta.getPreguntas()) {
                    Optional<Respuesta> respuestaOpt =
                            respuestaRepository.findByClienteIdAndGrupoIdAndPreguntaId(
                                    clienteId, grupo.getId(), pregunta.getId());

                    if (respuestaOpt.isEmpty()) {
                        respondioTodas = false;
                        break;
                    }

                    Respuesta r = respuestaOpt.get();
                    if (r.getPuntaje() < 8 && (r.getJustificacion() == null || r.getJustificacion().isBlank())) {
                        respondioTodas = false;
                        break;
                    }
                }

                if (!respondioTodas) {
                    List<PreguntaOutputDTO> preguntasDTO = encuesta.getPreguntas().stream()
                            .map(p -> new PreguntaOutputDTO(p.getId(), p.getTexto()))
                            .toList();

                    List<RespuestaOutputDTO> respuestasDTO = Optional.ofNullable(encuesta.getRespuestas())
                            .orElseGet(Collections::emptyList)
                            .stream()
                            .map(r -> new RespuestaOutputDTO(
                                    r.getId(),
                                    r.getCliente() != null ? r.getCliente().getId() : null,
                                    r.getGrupo() != null ? r.getGrupo().getId() : null,
                                    r.getPregunta() != null ? r.getPregunta().getId() : null,
                                    r.getEncuesta() != null ? r.getEncuesta().getId() : null,
                                    r.getPuntaje(),
                                    r.getJustificacion(),
                                    r.getFechaRespuesta()
                            ))
                            .toList();

                    // 📌 Referentes del grupo
                    List<ReferenteDTO> referentes = Optional.ofNullable(grupo.getClientes())
                            .orElseGet(Collections::emptyList)
                            .stream()
                            .map(c -> new ReferenteDTO(
                                    c.getId(),
                                    c.getNombre(),
                                    c.getApellido(),
                                    c.getUsername()
                            ))
                            .toList();

                    // 📌 Construimos DTO de encuesta pendiente
                    EncuestaOutputDTO dto = new EncuestaOutputDTO(
                            encuesta.getId(),
                            encuesta.getFechaInicio(),
                            encuesta.getFechaFin(),
                            encuesta.getFechaPCompletarInicio(),
                            encuesta.getFechaPCompletarFin(),
                            preguntasDTO,
                            respuestasDTO,
                            null,
                            null
                    );

                    dto.setGrupoDelCliente(new GrupoOutputDTO(
                            grupo.getId(),
                            grupo.getDescripcion(),
                            grupo.getCantidadDeColaboradores(),
                            grupo.getNombre(),
                            referentes
                    ));

                    encuestasPendientes.add(dto);
                }
            }
        }

        return encuestasPendientes;
    }


    @Override
    public List<EncuestaOutputDTO> findAll() {
        List<Encuesta> encuestas = encuestaRepository.findAll();
        return getEncuestaOutputDTOS(encuestas);
    }

    @Override
    public EncuestaOutputDTO editarEncuesta(Long id, EncuestaInputDTO dto) {
        Encuesta encuesta = encuestaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Encuesta no encontrada con id " + id));

        // Solo actualiza preguntas si vienen en el DTO (no nulas)
        if (dto.getPreguntas() != null) {
            List<Pregunta> preguntas = preguntaService.buscarPreguntasPorId(dto.getPreguntas());
            encuesta.setPreguntas(preguntas);
        }

        // Solo actualiza grupos si vienen en el DTO (no nulos)
        if (dto.getGrupos() != null) {
            List<Grupo> grupos = grupoService.buscarGrupos(dto.getGrupos());
            encuesta.setGrupos(grupos);
        }

        // Solo actualiza fechas si vienen (no nulas)
        if (dto.getFechaInicio() != null) {
            encuesta.setFechaInicio(dto.getFechaInicio());
        }
        if (dto.getFechaFin() != null) {
            encuesta.setFechaFin(dto.getFechaFin());
        }

        Encuesta encuestaActualizada = encuestaRepository.save(encuesta);
        return getEncuestaOutputDTOS(List.of(encuestaActualizada)).get(0);
    }

    @Override
    public List<EncuestaOutputDTO> getEncuestaOutputDTOS(List<Encuesta> encuestas) {
        return encuestas.stream()
                .map(encuesta -> {
                    List<PreguntaOutputDTO> preguntas = encuesta.getPreguntas().stream()
                            .map(p -> new PreguntaOutputDTO(p.getId(), p.getTexto()))
                            .toList();

                    List<GrupoOutputDTO> grupos = encuesta.getGrupos().stream()
                            .map(g -> {
                                List<ReferenteDTO> referentes =
                                        Optional.ofNullable(g.getClientes())
                                                .orElseGet(Collections::emptyList)
                                                .stream()
                                                .map(c -> new ReferenteDTO(
                                                        c.getId(),
                                                        c.getNombre(),
                                                        c.getApellido(),
                                                        c.getUsername()))
                                                .toList();

                                return new GrupoOutputDTO(
                                        g.getId(),
                                        g.getDescripcion(),
                                        g.getCantidadDeColaboradores(),
                                        g.getNombre(),
                                        referentes
                                );
                            })
                            .toList();

                    List<RespuestaOutputDTO> respuestas = Optional.ofNullable(encuesta.getRespuestas())
                            .orElseGet(Collections::emptyList)
                            .stream()
                            .map(r -> new RespuestaOutputDTO(
                                    r.getId(),
                                    r.getCliente() != null ? r.getCliente().getId() : null,
                                    r.getGrupo() != null ? r.getGrupo().getId() : null,
                                    r.getPregunta() != null ? r.getPregunta().getId() : null,
                                    r.getEncuesta() != null ? r.getEncuesta().getId() : null, // ✅ faltaba este
                                    r.getPuntaje(),
                                    r.getJustificacion(),
                                    r.getFechaRespuesta()
                            ))
                            .toList();


                    return new EncuestaOutputDTO(
                            encuesta.getId(),
                            encuesta.getFechaInicio(),
                            encuesta.getFechaFin(),
                            encuesta.getFechaPCompletarInicio(),
                            encuesta.getFechaPCompletarFin(),
                            preguntas,
                            respuestas,
                            grupos,
                            null
                    );
                })
                .toList();
    }

}
