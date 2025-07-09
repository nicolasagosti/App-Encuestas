package nicolas.framework.encuestas.encuesta.models.repositories;

import nicolas.framework.encuestas.encuesta.models.entities.Encuesta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EncuestaRepository extends JpaRepository<Encuesta, Long> {
}
