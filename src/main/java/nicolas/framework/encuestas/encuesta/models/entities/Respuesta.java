package nicolas.framework.encuestas.encuesta.models.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
public class Respuesta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User cliente;

    @ManyToOne
    private Grupo grupo;

    @ManyToOne
    private Pregunta pregunta;

    @Column
    private int puntaje;

    @Column
    private String justificacion;

    @Column
    private LocalDate fechaRespuesta;

}
