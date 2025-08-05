package nicolas.framework.encuestas.encuesta.services;
import jakarta.validation.constraints.Null;
import nicolas.framework.encuestas.Exception.ResourceNotFoundException;
import nicolas.framework.encuestas.encuesta.dtos.GrupoInputDTO;
import nicolas.framework.encuestas.encuesta.dtos.GrupoOutputDTO;
import nicolas.framework.encuestas.encuesta.models.entities.Grupo;
import nicolas.framework.encuestas.encuesta.models.repositories.GrupoRepository;
import nicolas.framework.encuestas.encuesta.models.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class GrupoService implements IGrupoService{

    @Autowired
    private GrupoRepository grupoRepository;

    @Autowired
    private ClienteService clienteService;


    public List<GrupoOutputDTO> convertirADTOs(List<Grupo> grupos) {
        return grupos.stream()
                .map(grupo -> new GrupoOutputDTO(
                        grupo.getId(),
                        grupo.getDescripcion(),
                        grupo.getCantidadDeColaboradores(),
                        grupo.getNombre()
                ))
                .toList();
    }

    @Override
    public GrupoOutputDTO buscarGrupo(Long id) {
        Grupo grupo = grupoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Grupo no encontrado con id " + id));
        return new GrupoOutputDTO(
                grupo.getId(),
                grupo.getDescripcion(),
                grupo.getCantidadDeColaboradores(),
                grupo.getNombre()
        );
    }

    @Override
    public List<GrupoOutputDTO> todosLosGrupos() {
        List<Grupo> grupos = grupoRepository.findAll();
        return convertirADTOs(grupos);
    }


    @Override
    public List<Grupo> buscarGrupos(List<Long> ids) {
        return grupoRepository.findAllById(ids);
    }


    @Override
    public GrupoOutputDTO registrarGrupo(GrupoInputDTO dto) {
        List<Grupo> grupos = grupoRepository.findAllByDescripcionIgnoreCase(dto.getDescripcion().trim());

        if (grupos.isEmpty()) {
            Grupo grupo = new Grupo(dto.getDescripcion(), dto.getCantidadDeColaboradores());
            // asignar nombre si viene, sino dejar vacío o usar la descripción como fallback
            if (dto.getNombre() != null && !dto.getNombre().isBlank()) {
                grupo.setNombre(dto.getNombre().trim());
            } else {
                grupo.setNombre(dto.getDescripcion().trim());
            }

            Grupo grupoGuardado = grupoRepository.save(grupo);
            return new GrupoOutputDTO(
                    grupoGuardado.getId(),
                    grupoGuardado.getDescripcion(),
                    grupoGuardado.getCantidadDeColaboradores(),
                    grupoGuardado.getNombre() // asumiendo que el output DTO ahora incluye nombre
            );
        } else {
            throw new IllegalArgumentException("Grupo ya existente");
        }
    }

    public List<GrupoOutputDTO> gruposDeUnBanco(String banco) {

        List<Long> referentes = clienteService.obtenerReferentesDeUnBanco(banco);
        List<Grupo> grupos = grupoRepository.findAllById(referentes);
        return convertirADTOs(grupos);
    }

}