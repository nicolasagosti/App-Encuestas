package nicolas.framework.encuestas.cliente.models.entities;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Data
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    String mail;

    @OneToMany
    List<Proyecto> proyectos;

    @OneToMany
    private List<Respuesta> respuestas;
}
