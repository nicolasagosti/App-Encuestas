import { useState, useEffect } from 'react';
import { crearPregunta, obtenerPreguntas, eliminarPregunta } from '../services/api';
import './PreguntaForm.css';

export default function PreguntaForm() {
  const [texto, setTexto] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [preguntas, setPreguntas] = useState([]);

  // Carga inicial de preguntas
  useEffect(() => {
    fetchPreguntas();
  }, []);

  const fetchPreguntas = async () => {
    try {
      const res = await obtenerPreguntas();
      setPreguntas(res.data);
    } catch (error) {
      console.error('Error al obtener preguntas:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await crearPregunta(texto);
      setMensaje('✅ Pregunta creada');
      setTexto('');
      fetchPreguntas();
    } catch {
      setMensaje('❌ Error al crear la pregunta');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta pregunta?')) return;
    try {
      await eliminarPregunta(id);
      setMensaje('🗑️ Pregunta eliminada');
      fetchPreguntas();
    } catch {
      setMensaje('❌ Error al eliminar la pregunta');
    }
  };

  return (
    <div className="pregunta-form-container">
      <h2 className="form-title">Agregar Pregunta</h2>
      <form onSubmit={handleSubmit} className="pregunta-form">
        <input
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Texto de la pregunta"
          required
          className="input-texto"
        />
        <button type="submit" className="btn-guardar">
          Guardar
        </button>
      </form>

      {mensaje && <p className="form-mensaje">{mensaje}</p>}

      <ul className="pregunta-list">
        {preguntas.map((p) => (
          <li key={p.id} className="pregunta-item">
            <span className="pregunta-texto">{p.texto}</span>
            <button
              className="btn-eliminar"
              onClick={() => handleDelete(p.id)}
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}