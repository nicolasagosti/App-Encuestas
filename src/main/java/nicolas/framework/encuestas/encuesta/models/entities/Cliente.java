package nicolas.framework.encuestas.encuesta.models.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    String mail;

    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(
            name = "cliente_x_grupo",
            joinColumns = @JoinColumn(name = "cliente_id"),
            inverseJoinColumns = @JoinColumn(name = "grupo_id")
    )
    private List<Grupo> grupos;

    @OneToMany(mappedBy = "cliente")
    private List<Respuesta> respuestas;

    public String getMail() {
        return mail;
    }

    public List<Grupo> getGrupos() {
        return grupos;
    }

    public Cliente(String mail) {
        this.mail = mail;
    }
}
