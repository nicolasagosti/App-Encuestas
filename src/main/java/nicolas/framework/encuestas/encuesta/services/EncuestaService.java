package nicolas.framework.encuestas.encuesta.services;

import nicolas.framework.encuestas.encuesta.models.entities.Encuesta;
import nicolas.framework.encuestas.encuesta.models.repositories.EncuestaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EncuestaService implements IEncuestaService {

    private final EncuestaRepository repo;

    public EncuestaService(EncuestaRepository repo) {
        this.repo = repo;
    }

    @Override
    public List<Encuesta> findAll() {
        return repo.findAll();
    }

    @Override
    public Optional<Encuesta> findById(Long id) {
        return repo.findById(id);
    }

    @Override
    public Encuesta save(Encuesta encuesta) {
        return repo.save(encuesta);
    }

    @Override
    public void deleteById(Long id) {
        repo.deleteById(id);
    }
}
