package nicolas.framework.encuestas.encuesta.services;

import nicolas.framework.encuestas.Exception.DatabaseException;
import nicolas.framework.encuestas.encuesta.dtos.ClienteOutputDTO;
import nicolas.framework.encuestas.encuesta.models.entities.Grupo;
import nicolas.framework.encuestas.encuesta.models.entities.User;
import nicolas.framework.encuestas.encuesta.models.repositories.GrupoRepository;
import nicolas.framework.encuestas.encuesta.models.repositories.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ClienteService implements IClienteService {

    private final UserRepository clienteRepository;
    private final GrupoRepository grupoRepository;

    public ClienteService(UserRepository clienteRepository,
                          GrupoRepository grupoRepository) {
        this.clienteRepository = clienteRepository;
        this.grupoRepository = grupoRepository;
    }

    @Override
    public void asignarClientesAGrupo(Long grupoId, List<Long> clienteIds) {
        // 1. Buscamos el Grupo
        Grupo grupo = grupoRepository.findById(grupoId)
                .orElseThrow(() -> new DatabaseException(
                        "Grupo no encontrado con id " + grupoId
                ));

        // 2. Buscamos todos los User cuyo ID esté en clienteIds
        List<User> clientes = clienteRepository.findAllById(clienteIds);
        if (clientes.isEmpty()) {
            throw new DatabaseException(
                    "No se encontraron clientes con los IDs proporcionados"
            );
        }

        // 3. Verificamos si hay IDs que no existan en la BD
        Set<Long> encontrados = clientes.stream()
                .map(User::getId)
                .collect(Collectors.toSet());
        List<Long> faltantes = clienteIds.stream()
                .filter(id -> !encontrados.contains(id))
                .toList();
        if (!faltantes.isEmpty()) {
            throw new DatabaseException(
                    "Clientes no encontrados con ids " + faltantes
            );
        }

        // 4. Asignamos el grupo a cada cliente
        for (User cliente : clientes) {
            cliente.getGrupos().add(grupo);
        }

        // 5. Persistimos los cambios en todos los clientes de una vez
        clienteRepository.saveAll(clientes);
    }



    @Override
    public void asignarGruposACliente(Long clienteId, List<Long> ids) {
        User cliente = clienteRepository.findById(clienteId)
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

    @Override
    public List<ClienteOutputDTO> obtenerClientes() {
        List<User> users = clienteRepository.findAll();
        return users.stream()
                .map(u -> new ClienteOutputDTO(
                        u.getUsername(),
                        u.getId()
                ))
                .collect(Collectors.toList());
    }

    @Override
    public Long obtenerIdDeCLiente(String mailCliente) {
        User user = clienteRepository.findByUsername(mailCliente)
                .orElseThrow(() -> new DatabaseException(
                        "Cliente no encontrado con mail: " + mailCliente
                ));
        return user.getId();
    }
}

