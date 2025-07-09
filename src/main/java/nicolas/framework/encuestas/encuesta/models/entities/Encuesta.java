package nicolas.framework.encuestas.encuesta.models.entities;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Builder;

import java.util.List;

@Entity
@Table(name = "encuesta")
@Builder
public class Encuesta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String periodo;

    @ManyToMany(
            cascade = { CascadeType.PERSIST, CascadeType.MERGE },
            fetch   = FetchType.EAGER
    )
    @JoinTable(
            name               = "encuesta_x_pregunta",
            joinColumns        = @JoinColumn(name = "encuesta_id"),
            inverseJoinColumns = @JoinColumn(name = "pregunta_id")
    )
    @JsonManagedReference
    private List<Pregunta> preguntas;

    public Encuesta() { }

    public Encuesta(String periodo, List<Pregunta> preguntas) {
        this.periodo   = periodo;
        this.preguntas = preguntas;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPeriodo() {
        return periodo;
    }

    public void setPeriodo(String periodo) {
        this.periodo = periodo;
    }

    public List<Pregunta> getPreguntas() {
        return preguntas;
    }

    public void setPreguntas(List<Pregunta> preguntas) {
        this.preguntas = preguntas;
    }
}
