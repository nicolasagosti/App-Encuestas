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
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String texto;

    @Column
    private boolean visible = true;

    public Long getId() {
        return id;
    }

    public String getTexto() {
        return texto;
    }

    public Pregunta(PreguntaInputDTO dto) {
        this.texto = dto.getTexto();
    }

    public Pregunta() {
    }

    public void setTexto(String texto) {
        this.texto = texto;
    }

    public boolean isVisible() {
        return visible;
    }

    public void setVisible(boolean visible) {
        this.visible = visible;
    }
}
