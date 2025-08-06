import jsPDF from "jspdf";
import { autoTable } from 'jspdf-autotable';
import { applyPlugin } from 'jspdf-autotable';

applyPlugin(jsPDF);

function generarNombreArchivo(base, titulo, fechaInicio, fechaFin) {
  const tipo = titulo.toLowerCase().replace(/\s+/g, '_');
  const fechas = fechaInicio && fechaFin ? `_${fechaInicio}_a_${fechaFin}` : '';
  return `${base}_${tipo}${fechas}.pdf`;
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
  titulo = "Estadísticas por Grupo",
  fechaInicio = null,
  fechaFin = null
) {
  const doc = new jsPDF();
  agregarTituloYFechas(doc, titulo, fechaInicio, fechaFin);

  const columnas = ["Grupo", "Colaboradores", "Referentes", "Respondieron", "Promedio"];
  const filas = estadisticas.map(e => [
    e.descripcion || `Grupo ${e.grupoId}`,
    e.cantidadDeColaboradores ?? '—',
    e.totalReferentes ?? '—',
    e.referentesQueRespondieron ?? '—',
    e.promedio != null ? e.promedio.toFixed(2) : '—'
  ]);

  autoTable(doc, {
    startY: fechaInicio && fechaFin ? 36 : 30,
    head: [columnas],
    body: filas,
  });

  const archivo = generarNombreArchivo("estadisticas_grupos", titulo, fechaInicio, fechaFin);
  doc.save(archivo);
}

export function exportarEstadisticasClientesPorPeriodo(
  datos,
  titulo = 'Estadísticas por Cliente - Período',
  fechaInicio = null,
  fechaFin = null
) {
  const doc = new jsPDF();
  agregarTituloYFechas(doc, titulo, fechaInicio, fechaFin);

  const filas = datos.map(cliente => [
    cliente.mail || `Cliente ${cliente.clienteId}`,
    typeof cliente.promedio === 'number' ? cliente.promedio.toFixed(2) : '—'
  ]);

  autoTable(doc, {
    startY: fechaInicio && fechaFin ? 36 : 30,
    head: [['Cliente', 'Promedio']],
    body: filas
  });

  const archivo = generarNombreArchivo("estadisticas_clientes", titulo, fechaInicio, fechaFin);
  doc.save(archivo);
}
