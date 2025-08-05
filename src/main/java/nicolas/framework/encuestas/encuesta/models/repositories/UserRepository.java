package nicolas.framework.encuestas.encuesta.models.repositories;


import nicolas.framework.encuestas.encuesta.models.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findUserByUsername(String adminEmail);
    boolean existsByUsername(String username);

    @Query("SELECT DISTINCT u FROM User u JOIN u.grupos g WHERE g.id = :grupoId")
    List<User> findDistinctByGrupoId(@Param("grupoId") Long grupoId);

    @Query("SELECT u FROM User u WHERE u.username LIKE %:extension")
    List<User> findByUsernameEndingWith(@Param("extension") String extension);

}
