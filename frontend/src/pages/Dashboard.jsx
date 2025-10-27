import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { estudianteService } from '../services/estudianteService';
import { docenteService } from '../services/docenteService';
import { carreraService } from '../services/carreraService';
import { grupoService } from '../services/grupoService';
import Navbar from '../components/Navbar';
import { FiUsers, FiUserCheck, FiBookOpen, FiGrid, FiTrendingUp, FiAward } from 'react-icons/fi';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    estudiantes: 0,
    docentes: 0,
    carreras: 0,
    grupos: 0,
  });
  const [loading, setLoading] = useState(true);

  const menuItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Carreras', path: '/carreras' },
    { label: 'Semestres', path: '/semestres' },
    { label: 'Materias', path: '/materias' },
    { label: 'Grupos', path: '/grupos' },
    { label: 'Estudiantes', path: '/estudiantes' },
    { label: 'Docentes', path: '/docentes' },
    { label: 'Inscripciones', path: '/inscripciones' },
  ];

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [estudiantes, docentes, carreras, grupos] = await Promise.all([
        estudianteService.getAll(),
        docenteService.getAll(),
        carreraService.getAll(),
        grupoService.getAll(),
      ]);

      setStats({
        estudiantes: estudiantes.length,
        docentes: docentes.length,
        carreras: carreras.length,
        grupos: grupos.length,
      });
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600 font-semibold">Cargando datos...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Estudiantes',
      value: stats.estudiantes,
      icon: FiUsers,
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50',
      path: '/estudiantes',
    },
    {
      title: 'Docentes',
      value: stats.docentes,
      icon: FiUserCheck,
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-50 to-emerald-50',
      path: '/docentes',
    },
    {
      title: 'Carreras',
      value: stats.carreras,
      icon: FiBookOpen,
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-50 to-pink-50',
      path: '/carreras',
    },
    {
      title: 'Grupos',
      value: stats.grupos,
      icon: FiGrid,
      gradient: 'from-orange-500 to-red-500',
      bgGradient: 'from-orange-50 to-red-50',
      path: '/grupos',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <Navbar title="Sistema Académico" menuItems={menuItems} />

      {/* Content */}
      <div className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-8 mb-8 text-white animate-fade-in">
            <div className="flex items-center space-x-4">
              <div className="bg-white bg-opacity-20 p-4 rounded-xl backdrop-blur-sm">
                <FiAward className="text-4xl" />
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-2">Dashboard Administrativo</h2>
                <p className="text-blue-100 text-lg">
                  Bienvenido al sistema de gestión académica integral
                </p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((card, index) => (
              <div
                key={index}
                onClick={() => navigate(card.path)}
                className="group relative bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105 animate-fade-in-up overflow-hidden"
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
                  <div className="mt-4 flex items-center text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
                    <span>Ver detalles</span>
                    <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Access Section */}
          <div className="bg-white rounded-2xl shadow-xl p-6 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <FiGrid className="mr-2 text-blue-600" />
              Acceso Rápido
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Materias', path: '/materias', icon: FiBookOpen, color: 'blue' },
                { label: 'Semestres', path: '/semestres', icon: FiGrid, color: 'purple' },
                { label: 'Inscripciones', path: '/inscripciones', icon: FiUsers, color: 'green' },
                { label: 'Grupos', path: '/grupos', icon: FiGrid, color: 'orange' },
              ].map((item, index) => (
                <button
                  key={index}
                  onClick={() => navigate(item.path)}
                  className={`p-4 rounded-xl border-2 border-${item.color}-200 hover:border-${item.color}-400 hover:bg-${item.color}-50 transition-all duration-200 group`}
                >
                  <item.icon className={`text-2xl text-${item.color}-600 mb-2 mx-auto`} />
                  <p className="text-sm font-semibold text-gray-700">{item.label}</p>
                </button>
              ))}
            </div>
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

export default Dashboard;
