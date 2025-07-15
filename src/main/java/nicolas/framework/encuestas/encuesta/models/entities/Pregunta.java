package nicolas.framework.encuestas.encuesta.models.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import nicolas.framework.encuestas.encuesta.dtos.PreguntaInputDTO;

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

    public Long getId() {
        return id;
    }

    public String getTexto() {
        return texto;
    }

    public List<Encuesta> getEncuestas() {
        return encuestas;
    }

    public Pregunta(PreguntaInputDTO dto) {
        this.texto = dto.getTexto();
    }

    public Pregunta() {
    }
}
