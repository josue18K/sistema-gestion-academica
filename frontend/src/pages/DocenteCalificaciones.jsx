import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { notaService } from '../services/notaService';
import { inscripcionService } from '../services/inscripcionService';
import api from '../services/api';
import Navbar from '../components/Navbar';

const DocenteCalificaciones = () => {
  const [grupos, setGrupos] = useState([]);
  const [selectedGrupo, setSelectedGrupo] = useState(null);
  const [inscripciones, setInscripciones] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedInscripcion, setSelectedInscripcion] = useState(null);
  const [formData, setFormData] = useState({
    tipo_evaluacion: '',
    nota: '',
    porcentaje: 100,
    fecha_evaluacion: new Date().toISOString().split('T')[0],
    observaciones: '',
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { label: 'Inicio', path: '/docente/dashboard' },
    { label: 'Mis Grupos', path: '/docente/mis-grupos' },
    { label: 'Tareas', path: '/docente/tareas' },
    { label: 'Asistencias', path: '/docente/asistencias' },
    { label: 'Calificaciones', path: '/docente/calificaciones' },
  ];

  const tiposEvaluacion = [
    'Examen Parcial',
    'Examen Final',
    'Tarea',
    'Trabajo Práctico',
    'Proyecto',
    'Participación',
    'Otro',
  ];

  useEffect(() => {
    fetchGrupos();
  }, []);

  useEffect(() => {
    if (selectedGrupo) {
      fetchInscripciones();
    }
  }, [selectedGrupo]);

  const fetchGrupos = async () => {
    try {
      const meResponse = await api.get('/me');
      const docenteId = meResponse.data.docente?.id;

      if (docenteId) {
        const gruposResponse = await api.get('/grupos');
        const misGrupos = gruposResponse.data.filter(g => g.docente_id === docenteId);
        setGrupos(misGrupos);
      }
    } catch (error) {
      console.error('Error al cargar grupos:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchInscripciones = async () => {
    try {
      const data = await inscripcionService.getByGrupo(selectedGrupo);

      // Obtener notas para cada inscripción
      const inscripcionesConNotas = await Promise.all(
        data.map(async (inscripcion) => {
          try {
            const notas = await notaService.getByInscripcion(inscripcion.id);
            const promedio = await notaService.getPromedio(inscripcion.id);
            return {
              ...inscripcion,
              notas: notas,
              promedio: promedio.promedio || 0,
            };
          } catch (error) {
            return {
              ...inscripcion,
              notas: [],
              promedio: 0,
            };
          }
        })
      );

      setInscripciones(inscripcionesConNotas);
    } catch (error) {
      console.error('Error al cargar inscripciones:', error);
    }
  };

  const handleRegistrarNota = (inscripcion) => {
    setSelectedInscripcion(inscripcion);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await notaService.create({
        inscripcion_id: selectedInscripcion.id,
        ...formData,
        nota: parseFloat(formData.nota),
        porcentaje: parseInt(formData.porcentaje),
      });

      fetchInscripciones();
      handleCloseModal();
      alert('Nota registrada exitosamente');
    } catch (error) {
      console.error('Error al registrar nota:', error);
      alert('Error al registrar la nota');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedInscripcion(null);
    setFormData({
      tipo_evaluacion: '',
      nota: '',
      porcentaje: 100,
      fecha_evaluacion: new Date().toISOString().split('T')[0],
      observaciones: '',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar title="Portal Docente" menuItems={menuItems} />

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Registro de Calificaciones
          </h2>

          {/* Selección de Grupo */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Seleccionar Grupo
            </label>
            <select
              value={selectedGrupo || ''}
              onChange={(e) => setSelectedGrupo(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Seleccione un grupo --</option>
              {grupos.map((grupo) => (
                <option key={grupo.id} value={grupo.id}>
                  {grupo.materia?.nombre} - {grupo.nombre_grupo} ({grupo.periodo})
                </option>
              ))}
            </select>
          </div>

          {/* Tabla de Estudiantes */}
          {selectedGrupo && inscripciones.length > 0 && (
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Código
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Estudiante
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Notas Registradas
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Promedio
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {inscripciones.map((inscripcion) => (
                    <tr key={inscripcion.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {inscripcion.estudiante?.codigo_estudiante}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {inscripcion.estudiante?.user?.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {inscripcion.notas && inscripcion.notas.length > 0 ? (
                          <div className="space-y-1">
                            {inscripcion.notas.map((nota, idx) => (
                              <div key={idx} className="text-sm text-gray-600">
                                {nota.tipo_evaluacion}: <strong>{nota.nota}</strong> (
                                {nota.porcentaje}%)
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">Sin notas</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`text-2xl font-bold ${
                            inscripcion.promedio >= 14
                              ? 'text-green-600'
                              : inscripcion.promedio >= 11
                              ? 'text-yellow-600'
                              : 'text-red-600'
                          }`}
                        >
                          {inscripcion.promedio.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleRegistrarNota(inscripcion)}
                          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                        >
                          + Registrar Nota
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {selectedGrupo && inscripciones.length === 0 && (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-600">No hay estudiantes inscritos en este grupo.</p>
            </div>
          )}

          {!selectedGrupo && (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-600">Seleccione un grupo para ver las calificaciones.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal Registrar Nota */}
      {showModal && selectedInscripcion && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Registrar Nota para {selectedInscripcion.estudiante?.user?.name}
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Tipo de Evaluación *
                  </label>
                  <select
                    value={formData.tipo_evaluacion}
                    onChange={(e) =>
                      setFormData({ ...formData, tipo_evaluacion: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Seleccionar tipo</option>
                    {tiposEvaluacion.map((tipo) => (
                      <option key={tipo} value={tipo}>
                        {tipo}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Nota (0-20) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="20"
                    value={formData.nota}
                    onChange={(e) =>
                      setFormData({ ...formData, nota: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Porcentaje (%) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={formData.porcentaje}
                    onChange={(e) =>
                      setFormData({ ...formData, porcentaje: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Fecha de Evaluación *
                  </label>
                  <input
                    type="date"
                    value={formData.fecha_evaluacion}
                    onChange={(e) =>
                      setFormData({ ...formData, fecha_evaluacion: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Observaciones
                  </label>
                  <textarea
                    value={formData.observaciones}
                    onChange={(e) =>
                      setFormData({ ...formData, observaciones: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Guardar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocenteCalificaciones;
