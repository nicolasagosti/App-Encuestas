package nicolas.framework.encuestas.encuesta.models.entities;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Data
public class Grupo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String descripcion;

    @Column
    private int cantidadDeColaboradores;

    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(
            name = "grupo_x_encuesta",
            joinColumns = @JoinColumn(name = "grupo_id"),
            inverseJoinColumns = @JoinColumn(name = "encuesta_id")
    )
    private List<Encuesta> encuestas;

    @ManyToMany(mappedBy = "grupos")
    private List<User> clientes;

    @OneToMany(mappedBy = "grupo")
    private List<Respuesta> respuestas;

    public Grupo(String descripcion, int cantidadDeColaboradores) {
        this.descripcion = descripcion;
        this.cantidadDeColaboradores = cantidadDeColaboradores;
    }

    public Grupo() {
    }

    public Long getId() {
        return id;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public int getCantidadDeColaboradores() {
        return cantidadDeColaboradores;
    }

    public List<Encuesta> getEncuestas() {
        return encuestas;
    }

    public List<User> getClientes() {
        return clientes;
    }

    public List<Respuesta> getRespuestas() {
        return respuestas;
    }
}
