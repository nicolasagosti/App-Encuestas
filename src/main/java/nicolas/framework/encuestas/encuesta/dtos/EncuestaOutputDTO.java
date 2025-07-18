package nicolas.framework.encuestas.encuesta.dtos;


import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
public class EncuestaOutputDTO {

    private Long id;
    private String periodo;
    private List<PreguntaOutputDTO> preguntas;
    private List<GrupoOutputDTO> grupos;

    public EncuestaOutputDTO(Long id, String periodo, List<PreguntaOutputDTO> preguntas, List<GrupoOutputDTO> grupos) {
        this.id = id;
        this.periodo = periodo;
        this.preguntas = preguntas;
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

    public String getPeriodo() {
        return periodo;
    }

    public void setPeriodo(String periodo) {
        this.periodo = periodo;
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