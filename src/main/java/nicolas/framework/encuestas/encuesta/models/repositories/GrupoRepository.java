package nicolas.framework.encuestas.encuesta.models.repositories;

import nicolas.framework.encuestas.encuesta.models.entities.Grupo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import javax.swing.text.html.Option;
import java.util.List;
import java.util.Optional;

@Repository
public interface GrupoRepository extends JpaRepository<Grupo, Long> {

    List<Grupo> findAllByDescripcionIgnoreCase(String descripcion);

    @Query("SELECT DISTINCT u FROM Grupo u JOIN u.clientes g WHERE g.id = :clienteId")
    List<Grupo> findGruposByCliente(@Param("clienteId") Long clienteId);

}