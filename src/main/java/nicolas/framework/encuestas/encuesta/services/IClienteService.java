package nicolas.framework.encuestas.encuesta.services;



import nicolas.framework.encuestas.encuesta.dtos.ClienteInputDTO;
import nicolas.framework.encuestas.encuesta.dtos.ClienteOutputDTO;
import nicolas.framework.encuestas.encuesta.dtos.EditarClienteInputDTO;

import java.util.List;

public interface IClienteService {
    ClienteOutputDTO editarClienteParcial(Long clienteId, EditarClienteInputDTO input);
    public void asignarClientesAGrupo(Long grupoId, List<Long> clienteIds);
    public List<ClienteOutputDTO> obtenerTodosLosClientes();
    public void eliminarReferentes(List<Long> clienteIds);
    boolean obtenerMustChangePassword(String mailCliente);
    Long obtenerIdDeCLiente(String mailCliente);
    List<Long> obtenerReferentesDeUnGrupo(Long grupoId);
    List<Long> obtenerReferentesDeUnBanco(String banco);
    public void editarReferentesDeGrupo(Long idGrupo, List<Long> agregarReferentes, List<Long> quitarReferentes);
    }