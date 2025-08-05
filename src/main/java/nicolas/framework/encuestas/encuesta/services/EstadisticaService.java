package nicolas.framework.encuestas.encuesta.services;

import nicolas.framework.encuestas.encuesta.dtos.*;
import nicolas.framework.encuestas.encuesta.models.entities.Respuesta;
import nicolas.framework.encuestas.encuesta.models.entities.User;
import nicolas.framework.encuestas.encuesta.models.repositories.GrupoRepository;
import nicolas.framework.encuestas.encuesta.models.repositories.RespuestaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class EstadisticaService implements IEstadisticaService {

    @Autowired
    RespuestaRepository respuestaRepository;

    @Autowired
    GrupoService grupoService;

    @Autowired
    ClienteService clienteService;

    @Autowired
    BankService bankService;

    @Override
    public Float calcularPromedio(List <Respuesta> respuestas) {

        if (respuestas.isEmpty()) return null;

        float suma = 0;
        for (Respuesta r : respuestas) {
            suma += r.getPuntaje();
        }
        return suma / respuestas.size();
    }

    int cantidadDeReferentesQueRespondieron(Long grupoId) {
        int count = 0;
        List<Long> clientes = clienteService.obtenerReferentesDeUnGrupo(grupoId);
        for (Long clienteId : clientes) {
            if (respuestaRepository.existsByCliente_Id(clienteId)) count++;
        }
        return count;
    }

    @Override
    public Float promedioDeGrupo(Long grupoId) {
        List<Respuesta> respuestas = respuestaRepository.findByGrupoId(grupoId);
       return calcularPromedio(respuestas);
    }

    @Override
    public Float promedioDeGrupoPorFecha(LocalDate fechaInicial, LocalDate fechaFinal, Long grupoId) {
        List<Respuesta> respuestas = respuestaRepository.encontrarRespuestasPorGrupoYFecha(fechaInicial, fechaFinal, grupoId);
       return calcularPromedio(respuestas);
    }

    @Override
    public List<GrupoPromedioOutputDTO> promediosDeTodosLosGrupos() {
        List<GrupoOutputDTO> grupos = grupoService.todosLosGrupos();
        List<GrupoPromedioOutputDTO> resultados = new ArrayList<>();
        for (GrupoOutputDTO grupo : grupos) {
            int totalReferentes = clienteService.obtenerReferentesDeUnGrupo(grupo.getId()).size();
            int respondieron = cantidadDeReferentesQueRespondieron(grupo.getId());
            Float promedio = promedioDeGrupo(grupo.getId());
            resultados.add(new GrupoPromedioOutputDTO(grupo, promedio, totalReferentes, respondieron));
        }
        return resultados;
    }

    @Override
    public List<GrupoPromedioOutputDTO> promediosDeGruposPorBanco(LocalDate fechaInicio, LocalDate fechaFin, String banco) {

        List<GrupoOutputDTO> grupos = grupoService.gruposDeUnBanco(banco);
        List<GrupoPromedioOutputDTO> resultados = new ArrayList<>();

        for (GrupoOutputDTO grupo : grupos) {
            int totalReferentes = clienteService.obtenerReferentesDeUnGrupo(grupo.getId()).size();
            int respondieron = cantidadDeReferentesQueRespondieron(grupo.getId());
            Float promedio = promedioDeGrupoPorFecha(fechaInicio, fechaFin, grupo.getId());
            resultados.add(new GrupoPromedioOutputDTO(grupo, promedio, totalReferentes, respondieron));
        }
        return resultados;

    }


    public List<ClienteOutputDTO> sacarAdmin() {

        List<ClienteOutputDTO> clientes = clienteService.obtenerTodosLosClientes();

        for(int i = 0; i<clientes.size(); i++){
            if(Objects.equals(clientes.get(i).getMail(), "admin@gmail.com")){
                clientes.remove(i);
            }
        }
        return clientes;
    }

}
