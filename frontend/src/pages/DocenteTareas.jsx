import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { tareaService } from '../services/tareaService';
import { grupoService } from '../services/grupoService';
import { entregaTareaService } from '../services/entregaTareaService';
import api from '../services/api';
import Navbar from '../components/Navbar';

const DocenteTareas = () => {
  const [tareas, setTareas] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showEntregasModal, setShowEntregasModal] = useState(false);
  const [selectedTarea, setSelectedTarea] = useState(null);
  const [entregas, setEntregas] = useState([]);
  const [formData, setFormData] = useState({
    grupo_id: '',
    titulo: '',
    descripcion: '',
    fecha_entrega: '',
    puntaje_maximo: 100,
  });
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
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const meResponse = await api.get('/me');
      const docenteId = meResponse.data.docente?.id;

      if (docenteId) {
        const gruposResponse = await api.get('/grupos');
        const misGrupos = gruposResponse.data.filter(g => g.docente_id === docenteId);
        setGrupos(misGrupos);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await tareaService.create(formData);
      fetchData();
      handleCloseModal();
    } catch (error) {
      console.error('Error al guardar tarea:', error);
      alert('Error al guardar la tarea');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta tarea?')) {
      try {
        await tareaService.delete(id);
        fetchData();
      } catch (error) {
        console.error('Error al eliminar tarea:', error);
        alert('Error al eliminar la tarea');
      }
    }
  };

  const handleVerEntregas = async (tarea) => {
    try {
      const data = await entregaTareaService.getByTarea(tarea.id);
      setEntregas(data);
      setSelectedTarea(tarea);
      setShowEntregasModal(true);
    } catch (error) {
      console.error('Error al cargar entregas:', error);
    }
  };

  const handleCalificar = async (entregaId, calificacion, retroalimentacion) => {
    try {
      await entregaTareaService.calificar(entregaId, {
        calificacion,
        retroalimentacion,
      });
      handleVerEntregas(selectedTarea);
    } catch (error) {
      console.error('Error al calificar:', error);
      alert('Error al calificar la entrega');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      grupo_id: '',
      titulo: '',
      descripcion: '',
      fecha_entrega: '',
      puntaje_maximo: 100,
    });
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
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Gestión de Tareas</h2>
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              + Nueva Tarea
            </button>
          </div>

          {/* Tareas Table */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Título
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Grupo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Fecha Entrega
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Puntaje
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Entregas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tareas.map((tarea) => (
                  <tr key={tarea.id}>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{tarea.titulo}</div>
                      <div className="text-sm text-gray-500">{tarea.descripcion}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {tarea.grupo?.materia?.nombre}
                      </div>
                      <div className="text-sm text-gray-500">
                        {tarea.grupo?.nombre_grupo}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(tarea.fecha_entrega).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-gray-900">
                        {tarea.puntaje_maximo} pts
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleVerEntregas(tarea)}
                        className="text-blue-600 hover:text-blue-900 text-sm"
                      >
                        Ver entregas
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleDelete(tarea.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Nueva Tarea */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Nueva Tarea</h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Grupo *
                  </label>
                  <select
                    value={formData.grupo_id}
                    onChange={(e) =>
                      setFormData({ ...formData, grupo_id: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Seleccionar grupo</option>
                    {grupos.map((grupo) => (
                      <option key={grupo.id} value={grupo.id}>
                        {grupo.materia?.nombre} - {grupo.nombre_grupo}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Título *
                  </label>
                  <input
                    type="text"
                    value={formData.titulo}
                    onChange={(e) =>
                      setFormData({ ...formData, titulo: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Descripción *
                  </label>
                  <textarea
                    value={formData.descripcion}
                    onChange={(e) =>
                      setFormData({ ...formData, descripcion: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Fecha de Entrega *
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.fecha_entrega}
                    onChange={(e) =>
                      setFormData({ ...formData, fecha_entrega: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Puntaje Máximo *
                  </label>
                  <input
                    type="number"
                    value={formData.puntaje_maximo}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        puntaje_maximo: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1"
                    required
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

      {/* Modal Entregas */}
      {showEntregasModal && selectedTarea && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Entregas: {selectedTarea.titulo}
              </h3>
              <div className="max-h-96 overflow-y-auto">
                {entregas.length > 0 ? (
                  <div className="space-y-4">
                    {entregas.map((entrega) => (
                      <div key={entrega.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold text-gray-800">
                              {entrega.estudiante?.user?.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              Entregado: {new Date(entrega.fecha_entrega).toLocaleString()}
                            </p>
                            <a
                              href={entrega.archivo_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline text-sm"
                            >
                              Ver archivo
                            </a>
                            {entrega.comentarios && (
                              <p className="text-sm text-gray-600 mt-2">
                                <strong>Comentarios:</strong> {entrega.comentarios}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            {entrega.calificacion !== null ? (
                              <div>
                                <span className="text-2xl font-bold text-green-600">
                                  {entrega.calificacion}
                                </span>
                                <p className="text-xs text-gray-500">
                                  / {selectedTarea.puntaje_maximo}
                                </p>
                              </div>
                            ) : (
                              <div className="flex flex-col space-y-2">
                                <input
                                  type="number"
                                  placeholder="Nota"
                                  min="0"
                                  max={selectedTarea.puntaje_maximo}
                                  className="w-20 px-2 py-1 border rounded"
                                  id={`nota-${entrega.id}`}
                                />
                                <textarea
                                  placeholder="Retroalimentación"
                                  className="w-full px-2 py-1 border rounded text-sm"
                                  rows="2"
                                  id={`retro-${entrega.id}`}
                                />
                                <button
                                  onClick={() => {
                                    const nota = document.getElementById(`nota-${entrega.id}`).value;
                                    const retro = document.getElementById(`retro-${entrega.id}`).value;
                                    if (nota) {
                                      handleCalificar(entrega.id, parseFloat(nota), retro);
                                    }
                                  }}
                                  className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                                >
                                  Calificar
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 text-center py-4">
                    No hay entregas aún
                  </p>
                )}
              </div>
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setShowEntregasModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocenteTareas;
