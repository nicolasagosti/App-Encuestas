package nicolas.framework.encuestas.encuesta.models.repositories;

import nicolas.framework.encuestas.encuesta.models.entities.Respuesta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RespuestaRepository extends JpaRepository<Respuesta, Long> {

    List<Respuesta> findAllByGrupo_Id(Long grupoId);
}
