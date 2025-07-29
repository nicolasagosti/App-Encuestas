package nicolas.framework.encuestas.encuesta.models.repositories;


import nicolas.framework.encuestas.encuesta.models.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    Optional<User> findUserByUsername(String adminEmail);
}
