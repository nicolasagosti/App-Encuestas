package nicolas.framework.encuestas.encuesta.services;

import nicolas.framework.encuestas.Exception.DatabaseException;
import nicolas.framework.encuestas.Exception.ResourceNotFoundException;
import nicolas.framework.encuestas.encuesta.dtos.ClienteInputDTO;
import nicolas.framework.encuestas.encuesta.models.entities.Cliente;
import nicolas.framework.encuestas.encuesta.models.entities.Grupo;
import nicolas.framework.encuestas.encuesta.models.repositories.ClienteRepository;
import nicolas.framework.encuestas.encuesta.models.repositories.GrupoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ClienteService implements IClienteService {

    private final ClienteRepository clienteRepository;
    private final GrupoRepository grupoRepository;

    public ClienteService(ClienteRepository clienteRepository,
                          GrupoRepository grupoRepository) {
        this.clienteRepository = clienteRepository;
        this.grupoRepository = grupoRepository;
    }

    @Override
    public void registrarCliente(ClienteInputDTO dto) {
        if (dto.getMail() == null || dto.getMail().isBlank()) {
            throw new IllegalArgumentException("El mail de cliente es obligatorio");
        }
        Cliente cliente = new Cliente(dto.getMail());
        clienteRepository.save(cliente);
    }

    @Override
    public void asignarGruposACliente(Long clienteId, List<Long> ids) {
        Cliente cliente = clienteRepository.findById(clienteId)
                .orElseThrow(() -> new DatabaseException(
                        "Cliente no encontrado con id " + clienteId));

        List<Grupo> grupos = grupoRepository.findAllById(ids);
        if (grupos.isEmpty()) {
            throw new DatabaseException("No se encontraron grupos con los IDs proporcionados");
        }
        Set<Long> encontrados = grupos.stream()
                .map(Grupo::getId)
                .collect(Collectors.toSet());
        List<Long> faltantes = ids.stream()
                .filter(id -> !encontrados.contains(id))
                .toList();
        if (!faltantes.isEmpty()) {
            throw new DatabaseException(
                    "Grupos no encontrados con ids " + faltantes);
        }

        cliente.getGrupos().addAll(grupos);
        clienteRepository.save(cliente);
    }
}

