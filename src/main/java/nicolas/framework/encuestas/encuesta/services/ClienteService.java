package nicolas.framework.encuestas.encuesta.services;

import jakarta.transaction.Transactional;
import nicolas.framework.encuestas.Exception.DatabaseException;
import nicolas.framework.encuestas.encuesta.dtos.ClienteOutputDTO;
import nicolas.framework.encuestas.encuesta.dtos.EditarClienteInputDTO;
import nicolas.framework.encuestas.encuesta.dtos.ReferenteDTO;
import nicolas.framework.encuestas.encuesta.models.entities.Grupo;
import nicolas.framework.encuestas.encuesta.models.entities.User;
import nicolas.framework.encuestas.encuesta.models.repositories.GrupoRepository;
import nicolas.framework.encuestas.encuesta.models.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.sql.Ref;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
@Service
public class ClienteService implements IClienteService {

    @Autowired
    private UserRepository clienteRepository;

    @Autowired
    private GrupoService grupoService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private BankService bankService;

    @Override
    @Transactional
    public void asignarClientesAGrupo(Long grupoId, List<Long> clienteIds) {
        Grupo grupo = grupoService.findGrupo(grupoId);

        List<User> clientes = clienteRepository.findAllById(clienteIds);
        if (clientes.isEmpty()) {
            throw new DatabaseException("No se encontraron clientes con los IDs proporcionados");
        }

        Set<Long> encontrados = clientes.stream()
                .map(User::getId)
                .collect(Collectors.toSet());

        List<Long> faltantes = clienteIds.stream()
                .filter(id -> !encontrados.contains(id))
                .toList();

        if (!faltantes.isEmpty()) {
            throw new DatabaseException("Clientes no encontrados con ids " + faltantes);
        }

        clientes.forEach(c -> c.getGrupos().add(grupo));
        clienteRepository.saveAll(clientes);
    }

    @Override
    @Transactional
    public void eliminarReferentes(List<Long> ids){
        clienteRepository.deleteAllById(ids);
    }

    @Override
    @Transactional
    public void editarReferentesDeGrupo(Long idGrupo, List<Long> agregarIds, List<Long> quitarIds) {
        Grupo grupo = grupoService.findGrupo(idGrupo);

        if (agregarIds != null && !agregarIds.isEmpty()) {
            List<User> aAgregar = clienteRepository.findAllById(agregarIds);
            aAgregar.forEach(c -> c.getGrupos().add(grupo));
            clienteRepository.saveAll(aAgregar);
        }

        if (quitarIds != null && !quitarIds.isEmpty()) {
            List<User> aQuitar = clienteRepository.findAllById(quitarIds);
            aQuitar.forEach(c -> c.getGrupos().remove(grupo));
            clienteRepository.saveAll(aQuitar);
        }
    }

    @Override
    public List<Long> obtenerReferentesDeUnGrupo(Long grupoId) {
        return clienteRepository.findDistinctByGrupoId(grupoId)
                .stream()
                .map(User::getId)
                .toList();
    }

    @Override
    public List<Long> obtenerReferentesDeUnBanco(String banco) {
        String extension = bankService.obtenerExtension(banco);
        return clienteRepository.findByUsernameEndingWith(extension)
                .stream()
                .map(User::getId)
                .toList();
    }

    @Override
    public List<ClienteOutputDTO> obtenerTodosLosClientes() {
        return clienteRepository.findAll()
                .stream()
                .map(u -> {
                    ClienteOutputDTO dto = new ClienteOutputDTO(
                            u.getUsername(),
                            u.getNombre(),
                            u.getApellido(),
                            u.getTelefono(),
                            u.getRole().name(),
                            u.isMustChangePassword()
                    );
                    dto.setId(u.getId());
                    return dto;
                })
                .toList();
    }

    @Override
    public Long obtenerIdDeCLiente(String mailCliente) {
        String normalizado = mailCliente.trim().toLowerCase();
        return clienteRepository.findByUsername(normalizado)
                .orElseThrow(() -> new DatabaseException("Cliente no encontrado con mail: " + normalizado))
                .getId();
    }

    @Override
    public boolean obtenerMustChangePassword(String mailCliente) {
        String normalizado = mailCliente.trim().toLowerCase();
        return clienteRepository.findByUsername(normalizado)
                .orElseThrow(() -> new DatabaseException("Cliente no encontrado con mail: " + normalizado))
                .isMustChangePassword();
    }

    @Override
    @Transactional
    public ClienteOutputDTO editarClienteParcial(Long clienteId, EditarClienteInputDTO input) {
        User cliente = clienteRepository.findById(clienteId)
                .orElseThrow(() -> new DatabaseException("Cliente no encontrado con id " + clienteId));

        boolean modifico = false;

        if (input.getUsername() != null) {
            String nuevo = input.getUsername().trim().toLowerCase();
            if (!nuevo.equals(cliente.getUsername())) {
                Optional<User> exist = clienteRepository.findByUsername(nuevo);
                if (exist.isPresent() && !exist.get().getId().equals(clienteId)) {
                    throw new DatabaseException("Ya existe un cliente con username " + nuevo);
                }
                cliente.setUsername(nuevo);
                modifico = true;
            }
        }

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

        ClienteOutputDTO dto = new ClienteOutputDTO(
                cliente.getUsername(),
                cliente.getNombre(),
                cliente.getApellido(),
                cliente.getTelefono(),
                cliente.getRole() != null ? cliente.getRole().name() : null,
                cliente.isMustChangePassword()
        );
        dto.setId(cliente.getId());
        return dto;
    }
}
