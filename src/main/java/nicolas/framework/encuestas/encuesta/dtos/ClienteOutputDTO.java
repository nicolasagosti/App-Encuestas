package nicolas.framework.encuestas.encuesta.dtos;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ClienteOutputDTO {

    private Long id;
    private String mail;
    private String nombre;
    private String apellido;
    private String telefono;
    private String role;
    private Boolean mustChangePassword;

    public ClienteOutputDTO(String mail, String nombre, String apellido, String telefono, String role, Boolean mustChangePassword) {
        this.mail = mail;
        this.nombre = nombre;
        this.apellido = apellido;
        this.telefono = telefono;
        this.role = role;
        this.mustChangePassword = mustChangePassword;
    }

    public String getMail() {
        return mail;
    }

    public void setMail(String mail) {
        this.mail = mail;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getApellido() {
        return apellido;
    }

    public void setApellido(String apellido) {
        this.apellido = apellido;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Boolean getMustChangePassword() {
        return mustChangePassword;
    }

    public void setMustChangePassword(Boolean mustChangePassword) {
        this.mustChangePassword = mustChangePassword;
    }
}
