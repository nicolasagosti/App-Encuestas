package nicolas.framework.encuestas.encuesta.services;

import nicolas.framework.encuestas.encuesta.dtos.*;
import nicolas.framework.encuestas.encuesta.models.entities.Respuesta;
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

    @Override
    public Float calcularPromedio(List <Respuesta> respuestas) {

        if (respuestas.isEmpty()) return null;

        float suma = 0;
        for (Respuesta r : respuestas) {
            suma += r.getPuntaje();
        }
        return suma / respuestas.size();
    }

    @Override
    public Float promedioDeGrupo(Long grupoId) {
        List<Respuesta> respuestas = respuestaRepository.findByGrupoId(grupoId);

       return calcularPromedio(respuestas);
    }

    @Override
    public List<GrupoPromedioOutputDTO> promediosDeTodosLosGrupos(){

        List<GrupoOutputDTO> grupos = grupoService.todosLosGrupos();
        List<GrupoPromedioOutputDTO> grupoPromedios = new ArrayList<>();

        for (GrupoOutputDTO grupo : grupos) {
            Float promedio = promedioDeGrupo(grupo.getId());
            grupoPromedios.add(new GrupoPromedioOutputDTO(grupo, promedio));
        }

        return grupoPromedios;
    }

    @Override
    public Float promedioDeGrupoPorFecha(LocalDate fechaInicial, LocalDate fechaFinal, Long grupoId) {

        List<Respuesta> respuestas = respuestaRepository.encontrarRespuestasPorGrupoYFecha(fechaInicial, fechaFinal, grupoId);
       return calcularPromedio(respuestas);
    }

    @Override
    public List<GrupoPromedioOutputDTO> promediosDeTodosLosGruposPorPeriodo(LocalDate fechaInicio, LocalDate fechaFin) {
        List<GrupoOutputDTO> grupos = grupoService.todosLosGrupos();
        List<GrupoPromedioOutputDTO> estadisticas = new ArrayList<>();

        for(GrupoOutputDTO grupo : grupos) {

           Float promedio = promedioDeGrupoPorFecha(fechaInicio, fechaFin, grupo.getId());
           estadisticas.add(new GrupoPromedioOutputDTO(grupo, promedio));
        }

        return estadisticas;
    }

    @Override
    public Float promedioDeCliente(Long clienteId) {

        List <Respuesta> respuestasDeCliente = respuestaRepository.findByClienteId(clienteId);
       return calcularPromedio(respuestasDeCliente);
    }

    @Override
    public List<ClientePromedioOutputDTO> promediosDeTodosLosClientes() {

        List<ClienteOutputDTO> clientes = sacarAdmin();

        List<ClientePromedioOutputDTO> resultado = new ArrayList<>();

        for (ClienteOutputDTO cliente : clientes) {
            Float promedio = promedioDeCliente(cliente.getId());
            resultado.add(new ClientePromedioOutputDTO(cliente, promedio));
        }

        return resultado;
    }

    @Override
    public Float promedioDeClientePorFecha(LocalDate fechaInicial, LocalDate fechaFinal, Long clienteId) {

        List<Respuesta> respuestas = respuestaRepository.encontrarRespuestasPorClienteYFecha(fechaInicial, fechaFinal, clienteId);
        return calcularPromedio(respuestas);
    }

    @Override
    public List<ClientePromedioOutputDTO> promediosDeTodosLosClientesPorPeriodo(LocalDate fechaInicio, LocalDate fechaFin){

        List<ClienteOutputDTO> clientes = sacarAdmin();

        List<ClientePromedioOutputDTO> estadisticas = new ArrayList<>();

        for(ClienteOutputDTO cliente : clientes) {

            Float promedio = promedioDeClientePorFecha(fechaInicio, fechaFin, cliente.getId());
            estadisticas.add(new ClientePromedioOutputDTO(cliente, promedio));
        }

        return estadisticas;

    }

    public List<ClienteOutputDTO> sacarAdmin() {

        List<ClienteOutputDTO> clientes = clienteService.obtenerClientes();

        for(int i = 0; i<clientes.size(); i++){
            if(Objects.equals(clientes.get(i).getMail(), "admin@gmail.com")){
                clientes.remove(i);
            }
        }
        return clientes;
    }

}
