package nicolas.framework.encuestas.encuesta.services;

import nicolas.framework.encuestas.Exception.DatabaseException;
import nicolas.framework.encuestas.encuesta.dtos.ClienteOutputDTO;
import nicolas.framework.encuestas.encuesta.dtos.EditarClienteInputDTO;
import nicolas.framework.encuestas.encuesta.models.entities.Grupo;
import nicolas.framework.encuestas.encuesta.models.entities.User;
import nicolas.framework.encuestas.encuesta.models.repositories.GrupoRepository;
import nicolas.framework.encuestas.encuesta.models.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ClienteService implements IClienteService {

    private final UserRepository clienteRepository;
    private final GrupoRepository grupoRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public ClienteService(UserRepository clienteRepository,
                          GrupoRepository grupoRepository,
                          PasswordEncoder passwordEncoder) {
        this.clienteRepository = clienteRepository;
        this.grupoRepository = grupoRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void asignarClientesAGrupo(Long grupoId, List<Long> clienteIds) {
        Grupo grupo = grupoRepository.findById(grupoId)
                .orElseThrow(() -> new DatabaseException(
                        "Grupo no encontrado con id " + grupoId
                ));

        List<User> clientes = clienteRepository.findAllById(clienteIds);
        if (clientes.isEmpty()) {
            throw new DatabaseException(
                    "No se encontraron clientes con los IDs proporcionados"
            );
        }

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

        for (User cliente : clientes) {
            cliente.getGrupos().add(grupo);
        }

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
                        u.getNombre(),
                        u.getApellido(),
                        u.getTelefono(),
                        u.getRole() != null ? u.getRole().name() : null,
                        u.isMustChangePassword()
                ))
                .collect(Collectors.toList());
    }

    @Override
    public Long obtenerIdDeCLiente(String mailCliente) {
        System.out.println("🛬 Buscando ID para: " + mailCliente);
        String normalizado = mailCliente.trim().toLowerCase();
        User user = clienteRepository.findByUsername(normalizado)
                .orElseThrow(() -> new DatabaseException(
                        "Cliente no encontrado con mail: " + normalizado
                ));
        return user.getId();
    }

    @Override
    public boolean obtenerMustChangePassword(String mailCliente) {
        System.out.println("🛬 Buscando mustChangePassword para: " + mailCliente);
        String normalizado = mailCliente.trim().toLowerCase();
        User user = clienteRepository.findByUsername(normalizado)
                .orElseThrow(() -> new DatabaseException(
                        "Cliente no encontrado con mail: " + normalizado
                ));
        return user.isMustChangePassword();
    }

    @Override
    public ClienteOutputDTO editarClienteParcial(Long clienteId, EditarClienteInputDTO input) {
        User cliente = clienteRepository.findById(clienteId)
                .orElseThrow(() -> new DatabaseException("Cliente no encontrado con id " + clienteId));

        boolean modifico = false;

        // username: normalizar y validar unicidad si viene distinto
        if (input.getUsername() != null) {
            String nuevoUsername = input.getUsername().trim().toLowerCase();
            if (!nuevoUsername.equals(cliente.getUsername())) {
                Optional<User> existing = clienteRepository.findByUsername(nuevoUsername);
                if (existing.isPresent() && !existing.get().getId().equals(clienteId)) {
                    throw new DatabaseException("Ya existe un cliente con username " + nuevoUsername);
                }
                cliente.setUsername(nuevoUsername);
                modifico = true;
            }
        }

        // password: si viene, se encripta y se actualiza, además se quita el mustChangePassword
        if (input.getPassword() != null) {
            cliente.setPassword(passwordEncoder.encode(input.getPassword()));
            cliente.setMustChangePassword(false);
            modifico = true;
        }

        if (input.getMustChangePassword() != null) {
            cliente.setMustChangePassword(input.getMustChangePassword());
            modifico = true;
        }

        if (input.getNombre() != null) {
            cliente.setNombre(input.getNombre().trim());
            modifico = true;
        }

        if (input.getApellido() != null) {
            cliente.setApellido(input.getApellido().trim());
            modifico = true;
        }

        if (input.getTelefono() != null) {
            cliente.setTelefono(input.getTelefono().trim());
            modifico = true;
        }

        if (modifico) {
            clienteRepository.save(cliente);
        }

        return new ClienteOutputDTO(
                cliente.getUsername(),
                cliente.getNombre(),
                cliente.getApellido(),
                cliente.getTelefono(),
                cliente.getRole() != null ? cliente.getRole().name() : null,
                cliente.isMustChangePassword()
        );
    }
}
