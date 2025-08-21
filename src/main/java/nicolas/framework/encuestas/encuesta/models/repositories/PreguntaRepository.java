package nicolas.framework.encuestas.encuesta.models.repositories;

import nicolas.framework.encuestas.encuesta.models.entities.Pregunta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface PreguntaRepository extends JpaRepository<Pregunta, Long> {
    @Query("SELECT p FROM Encuesta e JOIN e.preguntas p WHERE e.id = :encuestaId")
    List<Pregunta> findPreguntasByEncuestaId(@Param("encuestaId") Long encuestaId);

    @Query("SELECT p FROM Pregunta p WHERE p.id IN (SELECT MIN(p2.id) FROM Pregunta p2 GROUP BY p2.texto)")
    List<Pregunta> findDistinctByNombre();

}
