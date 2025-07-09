package nicolas.framework.encuestas.encuesta.models.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Table(name = "pregunta")
@Data
public class Pregunta {
    public Pregunta(String texto) {
        this.texto = texto;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String texto;


    @ManyToMany(mappedBy = "preguntas")
    @JsonIgnore
    private List<Encuesta> encuestas;
}
