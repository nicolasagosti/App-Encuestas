package nicolas.framework.encuestas.encuesta.models.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;


import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


@Entity
@Data
public class Encuesta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private LocalDateTime fechaInicio;

    @Column
    private LocalDateTime fechaFin;

    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(
            name = "encuesta_x_pregunta",
            joinColumns = @JoinColumn(name = "encuesta_id"),
            inverseJoinColumns = @JoinColumn(name = "pregunta_id")
    )
    private List<Pregunta> preguntas = new ArrayList<>();

    @ManyToMany(cascade = CascadeType.MERGE)
    @JoinTable(
            name = "grupo_x_encuesta",
            joinColumns = @JoinColumn(name = "encuesta_id"),
            inverseJoinColumns = @JoinColumn(name = "grupo_id")
    )
    private List<Grupo> grupos = new ArrayList<>();

    public Encuesta(LocalDateTime fechaInicio, LocalDateTime fechaFin, List<Pregunta> preguntas, List<Grupo> grupos) {
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
        this.preguntas = preguntas;
        this.grupos = grupos;
    }

    public Long getId() {
        return id;
    }


    public List<Pregunta> getPreguntas() {
        return preguntas;
    }

    public List<Grupo> getGrupos() {
        return grupos;
    }

    public Encuesta() {
    }

    public LocalDateTime getFechaInicio() {
        return fechaInicio;
    }

    public void setFechaInicio(LocalDateTime fechaInicio) {
        this.fechaInicio = fechaInicio;
    }

    public LocalDateTime getFechaFin() {
        return fechaFin;
    }

    public void setFechaFin(LocalDateTime fechaFin) {
        this.fechaFin = fechaFin;
    }
}