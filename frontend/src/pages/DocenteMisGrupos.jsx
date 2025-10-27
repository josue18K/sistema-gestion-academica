import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';

const DocenteMisGrupos = () => {
  const [grupos, setGrupos] = useState([]);
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
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Mis Grupos</h2>

          {grupos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {grupos.map((grupo) => (
                <div
                  key={grupo.id}
                  className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition cursor-pointer"
                  onClick={() => navigate(`/docente/grupo/${grupo.id}`)}
                >
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {grupo.materia.nombre}
                  </h3>
                  <p className="text-sm text-gray-600">Grupo: {grupo.nombre_grupo}</p>
                  <p className="text-sm text-gray-600">Periodo: {grupo.periodo}</p>
                  <p className="text-sm text-gray-600">Aula: {grupo.aula}</p>
                  <p className="text-sm text-gray-600">Horario: {grupo.horario}</p>
                  <div className="mt-4 pt-4 border-t">
                    <span className="text-sm text-gray-500">
                      Estudiantes: {grupo.inscripciones?.length || 0} / {grupo.cupo_maximo}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-600">No tienes grupos asignados actualmente.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocenteMisGrupos;
