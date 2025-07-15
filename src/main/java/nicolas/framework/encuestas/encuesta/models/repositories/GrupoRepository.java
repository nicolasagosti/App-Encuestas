package nicolas.framework.encuestas.encuesta.models.repositories;

import nicolas.framework.encuestas.encuesta.models.entities.Grupo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GrupoRepository extends JpaRepository<Grupo, Long> {

}