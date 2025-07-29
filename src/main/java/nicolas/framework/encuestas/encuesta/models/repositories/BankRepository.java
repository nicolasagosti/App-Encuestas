package nicolas.framework.encuestas.encuesta.models.repositories;

import nicolas.framework.encuestas.encuesta.models.entities.Bank;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BankRepository extends JpaRepository<Bank, String> {

}
