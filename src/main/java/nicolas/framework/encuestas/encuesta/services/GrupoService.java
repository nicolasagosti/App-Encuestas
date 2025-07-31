package nicolas.framework.encuestas.encuesta.services;
import jakarta.validation.constraints.Null;
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

    @Override
    public GrupoOutputDTO buscarGrupo(Long id) {
        Optional<Grupo> grupo = grupoRepository.findById(id);
        return new GrupoOutputDTO(grupo.get().getId(), grupo.get().getDescripcion(), grupo.get().getCantidadDeColaboradores());
    }

    @Override
    public List<GrupoOutputDTO> todosLosGrupos() {

        List<Grupo> grupos = grupoRepository.findAll();

        return grupos.stream().map(
                grupo -> {
                    return new GrupoOutputDTO(grupo.getId(), grupo.getDescripcion(), grupo.getCantidadDeColaboradores());}
        ).toList();
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
            Grupo grupoGuardado = grupoRepository.save(grupo);
            return new GrupoOutputDTO(
                    grupoGuardado.getId(),
                    grupoGuardado.getDescripcion(),
                    grupoGuardado.getCantidadDeColaboradores()
            );
        } else {
            throw new IllegalArgumentException("Grupo ya existente");
        }
    }



}