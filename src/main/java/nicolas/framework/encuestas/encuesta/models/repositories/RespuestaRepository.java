package nicolas.framework.encuestas.encuesta.models.repositories;

import nicolas.framework.encuestas.encuesta.models.entities.Pregunta;
import nicolas.framework.encuestas.encuesta.models.entities.Respuesta;
import nicolas.framework.encuestas.encuesta.models.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface RespuestaRepository extends JpaRepository<Respuesta, Long> {

    boolean existsByCliente_IdAndGrupo_IdAndPregunta_Id(Long clienteId, Long grupoId, Long preguntaId);
    boolean existsByCliente_Id(Long clienteId);
    List<Respuesta> findByGrupoId(Long grupoId);

    @Query("SELECT y FROM Respuesta y WHERE y.fechaRespuesta BETWEEN :startDate AND :endDate AND y.grupo.id = :grupoId")
    List<Respuesta> encontrarRespuestasPorGrupoYFecha(@Param("startDate") LocalDate startDate,
                                                     @Param("endDate") LocalDate endDate,
                                                     @Param("grupoId") Long grupoId);

    Optional<Respuesta> findByClienteIdAndEncuestaIdAndPreguntaId(Long clienteId, Long encuestaId, Long preguntaId);
    Optional <Respuesta> findByClienteIdAndGrupoIdAndPreguntaId(Long clienteId, Long grupoId, Long preguntaId);





}
