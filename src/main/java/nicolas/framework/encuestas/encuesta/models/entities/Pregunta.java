package nicolas.framework.encuestas.encuesta.models.entities;


import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
public class Pregunta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToMany(mappedBy = "preguntas")
    @Nullable
    private List<Encuesta> encuestas;

    @Column
    private String texto;

    @Column
    @Nullable
    private int puntaje;

    @Column
    @Nullable
    private String justificacion;

    public Pregunta(String texto) {
        this.texto = texto;
    }


}
