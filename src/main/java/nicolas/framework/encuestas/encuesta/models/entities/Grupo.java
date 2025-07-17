package nicolas.framework.encuestas.encuesta.models.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
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

    @ManyToMany(mappedBy = "grupos")
    @JsonIgnore
    private List<Encuesta> encuestas = new ArrayList<>();

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
