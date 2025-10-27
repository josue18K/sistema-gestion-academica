import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const EstudianteDashboard = () => {
  const [inscripciones, setInscripciones] = useState([]);
  const [tareas, setTareas] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchEstudianteData();
  }, []);

  const fetchEstudianteData = async () => {
    try {
      // Obtener información del estudiante actual
      const meResponse = await api.get('/me');
      const estudianteId = meResponse.data.estudiante?.id;

      if (estudianteId) {
        // Obtener inscripciones
        const inscripcionesResponse = await api.get(`/inscripciones/estudiante/${estudianteId}`);
        setInscripciones(inscripcionesResponse.data);

        // Obtener tareas pendientes
        const tareasResponse = await api.get(`/entregas-tareas/estudiante/${estudianteId}`);
        setTareas(tareasResponse.data);
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
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
                  className="text-blue-600 font-semibold px-3 py-2"
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
                  className="text-gray-600 hover:text-gray-900 px-3 py-2"
                >
                  Mis Notas
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                <strong>{user?.name}</strong>
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                Estudiante
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
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-500 text-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold">Cursos Inscritos</h3>
              <p className="text-3xl font-bold mt-2">{inscripciones.length}</p>
            </div>
            <div className="bg-green-500 text-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold">Tareas Completadas</h3>
              <p className="text-3xl font-bold mt-2">
                {tareas.filter(t => t.calificacion !== null).length}
              </p>
            </div>
            <div className="bg-purple-500 text-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold">Tareas Pendientes</h3>
              <p className="text-3xl font-bold mt-2">
                {tareas.filter(t => t.calificacion === null).length}
              </p>
            </div>
          </div>

          {/* Mis Cursos */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Mis Cursos</h2>
            {inscripciones.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {inscripciones.map((inscripcion) => (
                  <div
                    key={inscripcion.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                  >
                    <h3 className="font-semibold text-lg text-gray-800">
                      {inscripcion.grupo.materia.nombre}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Grupo: {inscripcion.grupo.nombre_grupo}
                    </p>
                    <p className="text-sm text-gray-600">
                      Docente: {inscripcion.grupo.docente.user.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      Horario: {inscripcion.grupo.horario}
                    </p>
                    <span
                      className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${
                        inscripcion.estado === 'activo'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {inscripcion.estado}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No tienes cursos inscritos actualmente.</p>
            )}
          </div>

          {/* Tareas Recientes */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Tareas Recientes</h2>
            {tareas.length > 0 ? (
              <div className="space-y-4">
                {tareas.slice(0, 5).map((tarea) => (
                  <div
                    key={tarea.id}
                    className="border-l-4 border-blue-500 bg-gray-50 p-4 rounded"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {tarea.tarea.titulo}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {tarea.tarea.grupo.materia.nombre}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Entregado: {new Date(tarea.fecha_entrega).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        {tarea.calificacion !== null ? (
                          <div>
                            <span className="text-2xl font-bold text-green-600">
                              {tarea.calificacion}
                            </span>
                            <p className="text-xs text-gray-500">
                              / {tarea.tarea.puntaje_maximo}
                            </p>
                          </div>
                        ) : (
                          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                            Pendiente
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No tienes tareas registradas.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EstudianteDashboard;
