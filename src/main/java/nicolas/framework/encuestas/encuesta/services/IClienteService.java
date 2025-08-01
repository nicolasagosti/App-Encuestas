package nicolas.framework.encuestas.encuesta.services;



import nicolas.framework.encuestas.encuesta.dtos.ClienteInputDTO;
import nicolas.framework.encuestas.encuesta.dtos.ClienteOutputDTO;

import java.util.List;

public interface IClienteService {

    public void asignarGruposACliente(Long clienteId, List<Long> ids);
    public void asignarClientesAGrupo(Long grupoId, List<Long> clienteIds);
    public List<ClienteOutputDTO> obtenerClientes();
    boolean obtenerMustChangePassword(String mailCliente);
    Long obtenerIdDeCLiente(String mailCliente);
}