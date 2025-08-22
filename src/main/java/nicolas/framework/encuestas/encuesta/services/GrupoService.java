package nicolas.framework.encuestas.encuesta.services;

import nicolas.framework.encuestas.Exception.ResourceNotFoundException;
import nicolas.framework.encuestas.encuesta.dtos.GrupoInputDTO;
import nicolas.framework.encuestas.encuesta.dtos.GrupoOutputDTO;
import nicolas.framework.encuestas.encuesta.dtos.ReferenteDTO;
import nicolas.framework.encuestas.encuesta.models.entities.Bank;
import nicolas.framework.encuestas.encuesta.models.entities.Grupo;
import nicolas.framework.encuestas.encuesta.models.entities.User;
import nicolas.framework.encuestas.encuesta.models.repositories.BankRepository;
import nicolas.framework.encuestas.encuesta.models.repositories.GrupoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class GrupoService implements IGrupoService {
    @Autowired
    private BankRepository bankRepository;


    @Autowired
    private GrupoRepository grupoRepository;

    @Autowired
    private ReferenteService referenteService;

    private GrupoOutputDTO mapGrupoConReferentes(Grupo grupo) {
        List<ReferenteDTO> refs = Optional.ofNullable(grupo.getClientes())
                .orElseGet(Collections::emptyList)
                .stream()
                .map(c -> new ReferenteDTO(c.getId(), c.getNombre(), c.getApellido(), c.getUsername()))
                .toList();

        String ext = null, nom = null, logo = null;
        if (grupo.getCliente() != null) {
            ext  = grupo.getCliente().getExtension();
            nom  = grupo.getCliente().getNombre();
            logo = grupo.getCliente().getLogoBase64();
        }

        return new GrupoOutputDTO(
                grupo.getId(),
                grupo.getDescripcion(),
                grupo.getCantidadDeColaboradores(),
                grupo.getNombre(),
                refs,
                ext,
                nom,
                logo
        );
    }


    public List<GrupoOutputDTO> convertirADTOs(List<Grupo> grupos) {
        return grupos.stream().map(this::mapGrupoConReferentes).toList();
    }

    @Override
    public GrupoOutputDTO buscarGrupo(Long id) {
        return mapGrupoConReferentes(findGrupo(id));
    }

    public Grupo findGrupo(Long id) {
        return grupoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Grupo no encontrado con id " + id));
    }

    @Override
    public List<GrupoOutputDTO> todosLosGrupos() {
        return convertirADTOs(grupoRepository.findAllVisible());
    }

    @Override
    public List<Grupo> buscarGrupos(List<Long> ids) {
        return grupoRepository.findAllById(ids);
    }

    @Override
    @Transactional
    public GrupoOutputDTO registrarGrupo(GrupoInputDTO dto) {
        String desc = Optional.ofNullable(dto.getDescripcion()).orElse("").trim();
        if (desc.isBlank()) throw new IllegalArgumentException("La descripción es obligatoria.");

        if (!grupoRepository.findAllByDescripcionIgnoreCase(desc).isEmpty()) {
            throw new IllegalArgumentException("Grupo ya existente");
        }

        Grupo grupo = new Grupo(desc, dto.getCantidadDeColaboradores());
        grupo.setNombre(Optional.ofNullable(dto.getNombre()).filter(n -> !n.isBlank()).orElse(desc));

        if (dto.getClienteExtension() != null && !dto.getClienteExtension().isBlank()) {
            String ext = dto.getClienteExtension().trim().toLowerCase();
            Bank bank = bankRepository.findById(ext)
                    .orElseThrow(() -> new IllegalArgumentException("Banco no encontrado para extension: " + ext));
            grupo.setCliente(bank);
        }

        return mapGrupoConReferentes(grupoRepository.save(grupo));
    }


    @Override
    @Transactional
    public GrupoOutputDTO editarGrupo(Long id, GrupoInputDTO dto) {
        Grupo grupo = findGrupo(id);

        if (dto.getDescripcion() != null && !dto.getDescripcion().isBlank()) {
            grupo.setDescripcion(dto.getDescripcion().trim());
        }
        if (dto.getNombre() != null && !dto.getNombre().isBlank()) {
            grupo.setNombre(dto.getNombre().trim());
        }
        if (dto.getCantidadDeColaboradores() > 0) {
            grupo.setCantidadDeColaboradores(dto.getCantidadDeColaboradores());
        }

        // actualizar/quitar banco
        if (dto.getClienteExtension() != null) {
            String ext = dto.getClienteExtension().trim().toLowerCase();
            if (ext.isBlank()) {
                grupo.setCliente(null); // quitar relación
            } else {
                Bank bank = bankRepository.findById(ext)
                        .orElseThrow(() -> new IllegalArgumentException("Banco no encontrado para extension: " + ext));
                grupo.setCliente(bank);
            }
        }

        return mapGrupoConReferentes(grupoRepository.save(grupo));
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
        Long clienteId = referenteService.obtenerIdDeCLiente(mail);
        return convertirADTOs(grupoRepository.findGruposByCliente(clienteId));
    }

    @Override
    @Transactional
    public void eliminarGrupo(Long id) {
        Grupo grupo = findGrupo(id);
        grupo.setVisible(false);
        grupoRepository.save(grupo);
    }

    @Transactional
    public GrupoOutputDTO restaurarGrupo(Long id) {
        Grupo grupo = findGrupo(id);
        grupo.setVisible(true);
        grupoRepository.save(grupo);
        return mapGrupoConReferentes(grupo);
    }
}
