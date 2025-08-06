package nicolas.framework.encuestas.encuesta.dtos;

import java.time.LocalDate;
import java.util.List;

public class EncuestaOutputDTO {
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private List<PreguntaOutputDTO> preguntas;
    private Long id;
    private List<GrupoOutputDTO> grupos;
    private GrupoOutputDTO grupoDelCliente;

    public EncuestaOutputDTO(LocalDate fechaInicio, LocalDate fechaFin, List<PreguntaOutputDTO> preguntas, Long id, List<GrupoOutputDTO> grupos) {
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
        this.preguntas = preguntas;
        this.id = id;
        this.grupos = grupos;
    }

    public LocalDate getFechaInicio() {
        return fechaInicio;
    }

    public void setFechaInicio(LocalDate fechaInicio) {
        this.fechaInicio = fechaInicio;
    }

    public LocalDate getFechaFin() {
        return fechaFin;
    }

    public void setFechaFin(LocalDate fechaFin) {
        this.fechaFin = fechaFin;
    }

    public List<PreguntaOutputDTO> getPreguntas() {
        return preguntas;
    }

    public void setPreguntas(List<PreguntaOutputDTO> preguntas) {
        this.preguntas = preguntas;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public List<GrupoOutputDTO> getGrupos() {
        return grupos;
    }

    public void setGrupos(List<GrupoOutputDTO> grupos) {
        this.grupos = grupos;
    }

    public GrupoOutputDTO getGrupoDelCliente() {
        return grupoDelCliente;
    }

    public void setGrupoDelCliente(GrupoOutputDTO grupoDelCliente) {
        this.grupoDelCliente = grupoDelCliente;
    }
}