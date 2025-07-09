package nicolas.framework.encuestas.encuesta.services;

import nicolas.framework.encuestas.encuesta.models.entities.Pregunta;
import nicolas.framework.encuestas.encuesta.models.repositories.PreguntaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PreguntaService implements IPreguntaService {

    private final PreguntaRepository repo;

    public PreguntaService(PreguntaRepository repo) {
        this.repo = repo;
    }

    @Override
    public List<Pregunta> findAll() {
        return repo.findAll();
    }

    @Override
    public Optional<Pregunta> findById(Long id) {
        return repo.findById(id);
    }

    @Override
    public Pregunta save(Pregunta pregunta) {
        return repo.save(pregunta);
    }

    @Override
    public void deleteById(Long id) {
        repo.deleteById(id);
    }
}
