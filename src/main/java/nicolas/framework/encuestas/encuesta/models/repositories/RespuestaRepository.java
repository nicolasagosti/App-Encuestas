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

@Repository
public interface RespuestaRepository extends JpaRepository<Respuesta, Long> {

    List<Respuesta> findAllByGrupo_Id(Long grupoId);
    boolean existsByCliente_IdAndGrupo_IdAndPregunta_Id(Long clienteId, Long grupoId, Long preguntaId);
    boolean existsByCliente_Id(Long clienteId);
    List<Respuesta> findByGrupoId(Long grupoId);
    List <Respuesta> findByClienteId(Long clienteId);

    @Query("SELECT y FROM Respuesta y WHERE y.fechaRespuesta BETWEEN :startDate AND :endDate AND y.grupo.id = :grupoId")
    List<Respuesta> encontrarRespuestasPorGrupoYFecha(@Param("startDate") LocalDate startDate,
                                                     @Param("endDate") LocalDate endDate,
                                                     @Param("grupoId") Long grupoId);

    @Query("SELECT y FROM Respuesta y WHERE y.fechaRespuesta BETWEEN :startDate AND :endDate AND y.cliente.id = :clienteId")
    List<Respuesta> encontrarRespuestasPorClienteYFecha(@Param("startDate") LocalDate startDate,
                                                      @Param("endDate") LocalDate endDate,
                                                      @Param("clienteId") Long clienteId);


}
