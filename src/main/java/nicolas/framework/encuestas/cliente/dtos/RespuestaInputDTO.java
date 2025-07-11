package nicolas.framework.encuestas.cliente.dtos;

import lombok.Data;
import nicolas.framework.encuestas.cliente.models.entities.Cliente;
import nicolas.framework.encuestas.cliente.models.entities.Proyecto;
import nicolas.framework.encuestas.encuesta.models.entities.Pregunta;

@Data
public class RespuestaInputDTO {

    private Cliente cliente;
    private Proyecto proyecto;
    private Pregunta pregunta;
    private int puntaje;
    private String justificacion;


}
