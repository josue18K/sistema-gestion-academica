import { useState, useEffect } from 'react';
import { grupoService } from '../services/grupoService';
import { materiaService } from '../services/materiaService';
import { docenteService } from '../services/docenteService';
import Navbar from '../components/Navbar';

const Grupos = () => {
  const [grupos, setGrupos] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [docentes, setDocentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingGrupo, setEditingGrupo] = useState(null);
  const [formData, setFormData] = useState({
    materia_id: '',
    docente_id: '',
    nombre_grupo: '',
    periodo: '',
    horario: '',
    aula: '',
    cupo_maximo: 30,
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
    fetchGrupos();
    fetchMaterias();
    fetchDocentes();
  }, []);

  const fetchGrupos = async () => {
    try {
      const data = await grupoService.getAll();
      setGrupos(data);
    } catch (error) {
      console.error('Error al cargar grupos:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMaterias = async () => {
    try {
      const data = await materiaService.getAll();
      setMaterias(data);
    } catch (error) {
      console.error('Error al cargar materias:', error);
    }
  };

  const fetchDocentes = async () => {
    try {
      const data = await docenteService.getAll();
      setDocentes(data);
    } catch (error) {
      console.error('Error al cargar docentes:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingGrupo) {
        await grupoService.update(editingGrupo.id, formData);
      } else {
        await grupoService.create(formData);
      }
      fetchGrupos();
      handleCloseModal();
    } catch (error) {
      console.error('Error al guardar grupo:', error);
      alert('Error al guardar el grupo');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este grupo?')) {
      try {
        await grupoService.delete(id);
        fetchGrupos();
      } catch (error) {
        console.error('Error al eliminar grupo:', error);
        alert('Error al eliminar el grupo');
      }
    }
  };

  const handleEdit = (grupo) => {
    setEditingGrupo(grupo);
    setFormData({
      materia_id: grupo.materia_id,
      docente_id: grupo.docente_id,
      nombre_grupo: grupo.nombre_grupo,
      periodo: grupo.periodo,
      horario: grupo.horario,
      aula: grupo.aula,
      cupo_maximo: grupo.cupo_maximo,
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingGrupo(null);
    setFormData({
      materia_id: '',
      docente_id: '',
      nombre_grupo: '',
      periodo: '',
      horario: '',
      aula: '',
      cupo_maximo: 30,
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
            <h2 className="text-2xl font-bold text-gray-800">Gestión de Grupos</h2>
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              + Nuevo Grupo
            </button>
          </div>

          {/* Table */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Grupo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Materia
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Docente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Horario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Aula
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Cupo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {grupos.map((grupo) => (
                  <tr key={grupo.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {grupo.nombre_grupo}
                      </div>
                      <div className="text-sm text-gray-500">{grupo.periodo}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {grupo.materia?.nombre || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {grupo.materia?.codigo}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {grupo.docente?.user?.name || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{grupo.horario}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{grupo.aula}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {grupo.inscripciones?.length || 0} / {grupo.cupo_maximo}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(grupo)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(grupo.id)}
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
          <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingGrupo ? 'Editar Grupo' : 'Nuevo Grupo'}
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Materia *
                    </label>
                    <select
                      value={formData.materia_id}
                      onChange={(e) =>
                        setFormData({ ...formData, materia_id: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Seleccionar materia</option>
                      {materias.map((materia) => (
                        <option key={materia.id} value={materia.id}>
                          {materia.codigo} - {materia.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Docente *
                    </label>
                    <select
                      value={formData.docente_id}
                      onChange={(e) =>
                        setFormData({ ...formData, docente_id: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Seleccionar docente</option>
                      {docentes.map((docente) => (
                        <option key={docente.id} value={docente.id}>
                          {docente.user?.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Nombre del Grupo *
                    </label>
                    <input
                      type="text"
                      value={formData.nombre_grupo}
                      onChange={(e) =>
                        setFormData({ ...formData, nombre_grupo: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Grupo A"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Periodo *
                    </label>
                    <input
                      type="text"
                      value={formData.periodo}
                      onChange={(e) =>
                        setFormData({ ...formData, periodo: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="2025-1"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Horario *
                    </label>
                    <input
                      type="text"
                      value={formData.horario}
                      onChange={(e) =>
                        setFormData({ ...formData, horario: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Lun-Mier 8:00-10:00"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Aula *
                    </label>
                    <input
                      type="text"
                      value={formData.aula}
                      onChange={(e) =>
                        setFormData({ ...formData, aula: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="A-101"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Cupo Máximo *
                    </label>
                    <input
                      type="number"
                      value={formData.cupo_maximo}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          cupo_maximo: parseInt(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="1"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-4">
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

export default Grupos;
