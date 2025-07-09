package nicolas.framework.encuestas.encuesta.models.entities;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Data
public class Encuesta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String periodo;

    @ManyToMany
    @JoinTable(
            name = "encuesta_x_pregunta",
            joinColumns = @JoinColumn(name = "encuesta_id"),
            inverseJoinColumns = @JoinColumn(name = "pregunta_id")
    )
    private List<Pregunta> preguntas;




}
