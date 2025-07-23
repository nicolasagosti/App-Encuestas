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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

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
    public List<EncuestaOutputDTO> obtenerEncuestasDeCliente(Long clienteId) {
        List<Encuesta> encuestas = encuestaRepository.findDistinctByGruposClientesId(clienteId);

        return getEncuestaOutputDTOS(encuestas);
    }

    @Override
    public List<EncuestaOutputDTO> findAll() {
       List<Encuesta> encuestas = encuestaRepository.findAll();

        return getEncuestaOutputDTOS(encuestas);
    }


}