package nicolas.framework.encuestas.encuesta.models.entities;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import nicolas.framework.encuestas.encuesta.dtos.EncuestaInputDTO;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
public class Encuesta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String periodo;

    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(
            name = "encuesta_x_pregunta",
            joinColumns = @JoinColumn(name = "encuesta_id"),
            inverseJoinColumns = @JoinColumn(name = "pregunta_id")
    )
    private List<Pregunta> preguntas = new ArrayList<>();

    public Encuesta(EncuestaInputDTO encuestaDTO) {

        this.periodo = encuestaDTO.getPeriodo();

        for(int i = 0; i < encuestaDTO.getPreguntas().size(); i++) {
            this.preguntas.add(new Pregunta(encuestaDTO.getPreguntas().get(i)));
        }
    }

    public Encuesta() {
    }
}