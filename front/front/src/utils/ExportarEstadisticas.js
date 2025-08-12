// ExportarEstadisticas.js
import jsPDF from "jspdf";
import { autoTable } from 'jspdf-autotable';
import { applyPlugin } from 'jspdf-autotable';

applyPlugin(jsPDF);

function generarNombreArchivo(base, titulo, fechaInicio, fechaFin, extension = 'pdf') {
  const tipo = titulo.toLowerCase().replace(/\s+/g, '_');
  const fechas = fechaInicio && fechaFin ? `_${fechaInicio}_a_${fechaFin}` : '';
  return `${base}_${tipo}${fechas}.${extension}`;
}

function agregarTituloYFechas(doc, titulo, fechaInicio, fechaFin) {
  doc.setFontSize(14);
  doc.text(titulo, 14, 20);

  if (fechaInicio && fechaFin) {
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Período: ${fechaInicio} al ${fechaFin}`, 14, 28);
  }
}

export function exportarEstadisticasAGrupo(
  estadisticas,
  titulo = "Estadísticas por Banco",
  fechaInicio = null,
  fechaFin = null,
  tipo = "todos",
  bancoSeleccionado = "",
  bancos = []
) {
  const doc = new jsPDF();

  let subTituloExtra = "";

  if (tipo === "banco" && bancoSeleccionado) {
    const banco = bancos.find(b => b.extension === bancoSeleccionado);
    if (banco) {
      subTituloExtra = `Banco: ${banco.extension}`;
      titulo += ` - ${banco.extension}`;
    } else {
      subTituloExtra = `Banco: ${bancoSeleccionado}`;
      titulo += ` - ${bancoSeleccionado}`;
    }
  }

  agregarTituloYFechas(doc, titulo, fechaInicio, fechaFin);

  if (subTituloExtra) {
    doc.setFontSize(11);
    doc.setTextColor(50);
    const y = fechaInicio && fechaFin ? 34 : 28;
    doc.text(subTituloExtra, 14, y);
  }

  const columnas = ["Grupo", "Colaboradores", "Referentes", "Respondieron", "Promedio"];
  const filas = estadisticas.map(e => [
    e.descripcion || `Grupo ${e.grupoId}`,
    e.cantidadDeColaboradores ?? "—",
    e.totalReferentes ?? "—",
    e.referentesQueRespondieron ?? "—",
    e.promedio != null ? e.promedio.toFixed(2) : "—"
  ]);

  autoTable(doc, {
    startY: fechaInicio && fechaFin ? (subTituloExtra ? 42 : 36) : (subTituloExtra ? 36 : 30),
    head: [columnas],
    body: filas
  });

  const archivo = generarNombreArchivo("estadisticas_grupos", titulo, fechaInicio, fechaFin);
  doc.save(archivo);
}
