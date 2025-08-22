package nicolas.framework.encuestas.encuesta.models.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
public class Grupo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String descripcion;

    @Column(nullable = false)
    private String nombre;

    @Column
    private int cantidadDeColaboradores;

    @Column(nullable = false)
    private boolean visible = true;

    @ManyToMany(mappedBy = "grupos")
    @JsonIgnore
    private List<Encuesta> encuestas = new ArrayList<>();

    @ManyToMany(mappedBy = "grupos")
    private List<User> clientes;

    @OneToMany(mappedBy = "grupo")
    private List<Respuesta> respuestas;

    @ManyToOne
    @JoinColumn(name = "cliente_extension", referencedColumnName = "extension")
    private Bank cliente;

    public Grupo(String descripcion, int cantidadDeColaboradores) {
        this.descripcion = descripcion;
        this.cantidadDeColaboradores = cantidadDeColaboradores;
        this.visible = true;
    }
}
