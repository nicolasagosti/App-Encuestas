package nicolas.framework.encuestas.encuesta.models.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import nicolas.framework.encuestas.encuesta.dtos.PreguntaInputDTO;

import java.util.List;

@Entity
@Table(name = "pregunta")
@Data
@NoArgsConstructor
public class Pregunta {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String texto;

    @Column
    private Boolean visible = true;


    public Pregunta(PreguntaInputDTO dto) {
        this.texto = dto.getTexto();
    }


    public Boolean isVisible() {
        return visible;
    }

}
