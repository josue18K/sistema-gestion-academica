import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const EstudianteMisNotas = () => {
  const [inscripciones, setInscripciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotas();
  }, []);

  const fetchNotas = async () => {
    try {
      const meResponse = await api.get('/me');
      const estudianteId = meResponse.data.estudiante?.id;

      if (estudianteId) {
        const inscripcionesResponse = await api.get(`/inscripciones/estudiante/${estudianteId}`);

        // Obtener notas para cada inscripción
        const inscripcionesConNotas = await Promise.all(
          inscripcionesResponse.data.map(async (inscripcion) => {
            try {
              const notasResponse = await api.get(`/notas/inscripcion/${inscripcion.id}`);
              const promedioResponse = await api.get(`/notas/promedio/${inscripcion.id}`);

              return {
                ...inscripcion,
                notas: notasResponse.data,
                promedio: promedioResponse.data.promedio,
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
      }
    } catch (error) {
      console.error('Error al cargar notas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
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
      {/* Navbar */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-bold text-gray-800">Portal Estudiante</h1>
              <div className="flex space-x-4">
                <button
                  onClick={() => navigate('/estudiante/dashboard')}
                  className="text-gray-600 hover:text-gray-900 px-3 py-2"
                >
                  Inicio
                </button>
                <button
                  onClick={() => navigate('/estudiante/mis-cursos')}
                  className="text-gray-600 hover:text-gray-900 px-3 py-2"
                >
                  Mis Cursos
                </button>
                <button
                  onClick={() => navigate('/estudiante/mis-tareas')}
                  className="text-gray-600 hover:text-gray-900 px-3 py-2"
                >
                  Mis Tareas
                </button>
                <button
                  onClick={() => navigate('/estudiante/mis-notas')}
                  className="text-blue-600 font-semibold px-3 py-2"
                >
                  Mis Notas
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                <strong>{user?.name}</strong>
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Mis Calificaciones</h2>

          {inscripciones.length > 0 ? (
            <div className="space-y-6">
              {inscripciones.map((inscripcion) => (
                <div key={inscripcion.id} className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">
                        {inscripcion.grupo.materia.nombre}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Grupo {inscripcion.grupo.nombre_grupo} - {inscripcion.grupo.docente.user.name}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Promedio Final</p>
                      <p className={`text-3xl font-bold ${
                        inscripcion.promedio >= 14 ? 'text-green-600' :
                        inscripcion.promedio >= 11 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {inscripcion.promedio.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {inscripcion.notas && inscripcion.notas.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Tipo
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Nota
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Porcentaje
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Fecha
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Observaciones
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {inscripcion.notas.map((nota) => (
                            <tr key={nota.id}>
                              <td className="px-4 py-3 whitespace-nowrap text-sm">
                                {nota.tipo_evaluacion}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <span className={`text-sm font-semibold ${
                                  nota.nota >= 14 ? 'text-green-600' :
                                  nota.nota >= 11 ? 'text-yellow-600' : 'text-red-600'
                                }`}>
                                  {nota.nota}
                                </span>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                                {nota.porcentaje}%
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                                {new Date(nota.fecha_evaluacion).toLocaleDateString()}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-600">
                                {nota.observaciones || '-'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-gray-600 text-center py-4">
                      No hay calificaciones registradas aún.
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-600">No tienes cursos inscritos.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EstudianteMisNotas;
