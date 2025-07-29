package nicolas.framework.encuestas.encuesta.services;

import nicolas.framework.encuestas.encuesta.dtos.GrupoOutputDTO;
import nicolas.framework.encuestas.encuesta.dtos.GrupoPromedioOutputDTO;
import nicolas.framework.encuestas.encuesta.dtos.GrupoPromedioPorFechaOutputDTO;
import nicolas.framework.encuestas.encuesta.models.entities.Respuesta;
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
    public Float promedioDeGrupoPorTrimestre(LocalDate fechaInicial, LocalDate fechaFinal, Long grupoId) {

        List<Respuesta> respuestas = respuestaRepository.encontrarRespuestasPorGrupoYFecha(fechaInicial, fechaFinal, grupoId);

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
    public List<GrupoPromedioPorFechaOutputDTO> promediosDeTodosLosGruposPorTrimestre() {
        List<GrupoOutputDTO> grupos = grupoService.todosLosGrupos();
        List<Respuesta> todasLasRespuestas = respuestaRepository.findAll();

        Set<String> trimestresUnicos = todasLasRespuestas.stream()
                .map(r -> {
                    LocalDate fecha = r.getFechaRespuesta();
                    int trimestre = (fecha.getMonthValue() - 1) / 3 + 1;
                    return fecha.getYear() + "-Q" + trimestre;
                })
                .collect(Collectors.toSet());

        // 2. Armar la lista de DTOs
        List<GrupoPromedioPorFechaOutputDTO> resultado = new ArrayList<>();

        for (GrupoOutputDTO grupo : grupos) {
            Map<String, Float> promediosPorTrimestre = new HashMap<>();

            for (String trimestre : trimestresUnicos) {
                int anio = Integer.parseInt(trimestre.split("-Q")[0]);
                int q = Integer.parseInt(trimestre.split("-Q")[1]);

                LocalDate inicio = LocalDate.of(anio, (q - 1) * 3 + 1, 1);
                LocalDate fin = inicio.plusMonths(3).minusDays(1);

                List<Respuesta> respuestasEnTrimestre = respuestaRepository
                        .encontrarRespuestasPorGrupoYFecha(inicio, fin, grupo.getId());

                Float promedio = calcularPromedio(respuestasEnTrimestre);
                if (promedio != null) {
                    promediosPorTrimestre.put(trimestre, promedio);
                }
            }

            resultado.add(new GrupoPromedioPorFechaOutputDTO(
                    grupo.getId(),
                    grupo.getDescripcion(),
                    promediosPorTrimestre
            ));
        }

        return resultado;
    }

}
