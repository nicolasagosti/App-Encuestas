package nicolas.framework.encuestas.encuesta.dtos;

import nicolas.framework.encuestas.encuesta.models.entities.Pregunta;

public class PreguntaOutputDTO {
    private Long id;
    private String texto;

    public PreguntaOutputDTO(Pregunta p) {
        this.id = p.getId();
        this.texto = p.getTexto();
    }

    public Long getId() {
        return id;
    }

    public String getTexto() {
        return texto;
    }
}