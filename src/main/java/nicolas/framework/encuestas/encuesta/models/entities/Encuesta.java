package nicolas.framework.encuestas.encuesta.models.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
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

    @ManyToMany
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

    }

