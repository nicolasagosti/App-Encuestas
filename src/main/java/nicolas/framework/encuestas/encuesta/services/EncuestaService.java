package nicolas.framework.encuestas.encuesta.services;

import nicolas.framework.encuestas.encuesta.dtos.EncuestaInputDTO;
import nicolas.framework.encuestas.encuesta.models.entities.Encuesta;
import nicolas.framework.encuestas.encuesta.models.repositories.EncuestaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EncuestaService implements IEncuestaService {

    @Autowired
    private EncuestaRepository encuestaRepository;

    @Override
    public List<Encuesta> findAll() {
        return encuestaRepository.findAll();
    }

    @Override
    public Optional<Encuesta> findById(Long id) {
        return encuestaRepository.findById(id);
    }

    @Override
    public void crearEncuesta(EncuestaInputDTO encuestaDTO) {

        Encuesta encuesta = new Encuesta(encuestaDTO);
        encuestaRepository.save(encuesta);
    }

    @Override
    public void deleteById(Long id) {
        encuestaRepository.deleteById(id);
    }
}
