package nicolas.framework.encuestas.encuesta.services;

import nicolas.framework.encuestas.encuesta.dtos.ReferenteDTO;
import nicolas.framework.encuestas.encuesta.models.entities.User;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

public class ReferenteMapper {

    public static List<ReferenteDTO> toDTOs(List<User> users) {
        return Optional.ofNullable(users)
                .orElseGet(Collections::emptyList)
                .stream()
                .map(u -> new ReferenteDTO(u.getId(), u.getNombre(), u.getApellido(), u.getUsername()))
                .collect(Collectors.toList());
    }
}
