package nicolas.framework.encuestas.encuesta.services;

import nicolas.framework.encuestas.encuesta.dtos.PreguntaInputDTO;
import nicolas.framework.encuestas.encuesta.models.entities.Encuesta;
import nicolas.framework.encuestas.encuesta.models.entities.Pregunta;
import nicolas.framework.encuestas.encuesta.models.repositories.EncuestaRepository;
import nicolas.framework.encuestas.encuesta.models.repositories.PreguntaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PreguntaService implements IPreguntaService {

    private final PreguntaRepository preguntaRepository;
    private final EncuestaRepository encuestaRepository;

    public PreguntaService(PreguntaRepository preguntaRepository,
                           EncuestaRepository encuestaRepository) {
        this.preguntaRepository = preguntaRepository;
        this.encuestaRepository = encuestaRepository;
    }

    @Override
    public Pregunta crearPregunta(PreguntaInputDTO dto) {
        Pregunta pregunta = new Pregunta(dto);
        return preguntaRepository.save(pregunta);
    }

    @Override
    public void guardarPregunta(Pregunta pregunta){
        preguntaRepository.save(pregunta);
    }

    @Override
    public List<Pregunta> listarPreguntas() {
        return preguntaRepository.findDistinctByNombre()
                .stream()
                .filter(Pregunta::isVisible)
                .collect(Collectors.toList());
    }

    public List<Pregunta> buscarPreguntasPorId(List<Long> id) {
        return preguntaRepository.findAllById(id);
    }

    @Override
    @Transactional
    public void eliminarPregunta(Long id) {
        Pregunta pregunta = preguntaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pregunta no encontrada"));

        List<Encuesta> encuestas = encuestaRepository.findAllByPreguntas_Id(id);
        for (Encuesta enc : encuestas) {
            enc.getPreguntas().remove(pregunta);
            encuestaRepository.save(enc);
        }

        pregunta.setVisible(false);
        preguntaRepository.save(pregunta);
    }


    @Override
    @Transactional
    public Pregunta editarPregunta(Long id, PreguntaInputDTO dto) {
        Pregunta p = preguntaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pregunta no encontrada"));
        p.setTexto(dto.getTexto());

        return preguntaRepository.save(p);
    }


}
