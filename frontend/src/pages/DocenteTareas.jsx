import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { tareaService } from '../services/tareaService';
import api from '../services/api';
import Navbar from '../components/Navbar';

const DocenteTareas = () => {
  const [tareas, setTareas] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTarea, setEditingTarea] = useState(null);
  const [formData, setFormData] = useState({
    grupo_id: '',
    titulo: '',
    descripcion: '',
    fecha_asignacion: '',
    fecha_entrega: '',
    puntaje_maximo: 100,
  });
  const { user } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { label: 'Dashboard', path: '/docente/dashboard' },
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
      if (editingTarea) {
        await api.put(`/tareas/${editingTarea.id}`, formData);
      } else {
        await tareaService.create(formData);
      }
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

  const handleEdit = (tarea) => {
    setEditingTarea(tarea);
    setFormData({
      grupo_id: tarea.grupo_id,
      titulo: tarea.titulo,
      descripcion: tarea.descripcion,
      fecha_asignacion: tarea.fecha_asignacion ? tarea.fecha_asignacion.split('T')[0] : '',
      fecha_entrega: tarea.fecha_entrega.split('T')[0],
      puntaje_maximo: tarea.puntaje_maximo,
    });
    setShowModal(true);
  };

  const handleVerEntregas = (tareaId) => {
    navigate(`/docente/tarea/${tareaId}/entregas`);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTarea(null);
    setFormData({
      grupo_id: '',
      titulo: '',
      descripcion: '',
      fecha_asignacion: '',
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

          {tareas.length > 0 ? (
            <div className="space-y-4">
              {tareas.map((tarea) => (
                <div
                  key={tarea.id}
                  className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {tarea.titulo}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {tarea.grupo?.materia?.nombre} - Grupo {tarea.grupo?.nombre_grupo}
                      </p>
                      <p className="text-sm text-gray-700 mt-2">{tarea.descripcion}</p>
                      <div className="flex space-x-4 mt-3 text-sm text-gray-600">
                        {tarea.fecha_asignacion && (
                          <p>
                            <strong>Asignación:</strong>{' '}
                            {new Date(tarea.fecha_asignacion).toLocaleDateString()}
                          </p>
                        )}
                        <p>
                          <strong>Entrega:</strong>{' '}
                          {new Date(tarea.fecha_entrega).toLocaleDateString()}
                        </p>
                        <p>
                          <strong>Puntaje:</strong> {tarea.puntaje_maximo} puntos
                        </p>
                      </div>
                    </div>
                    <div className="ml-4 flex flex-col space-y-2">
                      <button
                        onClick={() => handleVerEntregas(tarea.id)}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm"
                      >
                        Ver Entregas
                      </button>
                      <button
                        onClick={() => handleEdit(tarea)}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(tarea.id)}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-600">No has creado ninguna tarea aún.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingTarea ? 'Editar Tarea' : 'Nueva Tarea'}
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
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
                          {grupo.materia?.nombre} - Grupo {grupo.nombre_grupo}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
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

                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Descripción *
                    </label>
                    <textarea
                      value={formData.descripcion}
                      onChange={(e) =>
                        setFormData({ ...formData, descripcion: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="4"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Fecha Asignación
                      </label>
                      <input
                        type="date"
                        value={formData.fecha_asignacion}
                        onChange={(e) =>
                          setFormData({ ...formData, fecha_asignacion: e.target.value })
                        }
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Fecha Entrega *
                      </label>
                      <input
                        type="date"
                        value={formData.fecha_entrega}
                        onChange={(e) =>
                          setFormData({ ...formData, fecha_entrega: e.target.value })
                        }
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Puntaje Máximo *
                    </label>
                    <input
                      type="number"
                      value={formData.puntaje_maximo}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          puntaje_maximo: parseFloat(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                      step="0.5"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
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

export default DocenteTareas;
