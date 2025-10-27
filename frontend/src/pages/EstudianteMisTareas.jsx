import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const EstudianteMisTareas = () => {
  const [entregas, setEntregas] = useState([]);
  const [tareasDisponibles, setTareasDisponibles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedTarea, setSelectedTarea] = useState(null);
  const [formData, setFormData] = useState({
    archivo_url: '',
    comentarios: '',
  });
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTareas();
  }, []);

  const fetchTareas = async () => {
    try {
      const meResponse = await api.get('/me');
      const estudianteId = meResponse.data.estudiante?.id;

      if (estudianteId) {
        // Obtener entregas del estudiante
        const entregasResponse = await api.get(`/entregas-tareas/estudiante/${estudianteId}`);
        setEntregas(entregasResponse.data);

        // Obtener inscripciones para ver tareas disponibles
        const inscripcionesResponse = await api.get(`/inscripciones/estudiante/${estudianteId}`);

        // Obtener todas las tareas de los grupos inscritos
        const tareasPromises = inscripcionesResponse.data.map(ins =>
          api.get(`/tareas/grupo/${ins.grupo_id}`)
        );
        const tareasResponses = await Promise.all(tareasPromises);
        const todasTareas = tareasResponses.flatMap(res => res.data);

        // Filtrar tareas no entregadas
        const tareasNoEntregadas = todasTareas.filter(tarea =>
          !entregasResponse.data.some(entrega => entrega.tarea_id === tarea.id)
        );

        setTareasDisponibles(tareasNoEntregadas);
      }
    } catch (error) {
      console.error('Error al cargar tareas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitTarea = async (e) => {
    e.preventDefault();
    try {
      const meResponse = await api.get('/me');
      const estudianteId = meResponse.data.estudiante?.id;

      await api.post('/entregas-tareas', {
        tarea_id: selectedTarea.id,
        estudiante_id: estudianteId,
        fecha_entrega: new Date().toISOString(),
        archivo_url: formData.archivo_url,
        comentarios: formData.comentarios,
      });

      fetchTareas();
      handleCloseModal();
      alert('Tarea entregada exitosamente');
    } catch (error) {
      console.error('Error al entregar tarea:', error);
      alert('Error al entregar la tarea');
    }
  };

  const handleOpenModal = (tarea) => {
    setSelectedTarea(tarea);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTarea(null);
    setFormData({
      archivo_url: '',
      comentarios: '',
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
                  className="text-blue-600 font-semibold px-3 py-2"
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
          {/* Tareas Pendientes */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Tareas Pendientes ({tareasDisponibles.length})
            </h2>
            {tareasDisponibles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tareasDisponibles.map((tarea) => (
                  <div
                    key={tarea.id}
                    className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500"
                  >
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {tarea.titulo}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">{tarea.descripcion}</p>
                    <div className="space-y-1 text-sm text-gray-600 mb-4">
                      <p>
                        <strong>Curso:</strong> {tarea.grupo.materia.nombre}
                      </p>
                      <p>
                        <strong>Fecha de entrega:</strong>{' '}
                        {new Date(tarea.fecha_entrega).toLocaleDateString()}
                      </p>
                      <p>
                        <strong>Puntaje:</strong> {tarea.puntaje_maximo} puntos
                      </p>
                    </div>
                    <button
                      onClick={() => handleOpenModal(tarea)}
                      className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                    >
                      Entregar Tarea
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <p className="text-gray-600">No tienes tareas pendientes.</p>
              </div>
            )}
          </div>

          {/* Tareas Entregadas */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Tareas Entregadas ({entregas.length})
            </h2>
            {entregas.length > 0 ? (
              <div className="space-y-4">
                {entregas.map((entrega) => (
                  <div
                    key={entrega.id}
                    className={`bg-white rounded-lg shadow p-6 border-l-4 ${
                      entrega.calificacion !== null
                        ? 'border-green-500'
                        : 'border-blue-500'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {entrega.tarea.titulo}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {entrega.tarea.grupo.materia.nombre}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                          Entregado: {new Date(entrega.fecha_entrega).toLocaleDateString()}
                        </p>
                        {entrega.comentarios && (
                          <p className="text-sm text-gray-600 mt-2">
                            <strong>Comentarios:</strong> {entrega.comentarios}
                          </p>
                        )}
                        {entrega.retroalimentacion && (
                          <div className="mt-3 p-3 bg-blue-50 rounded">
                            <p className="text-sm text-blue-800">
                              <strong>Retroalimentación del docente:</strong>
                            </p>
                            <p className="text-sm text-blue-700 mt-1">
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
                              / {entrega.tarea.puntaje_maximo}
                            </p>
                          </div>
                        ) : (
                          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                            Por calificar
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <p className="text-gray-600">No has entregado ninguna tarea aún.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Entregar Tarea */}
      {showModal && selectedTarea && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Entregar Tarea: {selectedTarea.titulo}
              </h3>
              <form onSubmit={handleSubmitTarea}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    URL del Archivo / Enlace *
                  </label>
                  <input
                    type="url"
                    value={formData.archivo_url}
                    onChange={(e) =>
                      setFormData({ ...formData, archivo_url: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://drive.google.com/..."
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Sube tu archivo a Google Drive o similar y pega el enlace aquí
                  </p>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Comentarios
                  </label>
                  <textarea
                    value={formData.comentarios}
                    onChange={(e) =>
                      setFormData({ ...formData, comentarios: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    placeholder="Comentarios opcionales sobre tu entrega..."
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
                    Entregar
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

export default EstudianteMisTareas;
