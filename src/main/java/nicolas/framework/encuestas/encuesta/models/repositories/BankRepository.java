package nicolas.framework.encuestas.encuesta.models.repositories;

import nicolas.framework.encuestas.encuesta.models.entities.Bank;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BankRepository extends JpaRepository<Bank, String> {

    Optional<Bank> findByExtensionIgnoreCase(String extension);
    Optional<Bank> findByNombreIgnoreCase(String nombre);
    boolean existsByExtension(String extension);
    boolean existsByNombre(String name);
}
