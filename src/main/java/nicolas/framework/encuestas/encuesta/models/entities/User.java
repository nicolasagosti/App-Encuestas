package nicolas.framework.encuestas.encuesta.models.entities;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Entity
@Table(
        name = "user",
        uniqueConstraints = @UniqueConstraint(columnNames = {"username"})
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@ToString(exclude = {"password", "grupos", "respuestas"})
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @Column
    private String nombre;

    @Column
    private String apellido;

    @Column
    private String telefono;

    @Builder.Default
    @Column(name = "must_change_password", nullable = false)
    private boolean mustChangePassword = true;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Builder.Default
    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(
            name = "cliente_x_grupo",
            joinColumns = @JoinColumn(name = "cliente_id"),
            inverseJoinColumns = @JoinColumn(name = "grupo_id")
    )
    private List<Grupo> grupos = new ArrayList<>();

    @Builder.Default
    @OneToMany(mappedBy = "cliente")
    private List<Respuesta> respuestas = new ArrayList<>();

    /* --------------- UserDetails --------------- */

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    @Override
    public boolean isAccountNonExpired() { return true; }

    @Override
    public boolean isAccountNonLocked() { return true; }

    @Override
    public boolean isCredentialsNonExpired() { return true; }

    @Override
    public boolean isEnabled() { return true; }
}
