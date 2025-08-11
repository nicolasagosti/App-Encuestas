package nicolas.framework.encuestas.encuesta.services;

import nicolas.framework.encuestas.Exception.ResourceNotFoundException;
import nicolas.framework.encuestas.encuesta.dtos.GrupoInputDTO;
import nicolas.framework.encuestas.encuesta.dtos.GrupoOutputDTO;
import nicolas.framework.encuestas.encuesta.dtos.ReferenteDTO;
import nicolas.framework.encuestas.encuesta.models.entities.Grupo;
import nicolas.framework.encuestas.encuesta.models.entities.User;
import nicolas.framework.encuestas.encuesta.models.repositories.GrupoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class GrupoService implements IGrupoService {

    @Autowired
    private GrupoRepository grupoRepository;

    @Autowired
    private ReferenteService referenteService;

    /* ===================== Mapeos ===================== */

    private GrupoOutputDTO mapWithReferentes(Grupo grupo) {
        List<User> clientes = Optional.ofNullable(grupo.getClientes()).orElseGet(ArrayList::new);

        List<ReferenteDTO> referentes = clientes.stream()
                .map(c -> new ReferenteDTO(c.getNombre(), c.getApellido(), c.getUsername()))
                .collect(Collectors.toList());

        return new GrupoOutputDTO(
                grupo.getId(),
                grupo.getDescripcion(),
                grupo.getCantidadDeColaboradores(),
                grupo.getNombre(),
                Optional.of(referentes) // nunca null; si no hay, lista vacía
        );
    }

    private GrupoOutputDTO mapBasic(Grupo grupo) {
        List<ReferenteDTO> referentes =
                Optional.ofNullable(grupo.getClientes())
                        .orElseGet(java.util.Collections::emptyList)
                        .stream()
                        .map(u -> new ReferenteDTO(u.getNombre(), u.getApellido(), u.getUsername()))
                        .toList(); // Si usás Java 8: .collect(java.util.stream.Collectors.toList())

        return new GrupoOutputDTO(
                grupo.getId(),
                grupo.getDescripcion(),
                grupo.getCantidadDeColaboradores(),
                grupo.getNombre(),
                Optional.of(referentes) // nunca null (lista vacía si no hay clientes)
        );
    }

    public List<GrupoOutputDTO> convertirADTOs(List<Grupo> grupos) {
        return grupos.stream().map(this::mapWithReferentes).toList();
    }

    /* ===================== Queries ===================== */

    @Override
    public GrupoOutputDTO buscarGrupo(Long id) {
        Grupo grupo = grupoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Grupo no encontrado con id " + id));
        return mapWithReferentes(grupo);
    }

    @Override
    public List<GrupoOutputDTO> todosLosGrupos() {
        List<Grupo> grupos = grupoRepository.findAllVisible();
        return convertirADTOs(grupos);
    }

    @Override
    public List<Grupo> buscarGrupos(List<Long> ids) {
        return grupoRepository.findAllById(ids);
    }

    /* ===================== Crear / Editar ===================== */

    @Override
    @Transactional
    public GrupoOutputDTO registrarGrupo(GrupoInputDTO dto) {
        String desc = dto.getDescripcion() == null ? "" : dto.getDescripcion().trim();
        if (desc.isBlank()) {
            throw new IllegalArgumentException("La descripción es obligatoria.");
        }

        List<Grupo> existentes = grupoRepository.findAllByDescripcionIgnoreCase(desc);
        if (!existentes.isEmpty()) {
            throw new IllegalArgumentException("Grupo ya existente");
        }

        Grupo grupo = new Grupo(desc, dto.getCantidadDeColaboradores());
        if (dto.getNombre() != null && !dto.getNombre().isBlank()) {
            grupo.setNombre(dto.getNombre().trim());
        } else {
            grupo.setNombre(desc);
        }

        Grupo guardado = grupoRepository.save(grupo);
        return mapBasic(guardado);
    }

    @Override
    @Transactional
    public GrupoOutputDTO editarGrupo(Long id, GrupoInputDTO dto) {
        Grupo grupo = grupoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Grupo no encontrado con id " + id));

        if (dto.getDescripcion() != null && !dto.getDescripcion().isBlank()) {
            String nuevaDesc = dto.getDescripcion().trim();
            if (!nuevaDesc.equalsIgnoreCase(grupo.getDescripcion())) {
                // Si tenés el método en repo: findAllByDescripcionIgnoreCaseAndIdNot
                // List<Grupo> duplicados = grupoRepository.findAllByDescripcionIgnoreCaseAndIdNot(nuevaDesc, id);
                // if (!duplicados.isEmpty()) throw new IllegalArgumentException("Ya existe un grupo con la descripción: " + nuevaDesc);

                grupo.setDescripcion(nuevaDesc);
            }
        }

        if (dto.getNombre() != null && !dto.getNombre().isBlank()) {
            grupo.setNombre(dto.getNombre().trim());
        }

        if (dto.getCantidadDeColaboradores() > 0) {
            grupo.setCantidadDeColaboradores(dto.getCantidadDeColaboradores());
        }

        Grupo actualizado = grupoRepository.save(grupo);
        return mapWithReferentes(actualizado);
    }

    /* ===================== Otros usos ===================== */

    @Override
    public GrupoOutputDTO agregarReferentes(Long grupoId, List<ReferenteDTO> referenteDTOS) {
        Grupo grupo = grupoRepository.findById(grupoId)
                .orElseThrow(() -> new ResourceNotFoundException("Grupo no encontrado con id " + grupoId));

        List<ReferenteDTO> safe = Optional.ofNullable(referenteDTOS)
                .orElseGet(ArrayList::new);

        return new GrupoOutputDTO(
                grupo.getId(),
                grupo.getDescripcion(),
                grupo.getCantidadDeColaboradores(),
                grupo.getNombre(),
                Optional.of(safe)
        );
    }

    public List<GrupoOutputDTO> gruposDeUnBanco(String banco) {
        List<Long> referentesIds = referenteService.obtenerReferentesDeUnBanco(banco);
        Set<Grupo> grupos = new HashSet<>();

        for (Long clienteId : referentesIds) {
            List<Grupo> gruposDelCliente = grupoRepository.findGruposByCliente(clienteId);
            grupos.addAll(gruposDelCliente);
        }

        return convertirADTOs(new ArrayList<>(grupos));
    }

    public List<GrupoOutputDTO> gruposDeUnReferente(String mail) {
        Long cliente = referenteService.obtenerIdDeCLiente(mail);
        List<Grupo> grupos = grupoRepository.findGruposByCliente(cliente);
        return convertirADTOs(grupos);
    }

    @Override
    @Transactional
    public void eliminarGrupo(Long id) {
        Grupo grupo = grupoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Grupo no encontrado con id " + id));

        // Solo marcar como no visible
        grupo.setVisible(false);
        grupoRepository.save(grupo);
    }

    @Transactional
    public GrupoOutputDTO restaurarGrupo(Long id) {
        Grupo grupo = grupoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Grupo no encontrado con id " + id));
        grupo.setVisible(true);
        grupoRepository.save(grupo);
        return mapWithReferentes(grupo);
    }

}
