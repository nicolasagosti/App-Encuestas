package nicolas.framework.encuestas.encuesta.dtos;


import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class EncuestaOutputDTO {

    private Long id;
    private LocalDateTime fechaInicio;
    private LocalDateTime fechaFin;
    private List<PreguntaOutputDTO> preguntas;
    private List<GrupoOutputDTO> grupos;


    public EncuestaOutputDTO(LocalDateTime fechaInicio, LocalDateTime fechaFin, List<PreguntaOutputDTO> preguntas, Long id, List<GrupoOutputDTO> grupos) {
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
        this.preguntas = preguntas;
        this.id = id;
        this.grupos = grupos;
    }

    public EncuestaOutputDTO() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }



    public List<PreguntaOutputDTO> getPreguntas() {
        return preguntas;
    }

    public void setPreguntas(List<PreguntaOutputDTO> preguntas) {
        this.preguntas = preguntas;
    }

    public List<GrupoOutputDTO> getGrupos() {
        return grupos;
    }

    public void setGrupos(List<GrupoOutputDTO> grupos) {
        this.grupos = grupos;
    }
}