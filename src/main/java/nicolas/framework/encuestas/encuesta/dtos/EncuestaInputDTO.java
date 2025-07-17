package nicolas.framework.encuestas.encuesta.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class EncuestaInputDTO {

    @NotNull(message = "El campo 'grupos' es obligatorio")
    private List<Long> grupos;

    @NotNull(message = "El campo 'preguntas' es obligatorio")
    private List<Long> preguntas;

    @NotBlank(message = "El campo 'periodo' es obligatorio")
    private String periodo;


    public List<Long> getGrupos() {
        return grupos;
    }

    public List<Long> getPreguntas() {
        return preguntas;
    }

    public String getPeriodo() {
        return periodo;
    }
}