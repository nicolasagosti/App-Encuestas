package nicolas.framework.encuestas.encuesta.services;

import nicolas.framework.encuestas.encuesta.dtos.PreguntaInputDTO;
import nicolas.framework.encuestas.encuesta.dtos.PreguntaOutputDTO;
import nicolas.framework.encuestas.encuesta.models.entities.Pregunta;
import nicolas.framework.encuestas.encuesta.models.repositories.PreguntaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PreguntaService implements IPreguntaService {

    @Autowired
    private PreguntaRepository preguntaRepository;

    @Override
    public Pregunta crearPregunta(PreguntaInputDTO dto) {

        System.out.println(dto);
        Pregunta pregunta = new Pregunta(dto);
        return preguntaRepository.save(pregunta);
    }

    @Override
    public List<Pregunta> listarPreguntas() {
        return preguntaRepository.findAll();
    }

    public List<Pregunta> buscarPreguntasPorId(List<Long> id) {
        return preguntaRepository.findAllById(id);
    }
}
