package nicolas.framework.encuestas.encuesta.services;

import nicolas.framework.encuestas.encuesta.dtos.PreguntaInputDTO;
import nicolas.framework.encuestas.encuesta.models.entities.Encuesta;
import nicolas.framework.encuestas.encuesta.models.entities.Pregunta;
import nicolas.framework.encuestas.encuesta.models.repositories.EncuestaRepository;
import nicolas.framework.encuestas.encuesta.models.repositories.PreguntaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

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
    public List<Pregunta> listarPreguntas() {
        return preguntaRepository.findAll();
    }

    @Override
    public List<Pregunta> buscarPreguntasPorId(List<Long> id) {
        return List.of();
    }

    @Override
    @Transactional
    public void eliminarPregunta(Long id) {
        // 1) Cargar la pregunta
        Pregunta pregunta = preguntaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pregunta no encontrada"));

        // 2) Buscar todas las encuestas que la contienen
        List<Encuesta> encuestas = encuestaRepository.findAllByPreguntas_Id(id);

        // 3) Desvincular la pregunta de cada encuesta y guardar cambios
        for (Encuesta enc : encuestas) {
            enc.getPreguntas().remove(pregunta);
            encuestaRepository.save(enc);
        }

        // 4) Finalmente borrar la pregunta
        preguntaRepository.delete(pregunta);
    }
}
