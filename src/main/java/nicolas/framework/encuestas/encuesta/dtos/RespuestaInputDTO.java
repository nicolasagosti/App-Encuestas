package nicolas.framework.encuestas.encuesta.dtos;

import lombok.Data;

@Data
public class RespuestaInputDTO {

    private Long preguntaId;
    private Long grupoId;
    private int puntaje;
    private String justificacion;

    public RespuestaInputDTO() {
    }

    public Long getGrupoId() {
        return grupoId;
    }

    public int getPuntaje() {
        return puntaje;
    }

    public Long getPreguntaId() {
        return preguntaId;
    }

    public String getJustificacion() {
        return justificacion;
    }
}
