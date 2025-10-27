import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { estudianteService } from '../services/estudianteService';
import { docenteService } from '../services/docenteService';
import { carreraService } from '../services/carreraService';
import { grupoService } from '../services/grupoService';
import Navbar from '../components/Navbar';

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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar title="Sistema Académico" menuItems={menuItems} />

      {/* Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Dashboard Administrativo
            </h2>
            <p className="text-gray-600 mb-8">
              Bienvenido al sistema de gestión académica.
            </p>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div
                onClick={() => navigate('/estudiantes')}
                className="bg-blue-500 text-white p-6 rounded-lg shadow cursor-pointer hover:bg-blue-600 transition"
              >
                <h3 className="text-lg font-semibold">Estudiantes</h3>
                <p className="text-3xl font-bold mt-2">{stats.estudiantes}</p>
              </div>
              <div
                onClick={() => navigate('/docentes')}
                className="bg-green-500 text-white p-6 rounded-lg shadow cursor-pointer hover:bg-green-600 transition"
              >
                <h3 className="text-lg font-semibold">Docentes</h3>
                <p className="text-3xl font-bold mt-2">{stats.docentes}</p>
              </div>
              <div
                onClick={() => navigate('/carreras')}
                className="bg-purple-500 text-white p-6 rounded-lg shadow cursor-pointer hover:bg-purple-600 transition"
              >
                <h3 className="text-lg font-semibold">Carreras</h3>
                <p className="text-3xl font-bold mt-2">{stats.carreras}</p>
              </div>
              <div
                onClick={() => navigate('/grupos')}
                className="bg-orange-500 text-white p-6 rounded-lg shadow cursor-pointer hover:bg-orange-600 transition"
              >
                <h3 className="text-lg font-semibold">Grupos</h3>
                <p className="text-3xl font-bold mt-2">{stats.grupos}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
