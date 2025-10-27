import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const EstudianteMisCursos = () => {
  const [inscripciones, setInscripciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchInscripciones();
  }, []);

  const fetchInscripciones = async () => {
    try {
      const meResponse = await api.get('/me');
      const estudianteId = meResponse.data.estudiante?.id;

      if (estudianteId) {
        const response = await api.get(`/inscripciones/estudiante/${estudianteId}`);
        setInscripciones(response.data);
      }
    } catch (error) {
      console.error('Error al cargar inscripciones:', error);
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
                  className="text-blue-600 font-semibold px-3 py-2"
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
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Mis Cursos</h2>

          {inscripciones.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {inscripciones.map((inscripcion) => (
                <div
                  key={inscripcion.id}
                  className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-800">
                      {inscripcion.grupo.materia.nombre}
                    </h3>
                    <span
                      className={`px-3 py-1 text-xs rounded-full ${
                        inscripcion.estado === 'activo'
                          ? 'bg-green-100 text-green-800'
                          : inscripcion.estado === 'finalizado'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {inscripcion.estado}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <p>
                      <strong>Grupo:</strong> {inscripcion.grupo.nombre_grupo}
                    </p>
                    <p>
                      <strong>Docente:</strong> {inscripcion.grupo.docente.user.name}
                    </p>
                    <p>
                      <strong>Horario:</strong> {inscripcion.grupo.horario}
                    </p>
                    <p>
                      <strong>Aula:</strong> {inscripcion.grupo.aula}
                    </p>
                    <p>
                      <strong>Créditos:</strong> {inscripcion.grupo.materia.creditos}
                    </p>
                    <p>
                      <strong>Inscrito:</strong>{' '}
                      {new Date(inscripcion.fecha_inscripcion).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => navigate(`/estudiante/curso/${inscripcion.id}`)}
                      className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                      Ver Detalles
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-600">No tienes cursos inscritos actualmente.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EstudianteMisCursos;
