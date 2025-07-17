import { useState, useEffect } from 'react';
import {
  crearPregunta,
  obtenerPreguntas,
  eliminarPregunta,
  editarPregunta
} from '../services/api';
import './ComponentsStyles/PreguntaForm.css';

export default function PreguntaForm() {
  const [texto, setTexto] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [preguntas, setPreguntas] = useState([]);
  const [editId, setEditId] = useState(null);

  useEffect(() => { fetchPreguntas(); }, []);

  const fetchPreguntas = async () => {
    try { const res = await obtenerPreguntas(); setPreguntas(res.data); }
    catch (e) { console.error(e); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await editarPregunta(editId, texto);
        setMensaje('✏️ Pregunta actualizada');
      } else {
        await crearPregunta(texto);
        setMensaje('✅ Pregunta creada');
      }
      setTexto(''); setEditId(null);
      fetchPreguntas();
    } catch {
      setMensaje('❌ Error al guardar la pregunta');
    }
  };

  const iniciarEdicion = (p) => {
    setEditId(p.id);
    setTexto(p.texto);
    setMensaje('');
  };

  return (
    <div className="pregunta-form-container">
      <h2 className="form-title">
        {editId ? 'Editar Pregunta' : 'Agregar Pregunta'}
      </h2>
      <form onSubmit={handleSubmit} className="pregunta-form">
        <input
          value={texto}
          onChange={e => setTexto(e.target.value)}
          placeholder="Texto de la pregunta"
          required
          className="input-texto"
        />
        <button type="submit" className="btn-guardar">
          {editId ? 'Actualizar' : 'Guardar'}
        </button>
        {editId && (
          <button
            type="button"
            className="btn-cancelar"
            onClick={() => { setEditId(null); setTexto(''); }}
          >Cancelar</button>
        )}
      </form>

      {mensaje && <p className="form-mensaje">{mensaje}</p>}

      <ul className="pregunta-list">
        {preguntas.map(p => (
          <li key={p.id} className="pregunta-item">
            <span className="pregunta-texto">{p.texto}</span>
            <div className="btn-group">
              <button
                className="btn-icon btn-editar"
                onClick={() => iniciarEdicion(p)}
                aria-label="Editar pregunta"
              >
                ✏️
              </button>
              <button
                className="btn-icon btn-eliminar"
                onClick={() => eliminarPregunta(p.id).then(fetchPreguntas)}
                aria-label="Eliminar pregunta"
              >
                ❌
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}