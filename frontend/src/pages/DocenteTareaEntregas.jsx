import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

const DocenteTareaEntregas = () => {
  const [tarea, setTarea] = useState(null);
  const [entregas, setEntregas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedEntrega, setSelectedEntrega] = useState(null);
  const [formData, setFormData] = useState({
    calificacion: '',
    retroalimentacion: '',
  });
  const { tareaId } = useParams();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchEntregas();
  }, [tareaId]);

  const fetchEntregas = async () => {
    try {
      // Obtener información de la tarea
      const tareaResponse = await api.get(`/tareas/${tareaId}`);
      setTarea(tareaResponse.data);

      // Obtener entregas
      const entregasResponse = await api.get(`/entregas-tareas/tarea/${tareaId}`);
      setEntregas(entregasResponse.data);
    } catch (error) {
      console.error('Error al cargar entregas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCalificar = (entrega) => {
    setSelectedEntrega(entrega);
    setFormData({
      calificacion: entrega.calificacion || '',
      retroalimentacion: entrega.retroalimentacion || '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/entregas-tareas/${selectedEntrega.id}/calificar`, formData);
      fetchEntregas();
      handleCloseModal();
      alert('Calificación guardada exitosamente');
    } catch (error) {
      console.error('Error al calificar:', error);
      alert('Error al guardar la calificación');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedEntrega(null);
    setFormData({
      calificacion: '',
      retroalimentacion: '',
    });
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
              <button
                onClick={() => navigate('/docente/tareas')}
                className="text-blue-600 hover:text-blue-800"
              >
                ← Volver a Tareas
              </button>
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
          {tarea && (
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{tarea.titulo}</h2>
              <p className="text-gray-600 mb-4">{tarea.descripcion}</p>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Curso:</span>
                  <p className="font-semibold">{tarea.grupo.materia.nombre}</p>
                </div>
                <div>
                  <span className="text-gray-600">Fecha de entrega:</span>
                  <p className="font-semibold">
                    {new Date(tarea.fecha_entrega).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">Puntaje máximo:</span>
                  <p className="font-semibold">{tarea.puntaje_maximo} puntos</p>
                </div>
              </div>
            </div>
          )}

          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Entregas ({entregas.length})
          </h3>

          {entregas.length > 0 ? (
            <div className="space-y-4">
              {entregas.map((entrega) => (
                <div
                  key={entrega.id}
                  className={`bg-white rounded-lg shadow p-6 border-l-4 ${
                    entrega.calificacion !== null
                      ? 'border-green-500'
                      : 'border-yellow-500'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-800">
                        {entrega.estudiante.user.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Código: {entrega.estudiante.codigo_estudiante}
                      </p>
                      <p className="text-sm text-gray-600 mt-2">
                        Entregado:{' '}
                        {new Date(entrega.fecha_entrega).toLocaleString()}
                      </p>
                      {entrega.archivo_url && (
                        <a
                          href={entrega.archivo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm mt-2 inline-block"
                        >
                          Ver archivo →
                        </a>
                      )}
                      {entrega.comentarios && (
                        <p className="text-sm text-gray-700 mt-2">
                          <strong>Comentarios del estudiante:</strong> {entrega.comentarios}
                        </p>
                      )}
                      {entrega.retroalimentacion && (
                        <div className="mt-3 p-3 bg-green-50 rounded">
                          <p className="text-sm text-green-800">
                            <strong>Tu retroalimentación:</strong>
                          </p>
                          <p className="text-sm text-green-700 mt-1">
                            {entrega.retroalimentacion}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="ml-4 text-right">
                      {entrega.calificacion !== null ? (
                        <div>
                          <span className="text-3xl font-bold text-green-600">
                            {entrega.calificacion}
                          </span>
                          <p className="text-sm text-gray-500">
                            / {tarea.puntaje_maximo}
                          </p>
                          <button
                            onClick={() => handleCalificar(entrega)}
                            className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
                          >
                            Editar
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleCalificar(entrega)}
                          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                        >
                          Calificar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-600">No hay entregas aún.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal Calificar */}
      {showModal && selectedEntrega && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Calificar: {selectedEntrega.estudiante.user.name}
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Calificación (0 - {tarea.puntaje_maximo}) *
                  </label>
                  <input
                    type="number"
                    value={formData.calificacion}
                    onChange={(e) =>
                      setFormData({ ...formData, calificacion: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                    max={tarea.puntaje_maximo}
                    step="0.5"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Retroalimentación
                  </label>
                  <textarea
                    value={formData.retroalimentacion}
                    onChange={(e) =>
                      setFormData({ ...formData, retroalimentacion: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="4"
                    placeholder="Comentarios sobre el trabajo del estudiante..."
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Guardar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocenteTareaEntregas;
