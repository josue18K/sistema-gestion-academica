import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { asistenciaService } from '../services/asistenciaService';
import { inscripcionService } from '../services/inscripcionService';
import api from '../services/api';
import Navbar from '../components/Navbar';

const DocenteAsistencias = () => {
  const [grupos, setGrupos] = useState([]);
  const [selectedGrupo, setSelectedGrupo] = useState(null);
  const [inscripciones, setInscripciones] = useState([]);
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [asistencias, setAsistencias] = useState({});
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
      setInscripciones(data);

      // Inicializar asistencias con "presente" por defecto
      const initialAsistencias = {};
      data.forEach(inscripcion => {
        initialAsistencias[inscripcion.id] = 'presente';
      });
      setAsistencias(initialAsistencias);
    } catch (error) {
      console.error('Error al cargar inscripciones:', error);
    }
  };

  const handleRegistrarAsistencia = async () => {
    try {
      const registros = Object.entries(asistencias).map(([inscripcionId, estado]) => ({
        inscripcion_id: parseInt(inscripcionId),
        fecha: fecha,
        estado: estado,
      }));

      await asistenciaService.registrarMasivo({ asistencias: registros });
      alert('Asistencia registrada exitosamente');

      // Resetear
      const initialAsistencias = {};
      inscripciones.forEach(inscripcion => {
        initialAsistencias[inscripcion.id] = 'presente';
      });
      setAsistencias(initialAsistencias);
    } catch (error) {
      console.error('Error al registrar asistencia:', error);
      alert('Error al registrar la asistencia');
    }
  };

  const handleAsistenciaChange = (inscripcionId, estado) => {
    setAsistencias(prev => ({
      ...prev,
      [inscripcionId]: estado,
    }));
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
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Control de Asistencias</h2>

          {/* Selección de Grupo y Fecha */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
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

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Fecha
                </label>
                <input
                  type="date"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Lista de Estudiantes */}
          {selectedGrupo && inscripciones.length > 0 && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800">
                  Lista de Estudiantes ({inscripciones.length})
                </h3>
                <button
                  onClick={handleRegistrarAsistencia}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Guardar Asistencia
                </button>
              </div>

              <div className="overflow-x-auto">
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
                        Estado
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
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleAsistenciaChange(inscripcion.id, 'presente')}
                              className={`px-4 py-2 rounded-lg transition ${
                                asistencias[inscripcion.id] === 'presente'
                                  ? 'bg-green-600 text-white'
                                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                              }`}
                            >
                              Presente
                            </button>
                            <button
                              onClick={() => handleAsistenciaChange(inscripcion.id, 'ausente')}
                              className={`px-4 py-2 rounded-lg transition ${
                                asistencias[inscripcion.id] === 'ausente'
                                  ? 'bg-red-600 text-white'
                                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                              }`}
                            >
                              Ausente
                            </button>
                            <button
                              onClick={() => handleAsistenciaChange(inscripcion.id, 'tardanza')}
                              className={`px-4 py-2 rounded-lg transition ${
                                asistencias[inscripcion.id] === 'tardanza'
                                  ? 'bg-yellow-600 text-white'
                                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                              }`}
                            >
                              Tardanza
                            </button>
                            <button
                              onClick={() => handleAsistenciaChange(inscripcion.id, 'justificado')}
                              className={`px-4 py-2 rounded-lg transition ${
                                asistencias[inscripcion.id] === 'justificado'
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                              }`}
                            >
                              Justificado
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {selectedGrupo && inscripciones.length === 0 && (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-600">No hay estudiantes inscritos en este grupo.</p>
            </div>
          )}

          {!selectedGrupo && (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-600">Seleccione un grupo para tomar asistencia.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocenteAsistencias;
