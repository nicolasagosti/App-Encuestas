package nicolas.framework.encuestas.encuesta.services;

import nicolas.framework.encuestas.Exception.ResourceNotFoundException;
import nicolas.framework.encuestas.encuesta.dtos.EncuestaInputDTO;
import nicolas.framework.encuestas.encuesta.dtos.EncuestaOutputDTO;
import nicolas.framework.encuestas.encuesta.dtos.GrupoOutputDTO;
import nicolas.framework.encuestas.encuesta.dtos.PreguntaOutputDTO;
import nicolas.framework.encuestas.encuesta.models.entities.Encuesta;
import nicolas.framework.encuestas.encuesta.models.entities.Grupo;
import nicolas.framework.encuestas.encuesta.models.entities.Pregunta;
import nicolas.framework.encuestas.encuesta.models.repositories.EncuestaRepository;
import nicolas.framework.encuestas.encuesta.models.repositories.RespuestaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

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
        Encuesta encuesta = new Encuesta(encuestaDTO.getFechaInicio(), encuestaDTO.getFechaFin(), preguntas, grupos);
        encuestaRepository.save(encuesta);
    }

    @Override
    public Encuesta getEncuestaById(Long id) {
        return encuestaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Encuesta no encontrada con id " + id));
    }

    @Override
    public List<EncuestaOutputDTO> getEncuestaOutputDTOS(List<Encuesta> encuestas) {
        return encuestas.stream()
                .map(encuesta -> {
                    List<PreguntaOutputDTO> preguntas = encuesta.getPreguntas().stream()
                            .map(p -> new PreguntaOutputDTO(p.getId(), p.getTexto()))
                            .toList();

                    List<GrupoOutputDTO> grupos = encuesta.getGrupos().stream()
                            .map(g -> new GrupoOutputDTO(
                                    g.getId(),
                                    g.getDescripcion(),
                                    g.getCantidadDeColaboradores(),
                                    g.getNombre()          // ahora incluye el nombre
                            ))
                            .toList();

                    return new EncuestaOutputDTO(
                            encuesta.getFechaInicio(),
                            encuesta.getFechaFin(),
                            preguntas,
                            encuesta.getId(),
                            grupos
                    );
                })
                .toList();
    }


    @Override
    public List<EncuestaOutputDTO> obtenerEncuestasPendientes(Long clienteId) {
        List<Encuesta> todasLasEncuestas = encuestaRepository.findDistinctByGruposClientesId(clienteId);
        List<Encuesta> encuestasPendientes = new ArrayList<>();

        for (Encuesta encuesta : todasLasEncuestas) {
            LocalDate hoy = LocalDate.now();

            Grupo grupo = encuesta.getGrupos().stream()
                    .filter(g -> g.getClientes().stream().anyMatch(c -> c.getId().equals(clienteId)))
                    .findFirst()
                    .orElse(null);

            if (grupo == null) continue;

            if (encuesta.getFechaInicio().isAfter(hoy) || encuesta.getFechaFin().isBefore(hoy)) {
                continue;
            }

            boolean respondioTodas = true;
            for (Pregunta pregunta : encuesta.getPreguntas()) {
                boolean existeRespuesta = respuestaRepository
                        .existsByCliente_IdAndGrupo_IdAndPregunta_Id(clienteId, grupo.getId(), pregunta.getId());

                if (!existeRespuesta) {
                    respondioTodas = false;
                    break;
                }
            }
            if (!respondioTodas) {
                encuestasPendientes.add(encuesta);
            }
        }
        return getEncuestaOutputDTOS(encuestasPendientes);
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

}
