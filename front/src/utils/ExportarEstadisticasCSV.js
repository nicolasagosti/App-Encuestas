// ExportarEstadisticasCSV.js
export function exportarEstadisticasAGrupoCSV(
  estadisticas,
  titulo = "Estadísticas por Cliente",
  fechaInicio = null,
  fechaFin = null,
  tipo = "todos",
  bancoSeleccionado = "",
  bancos = []
) {
  let subTituloExtra = "";

  if (tipo === "banco" && bancoSeleccionado) {
    const banco = bancos.find(b => b.extension === bancoSeleccionado);
    if (banco) {
      subTituloExtra = `Cliente: ${banco.extension}`;
      titulo += ` - ${banco.extension}`;
    } else {
      subTituloExtra = `Cliente: ${bancoSeleccionado}`;
      titulo += ` - ${bancoSeleccionado}`;
    }
  }

  const columnas = ["Grupo", "Colaboradores", "Referentes", "Respondieron", "Promedio"];
  const filas = estadisticas.map(e => [
    e.descripcion || `Grupo ${e.grupoId}`,
    e.cantidadDeColaboradores ?? "",
    e.totalReferentes ?? "",
    e.referentesQueRespondieron ?? "",
    e.promedio != null ? e.promedio.toFixed(2) : ""
  ]);

  let csvContent = columnas.join(",") + "\n";
  filas.forEach(fila => {
    csvContent += fila.map(valor => `"${valor}"`).join(",") + "\n";
  });

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = generarNombreArchivo("estadisticas_grupos", titulo, fechaInicio, fechaFin, "csv");
  link.click();
}

function generarNombreArchivo(base, titulo, fechaInicio, fechaFin, extension = 'csv') {
  const tipo = titulo.toLowerCase().replace(/\s+/g, '_');
  const fechas = fechaInicio && fechaFin ? `_${fechaInicio}_a_${fechaFin}` : '';
  return `${base}_${tipo}${fechas}.${extension}`;
}
