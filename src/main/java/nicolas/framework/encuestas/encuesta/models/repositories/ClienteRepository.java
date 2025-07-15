package nicolas.framework.encuestas.encuesta.models.repositories;

import nicolas.framework.encuestas.encuesta.models.entities.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {
}
