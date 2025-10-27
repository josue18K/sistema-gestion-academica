import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import { FiBook, FiCheckCircle, FiClock, FiAward, FiTrendingUp, FiCalendar, FiUser } from 'react-icons/fi';

const EstudianteDashboard = () => {
  const [inscripciones, setInscripciones] = useState([]);
  const [tareas, setTareas] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchEstudianteData();
  }, []);

  const menuItems = [
    { label: 'Dashboard', path: '/estudiante/dashboard' },
    { label: 'Mis Cursos', path: '/estudiante/mis-cursos' },
    { label: 'Mis Tareas', path: '/estudiante/mis-tareas' },
    { label: 'Mis Notas', path: '/estudiante/mis-notas' },
  ];

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600 font-semibold">Cargando datos...</p>
        </div>
      </div>
    );
  }

  const tareasCompletadas = tareas.filter(t => t.calificacion !== null).length;
  const tareasPendientes = tareas.filter(t => t.calificacion === null).length;

  const statCards = [
    {
      title: 'Cursos Inscritos',
      value: inscripciones.length,
      icon: FiBook,
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50',
    },
    {
      title: 'Tareas Completadas',
      value: tareasCompletadas,
      icon: FiCheckCircle,
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-50 to-emerald-50',
    },
    {
      title: 'Tareas Pendientes',
      value: tareasPendientes,
      icon: FiClock,
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-50 to-pink-50',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50">
      <Navbar title="Portal Estudiante" menuItems={menuItems} />

      {/* Content */}
      <div className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl shadow-xl p-8 mb-8 text-white animate-fade-in">
            <div className="flex items-center space-x-4">
              <div className="bg-white bg-opacity-20 p-4 rounded-xl backdrop-blur-sm">
                <FiAward className="text-4xl" />
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-2">Portal Estudiante</h2>
                <p className="text-purple-100 text-lg">
                  Bienvenido {user?.name} - Consulta tu progreso académico
                </p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {statCards.map((card, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 animate-fade-in-up overflow-hidden"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${card.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                <div className="relative p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${card.gradient} shadow-lg`}>
                      <card.icon className="text-2xl text-white" />
                    </div>
                    <FiTrendingUp className="text-gray-400 group-hover:text-gray-600 transition-colors" />
                  </div>
                  <h3 className="text-gray-600 text-sm font-semibold uppercase tracking-wide mb-1">
                    {card.title}
                  </h3>
                  <p className={`text-4xl font-bold bg-gradient-to-br ${card.gradient} bg-clip-text text-transparent`}>
                    {card.value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Mis Cursos */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <FiBook className="mr-3 text-purple-600" />
              Mis Cursos
            </h2>
            {inscripciones.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {inscripciones.map((inscripcion) => (
                  <div
                    key={inscripcion.id}
                    className="group border-2 border-gray-200 rounded-xl p-5 hover:border-purple-400 hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-white to-gray-50"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg">
                        <FiBook className="text-white text-xl" />
                      </div>
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        inscripcion.estado === 'activo'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {inscripcion.estado}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg text-gray-800 mb-3 group-hover:text-purple-600 transition-colors">
                      {inscripcion.grupo.materia.nombre}
                    </h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p className="flex items-center">
                        <FiBook className="mr-2 text-purple-500" />
                        Grupo: {inscripcion.grupo.nombre_grupo}
                      </p>
                      <p className="flex items-center">
                        <FiUser className="mr-2 text-blue-500" />
                        {inscripcion.grupo.docente.user.name}
                      </p>
                      <p className="flex items-center">
                        <FiCalendar className="mr-2 text-green-500" />
                        {inscripcion.grupo.horario}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <FiBook className="text-6xl mx-auto mb-4 text-gray-300" />
                <p>No tienes cursos inscritos actualmente.</p>
              </div>
            )}
          </div>

          {/* Tareas Recientes */}
          <div className="bg-white rounded-2xl shadow-xl p-6 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <FiCheckCircle className="mr-3 text-green-600" />
              Tareas Recientes
            </h2>
            {tareas.length > 0 ? (
              <div className="space-y-4">
                {tareas.slice(0, 5).map((tarea) => (
                  <div
                    key={tarea.id}
                    className={`group border-l-4 ${
                      tarea.calificacion !== null ? 'border-green-500' : 'border-yellow-500'
                    } bg-gradient-to-r from-gray-50 to-white p-5 rounded-r-xl hover:shadow-md transition-all duration-200`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          {tarea.calificacion !== null ? (
                            <FiCheckCircle className="text-green-600" />
                          ) : (
                            <FiClock className="text-yellow-600" />
                          )}
                          <h3 className="font-bold text-gray-800">
                            {tarea.tarea.titulo}
                          </h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {tarea.tarea.grupo.materia.nombre}
                        </p>
                        <p className="text-sm text-gray-500 flex items-center">
                          <FiCalendar className="mr-1" />
                          Entregado: {new Date(tarea.fecha_entrega).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        {tarea.calificacion !== null ? (
                          <div className="px-4 py-2 bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-lg shadow">
                            <span className="text-2xl font-bold">{tarea.calificacion}</span>
                            <p className="text-xs">/ {tarea.tarea.puntaje_maximo}</p>
                          </div>
                        ) : (
                          <span className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg font-semibold text-sm">
                            Pendiente
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <FiCheckCircle className="text-6xl mx-auto mb-4 text-gray-300" />
                <p>No tienes tareas registradas.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out both;
        }
      `}</style>
    </div>
  );
};

export default EstudianteDashboard;
