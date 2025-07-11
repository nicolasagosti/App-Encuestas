package nicolas.framework.encuestas.cliente.models.entities;

import jakarta.persistence.*;
import lombok.Data;
import nicolas.framework.encuestas.encuesta.models.entities.Encuesta;

import java.util.List;

@Entity
@Data
public class Proyecto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String nombre;

    @Column
    private int cantidadDeColaboradores;

    @ManyToOne
    private Encuesta encuesta;

    @OneToMany
    private List<Respuesta> respuestas;

}
