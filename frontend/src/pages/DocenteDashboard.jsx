import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import { FiUsers, FiBookOpen, FiClipboard, FiClock, FiCalendar, FiAward, FiTrendingUp } from 'react-icons/fi';

const DocenteDashboard = () => {
  const [grupos, setGrupos] = useState([]);
  const [tareas, setTareas] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDocenteData();
  }, []);

  const menuItems = [
    { label: 'Dashboard', path: '/docente/dashboard' },
    { label: 'Mis Grupos', path: '/docente/mis-grupos' },
    { label: 'Tareas', path: '/docente/tareas' },
    { label: 'Asistencias', path: '/docente/asistencias' },
    { label: 'Calificaciones', path: '/docente/calificaciones' },
  ];

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600 font-semibold">Cargando datos...</p>
        </div>
      </div>
    );
  }

  const totalEstudiantes = grupos.reduce((sum, g) => sum + (g.inscripciones?.length || 0), 0);
  const tareasPendientes = tareas.filter(t => new Date(t.fecha_entrega) > new Date()).length;

  const statCards = [
    {
      title: 'Grupos Asignados',
      value: grupos.length,
      icon: FiBookOpen,
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50',
    },
    {
      title: 'Total Estudiantes',
      value: totalEstudiantes,
      icon: FiUsers,
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-50 to-emerald-50',
    },
    {
      title: 'Tareas Asignadas',
      value: tareas.length,
      icon: FiClipboard,
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-50 to-pink-50',
    },
    {
      title: 'Pendientes',
      value: tareasPendientes,
      icon: FiClock,
      gradient: 'from-orange-500 to-red-500',
      bgGradient: 'from-orange-50 to-red-50',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-blue-50">
      <Navbar title="Portal Docente" menuItems={menuItems} />

      {/* Content */}
      <div className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl shadow-xl p-8 mb-8 text-white animate-fade-in">
            <div className="flex items-center space-x-4">
              <div className="bg-white bg-opacity-20 p-4 rounded-xl backdrop-blur-sm">
                <FiAward className="text-4xl" />
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-2">Portal Docente</h2>
                <p className="text-green-100 text-lg">
                  Bienvenido {user?.name} - Gestiona tus grupos y actividades académicas
                </p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

          {/* Mis Grupos */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <FiBookOpen className="mr-3 text-green-600" />
              Mis Grupos
            </h2>
            {grupos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {grupos.map((grupo) => (
                  <div
                    key={grupo.id}
                    className="group border-2 border-gray-200 rounded-xl p-5 hover:border-green-400 hover:shadow-lg transition-all duration-200 cursor-pointer bg-gradient-to-br from-white to-gray-50"
                    onClick={() => navigate(`/docente/grupo/${grupo.id}`)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="p-2 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg">
                        <FiBookOpen className="text-white text-xl" />
                      </div>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                        {grupo.periodo}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg text-gray-800 mb-2 group-hover:text-green-600 transition-colors">
                      {grupo.materia.nombre}
                    </h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p className="flex items-center">
                        <FiUsers className="mr-2 text-green-500" />
                        Grupo: {grupo.nombre_grupo}
                      </p>
                      <p className="flex items-center">
                        <FiCalendar className="mr-2 text-blue-500" />
                        {grupo.horario}
                      </p>
                      <p className="text-gray-500">Aula: {grupo.aula}</p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-700">
                        <FiUsers className="inline mr-1" />
                        {grupo.inscripciones?.length || 0} estudiantes
                      </span>
                      <span className="text-green-600 group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <FiBookOpen className="text-6xl mx-auto mb-4 text-gray-300" />
                <p>No tienes grupos asignados actualmente.</p>
              </div>
            )}
          </div>

          {/* Tareas Recientes */}
          <div className="bg-white rounded-2xl shadow-xl p-6 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <FiClipboard className="mr-3 text-purple-600" />
              Tareas Recientes
            </h2>
            {tareas.length > 0 ? (
              <div className="space-y-4">
                {tareas.slice(0, 5).map((tarea) => (
                  <div
                    key={tarea.id}
                    className="group border-l-4 border-green-500 bg-gradient-to-r from-gray-50 to-white p-5 rounded-r-xl hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <FiClipboard className="text-green-600" />
                          <h3 className="font-bold text-gray-800 group-hover:text-green-600 transition-colors">
                            {tarea.titulo}
                          </h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {tarea.grupo.materia.nombre} - Grupo {tarea.grupo.nombre_grupo}
                        </p>
                        <p className="text-sm text-gray-500 flex items-center">
                          <FiCalendar className="mr-1" />
                          Entrega: {new Date(tarea.fecha_entrega).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="px-4 py-2 bg-gradient-to-br from-green-500 to-blue-500 text-white rounded-lg shadow">
                          <span className="text-2xl font-bold">{tarea.puntaje_maximo}</span>
                          <p className="text-xs">puntos</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <FiClipboard className="text-6xl mx-auto mb-4 text-gray-300" />
                <p>No tienes tareas asignadas.</p>
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

export default DocenteDashboard;
