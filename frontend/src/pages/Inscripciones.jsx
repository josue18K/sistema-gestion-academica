import { useState, useEffect } from 'react';
import { inscripcionService } from '../services/inscripcionService';
import { estudianteService } from '../services/estudianteService';
import { grupoService } from '../services/grupoService';
import Navbar from '../components/Navbar';

const Inscripciones = () => {
  const [inscripciones, setInscripciones] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    estudiante_id: '',
    grupo_id: '',
    fecha_inscripcion: new Date().toISOString().split('T')[0],
    estado: 'activo',
  });

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
    fetchInscripciones();
    fetchEstudiantes();
    fetchGrupos();
  }, []);

  const fetchInscripciones = async () => {
    try {
      const data = await inscripcionService.getAll();
      setInscripciones(data);
    } catch (error) {
      console.error('Error al cargar inscripciones:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEstudiantes = async () => {
    try {
      const data = await estudianteService.getAll();
      setEstudiantes(data);
    } catch (error) {
      console.error('Error al cargar estudiantes:', error);
    }
  };

  const fetchGrupos = async () => {
    try {
      const data = await grupoService.getAll();
      setGrupos(data);
    } catch (error) {
      console.error('Error al cargar grupos:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await inscripcionService.create(formData);
      fetchInscripciones();
      handleCloseModal();
    } catch (error) {
      console.error('Error al guardar inscripción:', error);
      alert('Error al guardar la inscripción');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta inscripción?')) {
      try {
        await inscripcionService.delete(id);
        fetchInscripciones();
      } catch (error) {
        console.error('Error al eliminar inscripción:', error);
        alert('Error al eliminar la inscripción');
      }
    }
  };

  const handleUpdateEstado = async (id, nuevoEstado) => {
    try {
      await inscripcionService.update(id, { estado: nuevoEstado });
      fetchInscripciones();
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      alert('Error al actualizar el estado');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      estudiante_id: '',
      grupo_id: '',
      fecha_inscripcion: new Date().toISOString().split('T')[0],
      estado: 'activo',
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
      <Navbar title="Sistema Académico" menuItems={menuItems} />

      {/* Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Gestión de Inscripciones
            </h2>
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              + Nueva Inscripción
            </button>
          </div>

          {/* Table */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Estudiante
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Materia
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Grupo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Docente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {inscripciones.map((inscripcion) => (
                  <tr key={inscripcion.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {inscripcion.estudiante?.user?.name || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {inscripcion.estudiante?.codigo_estudiante}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {inscripcion.grupo?.materia?.nombre || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {inscripcion.grupo?.materia?.codigo}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {inscripcion.grupo?.nombre_grupo || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {inscripcion.grupo?.periodo}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {inscripcion.grupo?.docente?.user?.name || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(inscripcion.fecha_inscripcion).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={inscripcion.estado}
                        onChange={(e) =>
                          handleUpdateEstado(inscripcion.id, e.target.value)
                        }
                        className={`text-xs font-semibold rounded-full px-3 py-1 ${
                          inscripcion.estado === 'activo'
                            ? 'bg-green-100 text-green-800'
                            : inscripcion.estado === 'finalizado'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        <option value="activo">Activo</option>
                        <option value="retirado">Retirado</option>
                        <option value="finalizado">Finalizado</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleDelete(inscripcion.id)}
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Nueva Inscripción
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Estudiante *
                  </label>
                  <select
                    value={formData.estudiante_id}
                    onChange={(e) =>
                      setFormData({ ...formData, estudiante_id: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Seleccionar estudiante</option>
                    {estudiantes.map((estudiante) => (
                      <option key={estudiante.id} value={estudiante.id}>
                        {estudiante.codigo_estudiante} - {estudiante.user?.name}
                      </option>
                    ))}
                  </select>
                </div>

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
                        {grupo.materia?.nombre} - {grupo.nombre_grupo} (
                        {grupo.periodo})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Fecha de Inscripción *
                  </label>
                  <input
                    type="date"
                    value={formData.fecha_inscripcion}
                    onChange={(e) =>
                      setFormData({ ...formData, fecha_inscripcion: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Estado *
                  </label>
                  <select
                    value={formData.estado}
                    onChange={(e) =>
                      setFormData({ ...formData, estado: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="activo">Activo</option>
                    <option value="retirado">Retirado</option>
                    <option value="finalizado">Finalizado</option>
                  </select>
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

export default Inscripciones;
