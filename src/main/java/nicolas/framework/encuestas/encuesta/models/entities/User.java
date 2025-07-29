package nicolas.framework.encuestas.encuesta.models.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
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
@Data
@NoArgsConstructor
public class User implements UserDetails {
    @Id
    @GeneratedValue
    private Long id;

    @Column(nullable = false)
    private String username;

    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;

    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(
            name = "cliente_x_grupo",
            joinColumns = @JoinColumn(name = "cliente_id"),
            inverseJoinColumns = @JoinColumn(name = "grupo_id")
    )
    private List<Grupo> grupos = new ArrayList<>();

    @OneToMany(mappedBy = "cliente")
    private List<Respuesta> respuestas;

    public User(Long id,
                String username,
                String password,
                Role role) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.role = role;
    }
    @Override
    public String getUsername() {
        return username;
    }
    @Override
    public String getPassword() {
        return password;
    }

    // UserDetails methods
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role));
    }
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }
    @Override
    public boolean isEnabled() {
        return true;
    }

    // Manual builder
    public static Builder builder() {
        return new Builder();
    }
    public static class Builder {
        private Long id;
        private String username;
        private String password;
        private Role role;

        public Builder id(Long id) {
            this.id = id;
            return this;
        }
        public Builder username(String username) {
            this.username = username;
            return this;
        }
        public Builder password(String password) {
            this.password = password;
            return this;
        }
        public Builder role(Role role) {
            this.role = role;
            return this;
        }
        public User build() {
            return new User(id, username, password, role);
        }
    }
}
