package nicolas.framework.encuestas.encuesta.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BankInputDTO {
    private String extension;
    private String nombre;
    private String logoBase64;
}
