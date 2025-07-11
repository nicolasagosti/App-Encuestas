package nicolas.framework.encuestas.cliente.models.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import nicolas.framework.encuestas.encuesta.models.entities.Pregunta;

import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Respuesta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Cliente cliente;

    @ManyToOne
    private Proyecto proyecto;

    @ManyToOne
    private Pregunta pregunta;

    @Column
    private int puntaje;

    @Column
    private String justificacion;

    @Column
    private LocalDate fechaRespuesta;
}
