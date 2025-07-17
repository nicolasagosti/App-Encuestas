package nicolas.framework.encuestas.encuesta.services;
import nicolas.framework.encuestas.encuesta.dtos.GrupoInputDTO;
import nicolas.framework.encuestas.encuesta.dtos.GrupoOutputDTO;
import nicolas.framework.encuestas.encuesta.models.entities.Grupo;
import nicolas.framework.encuestas.encuesta.models.repositories.GrupoRepository;
import nicolas.framework.encuestas.encuesta.models.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GrupoService implements IGrupoService{

    @Autowired
    private GrupoRepository grupoRepository;

    @Autowired
    private UserRepository clienteRepository;

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
    public void registrarGrupo(GrupoInputDTO dto) {

        Grupo grupo = new Grupo(dto.getDescripcion(), dto.getCantidadDeColaboradores());
        grupoRepository.save(grupo);
    }

}