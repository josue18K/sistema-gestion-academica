import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const DocenteDashboard = () => {
  const [grupos, setGrupos] = useState([]);
  const [tareas, setTareas] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDocenteData();
  }, []);

  const fetchDocenteData = async () => {
    try {
      // Obtener información del docente actual
      const meResponse = await api.get('/me');
      const docenteId = meResponse.data.docente?.id;

      if (docenteId) {
        // Obtener grupos del docente
        const gruposResponse = await api.get('/grupos');
        const misGrupos = gruposResponse.data.filter(g => g.docente_id === docenteId);
        setGrupos(misGrupos);

        // Obtener todas las tareas de los grupos del docente
        const tareasPromises = misGrupos.map(grupo =>
          api.get(`/tareas/grupo/${grupo.id}`)
        );
        const tareasResponses = await Promise.all(tareasPromises);
        const todasTareas = tareasResponses.flatMap(res => res.data);
        setTareas(todasTareas);
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
              <h1 className="text-xl font-bold text-gray-800">Portal Docente</h1>
              <div className="flex space-x-4">
                <button
                  onClick={() => navigate('/docente/dashboard')}
                  className="text-blue-600 font-semibold px-3 py-2"
                >
                  Inicio
                </button>
                <button
                  onClick={() => navigate('/docente/mis-grupos')}
                  className="text-gray-600 hover:text-gray-900 px-3 py-2"
                >
                  Mis Grupos
                </button>
                <button
                  onClick={() => navigate('/docente/tareas')}
                  className="text-gray-600 hover:text-gray-900 px-3 py-2"
                >
                  Tareas
                </button>
                <button
                  onClick={() => navigate('/docente/asistencias')}
                  className="text-gray-600 hover:text-gray-900 px-3 py-2"
                >
                  Asistencias
                </button>
                <button
                  onClick={() => navigate('/docente/calificaciones')}
                  className="text-gray-600 hover:text-gray-900 px-3 py-2"
                >
                  Calificaciones
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                <strong>{user?.name}</strong>
              </span>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                Docente
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-blue-500 text-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold">Grupos Asignados</h3>
              <p className="text-3xl font-bold mt-2">{grupos.length}</p>
            </div>
            <div className="bg-green-500 text-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold">Total Estudiantes</h3>
              <p className="text-3xl font-bold mt-2">
                {grupos.reduce((sum, g) => sum + (g.inscripciones?.length || 0), 0)}
              </p>
            </div>
            <div className="bg-purple-500 text-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold">Tareas Asignadas</h3>
              <p className="text-3xl font-bold mt-2">{tareas.length}</p>
            </div>
            <div className="bg-orange-500 text-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold">Pendientes</h3>
              <p className="text-3xl font-bold mt-2">
                {tareas.filter(t => new Date(t.fecha_entrega) > new Date()).length}
              </p>
            </div>
          </div>

          {/* Mis Grupos */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Mis Grupos</h2>
            {grupos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {grupos.map((grupo) => (
                  <div
                    key={grupo.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition cursor-pointer"
                    onClick={() => navigate(`/docente/grupo/${grupo.id}`)}
                  >
                    <h3 className="font-semibold text-lg text-gray-800">
                      {grupo.materia.nombre}
                    </h3>
                    <p className="text-sm text-gray-600">Grupo: {grupo.nombre_grupo}</p>
                    <p className="text-sm text-gray-600">Aula: {grupo.aula}</p>
                    <p className="text-sm text-gray-600">Horario: {grupo.horario}</p>
                    <div className="mt-3 flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        Estudiantes: {grupo.inscripciones?.length || 0}
                      </span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        {grupo.periodo}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No tienes grupos asignados actualmente.</p>
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
                    className="border-l-4 border-green-500 bg-gray-50 p-4 rounded"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-800">{tarea.titulo}</h3>
                        <p className="text-sm text-gray-600">
                          {tarea.grupo.materia.nombre} - Grupo {tarea.grupo.nombre_grupo}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Fecha de entrega: {new Date(tarea.fecha_entrega).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-semibold text-gray-700">
                          {tarea.puntaje_maximo} pts
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No tienes tareas asignadas.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocenteDashboard;
