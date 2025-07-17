// front/src/components/EncuestaForm.jsx
import { useState, useEffect } from 'react';
import { obtenerPreguntas, crearEncuesta, obtenerGrupos } from '../services/api';
import './ComponentsStyles/EncuestaForm.css';

export default function EncuestaForm() {
  const [periodo, setPeriodo] = useState('');
  const [preguntasDisponibles, setPreguntasDisponibles] = useState([]);
  const [gruposDisponibles, setGruposDisponibles] = useState([]);
  const [preguntaIdsSeleccionadas, setPreguntaIdsSeleccionadas] = useState([]);
  const [grupoIdsSeleccionados, setGrupoIdsSeleccionados] = useState([]);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    obtenerPreguntas().then((res) => setPreguntasDisponibles(res.data));
    obtenerGrupos().then((res) => setGruposDisponibles(res.data));
  }, []);

  const handleCheckbox = (id, list, setter) => {
    setter((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await crearEncuesta({
        periodo,
        preguntas: preguntaIdsSeleccionadas,
        grupos: grupoIdsSeleccionados
      });
      setMensaje('✅ Encuesta creada correctamente');
      setPeriodo('');
      setPreguntaIdsSeleccionadas([]);
      setGrupoIdsSeleccionados([]);
    } catch {
      setMensaje('❌ Error al crear encuesta');
    }
  };

  return (
    <div className="encuesta-form-container">
      <h2 className="form-title">Crear Encuesta</h2>
      <form onSubmit={handleSubmit} className="encuesta-form">
        {/* 1) Input de periodo + botón */}
        <div className="form-row">
          <input
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
            placeholder="Periodo (ej: Q3-2025)"
            required
            className="input-periodo"
          />
          <button type="submit" className="btn-crear">
            Crear encuesta
          </button>
        </div>

        {/* 2) Selección de preguntas */}
        <div className="form-group">
          <h4 className="group-label">Seleccioná preguntas:</h4>
          <div className="checkbox-list">
            {preguntasDisponibles.map((p) => (
              <label key={p.id} className="checkbox-item">
                <input
                  type="checkbox"
                  checked={preguntaIdsSeleccionadas.includes(p.id)}
                  onChange={() =>
                    handleCheckbox(
                      p.id,
                      preguntaIdsSeleccionadas,
                      setPreguntaIdsSeleccionadas
                    )
                  }
                />
                {p.texto}
              </label>
            ))}
          </div>
        </div>

        {/* 3) Selección de grupos */}
        <div className="form-group">
          <h4 className="group-label">Seleccioná grupos:</h4>
          <div className="checkbox-list">
            {gruposDisponibles.map((g) => (
              <label key={g.id} className="checkbox-item">
                <input
                  type="checkbox"
                  checked={grupoIdsSeleccionados.includes(g.id)}
                  onChange={() =>
                    handleCheckbox(
                      g.id,
                      grupoIdsSeleccionados,
                      setGrupoIdsSeleccionados
                    )
                  }
                />
                {g.descripcion} ({g.cantidadDeColaboradores})
              </label>
            ))}
          </div>
        </div>
      </form>

      {mensaje && <p className="form-mensaje">{mensaje}</p>}
    </div>
);
}
