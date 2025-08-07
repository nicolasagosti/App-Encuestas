package nicolas.framework.encuestas.encuesta.services;

import nicolas.framework.encuestas.Exception.DatabaseException;
import nicolas.framework.encuestas.encuesta.models.entities.User;
import nicolas.framework.encuestas.encuesta.models.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReferenteService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BankService bankService;

    public List<Long> obtenerReferentesDeUnBanco(String banco) {
        String extension = bankService.obtenerExtension(banco);
        return userRepository.findByUsernameEndingWith(extension)
                .stream()
                .map(User::getId)
                .toList();
    }

    public Long obtenerIdDeCLiente(String mailCliente) {
        String normalizado = mailCliente.trim().toLowerCase();
        User user = userRepository.findByUsername(normalizado)
                .orElseThrow(() -> new DatabaseException("Cliente no encontrado con mail: " + normalizado));
        return user.getId();
    }

}