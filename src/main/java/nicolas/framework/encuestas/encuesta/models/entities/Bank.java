package nicolas.framework.encuestas.encuesta.models.entities;


import jakarta.persistence.*;

@Entity
@Table(name = "banks")
public class Bank {

    @Id
    @Column(name = "extension", nullable = false, unique = true, length = 100)
    private String extension;

    @Column
    private String nombre;

    @Lob
    @Column(
            name             = "logo_base64",
            columnDefinition = "LONGTEXT",  // <-- aquí
            nullable         = false
    )
    private String logoBase64;

    public Bank() { }

    public Bank(String extension, String nombre, String logoBase64) {
        this.extension = extension;
        this.nombre = nombre;
        this.logoBase64 = logoBase64;
    }

    public String getExtension() {
        return extension;
    }

    public void setExtension(String extension) {
        this.extension = extension;
    }

    public String getLogoBase64() {
        return logoBase64;
    }

    public void setLogoBase64(String logoBase64) {
        this.logoBase64 = logoBase64;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
}
