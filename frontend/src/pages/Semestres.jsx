import { useState, useEffect } from 'react';
import { semestreService } from '../services/semestreService';
import { carreraService } from '../services/carreraService';
import Navbar from '../components/Navbar';

const Semestres = () => {
  const [semestres, setSemestres] = useState([]);
  const [carreras, setCarreras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSemestre, setEditingSemestre] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    numero_semestre: 1,
    carrera_id: '',
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
    fetchSemestres();
    fetchCarreras();
  }, []);

  const fetchSemestres = async () => {
    try {
      const data = await semestreService.getAll();
      setSemestres(data);
    } catch (error) {
      console.error('Error al cargar semestres:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCarreras = async () => {
    try {
      const data = await carreraService.getAll();
      setCarreras(data);
    } catch (error) {
      console.error('Error al cargar carreras:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSemestre) {
        await semestreService.update(editingSemestre.id, formData);
      } else {
        await semestreService.create(formData);
      }
      fetchSemestres();
      handleCloseModal();
    } catch (error) {
      console.error('Error al guardar semestre:', error);
      alert('Error al guardar el semestre');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este semestre?')) {
      try {
        await semestreService.delete(id);
        fetchSemestres();
      } catch (error) {
        console.error('Error al eliminar semestre:', error);
        alert('Error al eliminar el semestre');
      }
    }
  };

  const handleEdit = (semestre) => {
    setEditingSemestre(semestre);
    setFormData({
      nombre: semestre.nombre,
      numero_semestre: semestre.numero_semestre,
      carrera_id: semestre.carrera_id,
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingSemestre(null);
    setFormData({
      nombre: '',
      numero_semestre: 1,
      carrera_id: '',
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
            <h2 className="text-2xl font-bold text-gray-800">Gestión de Semestres</h2>
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              + Nuevo Semestre
            </button>
          </div>

          {/* Table */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Carrera
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Número
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {semestres.map((semestre) => (
                  <tr key={semestre.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {semestre.carrera?.nombre || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{semestre.nombre}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        Semestre {semestre.numero_semestre}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(semestre)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(semestre.id)}
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
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingSemestre ? 'Editar Semestre' : 'Nuevo Semestre'}
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Carrera *
                  </label>
                  <select
                    value={formData.carrera_id}
                    onChange={(e) =>
                      setFormData({ ...formData, carrera_id: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Seleccionar carrera</option>
                    {carreras.map((carrera) => (
                      <option key={carrera.id} value={carrera.id}>
                        {carrera.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) =>
                      setFormData({ ...formData, nombre: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Primer Semestre"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Número de Semestre *
                  </label>
                  <input
                    type="number"
                    value={formData.numero_semestre}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        numero_semestre: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1"
                    max="12"
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
    </div>
  );
};

export default Semestres;
