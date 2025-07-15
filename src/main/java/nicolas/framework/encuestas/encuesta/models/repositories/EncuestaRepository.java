package nicolas.framework.encuestas.encuesta.models.repositories;

import nicolas.framework.encuestas.encuesta.models.entities.Encuesta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EncuestaRepository extends JpaRepository<Encuesta, Long> {

    List<Encuesta> findDistinctByGruposClientesId(Long clienteId);
    List<Encuesta> findAllByPreguntas_Id(Long preguntaId);
}
