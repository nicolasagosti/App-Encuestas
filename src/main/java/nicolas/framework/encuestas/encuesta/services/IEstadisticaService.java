package nicolas.framework.encuestas.encuesta.services;

import nicolas.framework.encuestas.encuesta.dtos.ClientePromedioOutputDTO;
import nicolas.framework.encuestas.encuesta.dtos.GrupoPromedioOutputDTO;
import nicolas.framework.encuestas.encuesta.models.entities.Respuesta;

import java.time.LocalDate;
import java.util.List;

public interface IEstadisticaService {

    public Float calcularPromedio(List <Respuesta> respuestas);
    public Float promedioDeGrupo(Long grupoId);
    public Float promedioDeGrupoPorFecha(LocalDate fechaInicial, LocalDate fechaFinal, Long grupoId);
    public List<GrupoPromedioOutputDTO> promediosDeTodosLosGrupos();
    public List<GrupoPromedioOutputDTO> promediosDeTodosLosGruposPorPeriodo(LocalDate fechaInicio, LocalDate fechaFin);
    public Float promedioDeCliente(Long clienteId);
    public List<ClientePromedioOutputDTO> promediosDeTodosLosClientes();
    public Float promedioDeClientePorFecha(LocalDate fechaInicial, LocalDate fechaFinal, Long clienteId);
    public List<ClientePromedioOutputDTO> promediosDeTodosLosClientesPorPeriodo(LocalDate fechaInicio, LocalDate fechaFin);

    }
