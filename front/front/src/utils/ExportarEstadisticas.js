import jsPDF from "jspdf";
import { autoTable } from 'jspdf-autotable';
import { applyPlugin } from 'jspdf-autotable'
applyPlugin(jsPDF)


export function exportarEstadisticasAGrupo(estadisticas, titulo = "Estadísticas por Grupo") {
  const doc = new jsPDF();
  doc.setFontSize(14);
  doc.text(titulo, 14, 20);

  const columnas = ["Grupo", "Cantidad de Personas", "Promedio"];
  const filas = estadisticas.map(e => [
    e.descripcion || `Grupo ${e.grupoId}`,
    e.cantidadDeColaboradores ?? '—',
    e.promedio != null ? e.promedio.toFixed(2) : '—'
  ]);

  autoTable(doc, {
    startY: 30,
    head: [columnas],
    body: filas,
  });

  doc.save("estadisticas_grupo.pdf");
}

export function exportarEstadisticasClientes(estadisticas, titulo = "Estadísticas por Cliente") {
  const doc = new jsPDF();
  doc.setFontSize(14);
  doc.text(titulo, 14, 20);

  const columnas = ["Cliente", "Promedio"];
  const filas = estadisticas.map(e => [
    e.mail || `Cliente ${e.clienteId}`,
    e.promedio != null ? e.promedio.toFixed(2) : '—'
  ]);

  autoTable(doc, {
    startY: 30,
    head: [columnas],
    body: filas,
  });

  doc.save("estadisticas_clientes.pdf");
}

export function exportarEstadisticasClientesPorPeriodo(datos, titulo = 'Estadísticas por Cliente - Período') {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text(titulo, 14, 20);

  const rows = datos.map(cliente => [
    cliente.mail || `Cliente ${cliente.clienteId}`,
    typeof cliente.promedio === 'number' ? cliente.promedio.toFixed(2) : '—'
  ]);

  doc.autoTable({
    startY: 30,
    head: [['Cliente', 'Promedio']],
    body: rows
  });

  doc.save(`${titulo}.pdf`);
}
