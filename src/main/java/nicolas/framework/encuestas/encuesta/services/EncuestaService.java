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
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


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
        Encuesta encuesta = new Encuesta(encuestaDTO.getFechaInicio(),encuestaDTO.getFechaFin(), preguntas,grupos);
        encuestaRepository.save(encuesta);
    }

    @Override
    public Encuesta getEncuestaById(Long id) {
        return encuestaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Encuesta no encontrada con id " + id));
    }

    public List<EncuestaOutputDTO> getEncuestaOutputDTOS(List<Encuesta> encuestas) {
        return encuestas.stream().map(encuesta -> {
            List<PreguntaOutputDTO> preguntas = encuesta.getPreguntas().stream()
                    .map(p -> new PreguntaOutputDTO(p.getId(), p.getTexto()))
                    .toList();

            List<GrupoOutputDTO> grupos = encuesta.getGrupos().stream()
                    .map(g -> new GrupoOutputDTO(g.getId(), g.getDescripcion(), g.getCantidadDeColaboradores()))
                    .toList();

            return new EncuestaOutputDTO(encuesta.getFechaInicio(),encuesta.getFechaFin(), preguntas, encuesta.getId(), grupos);
        }).toList();
    }

    @Override
    public List<EncuestaOutputDTO> obtenerEncuestasPendientes(Long clienteId) {

        List<Encuesta> todasLasEncuestas = encuestaRepository.findDistinctByGruposClientesId(clienteId);
        List<Encuesta> encuestasPendientes = new ArrayList<>();

        for (Encuesta encuesta : todasLasEncuestas) {
            Grupo grupo = encuesta.getGrupos().stream()
                    .filter(g -> g.getClientes().stream().anyMatch(c -> c.getId().equals(clienteId)))
                    .findFirst()
                    .orElse(null);

            if (grupo == null) continue;

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


}