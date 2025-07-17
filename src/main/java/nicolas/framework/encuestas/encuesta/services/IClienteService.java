package nicolas.framework.encuestas.encuesta.services;



import nicolas.framework.encuestas.encuesta.dtos.ClienteInputDTO;

import java.util.List;

public interface IClienteService {

    public void registrarCliente(ClienteInputDTO clienteInputDTO);
    public void asignarGruposACliente(Long clienteId, List<Long> ids);
}