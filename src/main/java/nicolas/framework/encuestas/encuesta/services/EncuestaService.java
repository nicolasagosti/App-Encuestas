package nicolas.framework.encuestas.encuesta.services;

import nicolas.framework.encuestas.encuesta.dtos.EncuestaInputDTO;
import nicolas.framework.encuestas.encuesta.models.entities.Encuesta;
import nicolas.framework.encuestas.encuesta.models.repositories.EncuestaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;


@Service
public class EncuestaService implements IEncuestaService {

    @Autowired
    private EncuestaRepository encuestaRepository;

    @Override
    public void crearEncuesta(EncuestaInputDTO encuestaDTO) {

       Encuesta encuesta = new Encuesta(encuestaDTO);
       encuestaRepository.save(encuesta);
    }

    @Override
    public Optional<Encuesta> getEncuestaById(Long id) {
        return Optional.of(this.encuestaRepository.findById(id).get());
    }


}
