package nicolas.framework.encuestas.encuesta.models.entities;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "bank")
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Bank {

    @Id
    @Column(name = "extension", nullable = false, unique = true, length = 100)
    private String extension;

    @Column(length = 100)
    private String nombre;

    @Lob
    @Column(
            name             = "logo_base64",
            columnDefinition = "LONGTEXT",  // <-- aquí
            nullable         = false
    )
    private String logoBase64;



}
