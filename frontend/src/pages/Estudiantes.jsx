import { useState, useEffect } from 'react';
import { estudianteService } from '../services/estudianteService';
import { carreraService } from '../services/carreraService';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Estudiantes = () => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [carreras, setCarreras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEstudiante, setEditingEstudiante] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    carrera_id: '',
    codigo_estudiante: '',
    documento_identidad: '',
    fecha_nacimiento: '',
    telefono: '',
    direccion: '',
  });
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchEstudiantes();
    fetchCarreras();
  }, []);

  const fetchEstudiantes = async () => {
    try {
      const data = await estudianteService.getAll();
      setEstudiantes(data);
    } catch (error) {
      console.error('Error al cargar estudiantes:', error);
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
      if (editingEstudiante) {
        const updateData = { ...formData };
        delete updateData.password;
        delete updateData.name;
        delete updateData.email;
        await estudianteService.update(editingEstudiante.id, updateData);
      } else {
        await estudianteService.create(formData);
      }
      fetchEstudiantes();
      handleCloseModal();
    } catch (error) {
      console.error('Error al guardar estudiante:', error);
      alert('Error al guardar el estudiante');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este estudiante?')) {
      try {
        await estudianteService.delete(id);
        fetchEstudiantes();
      } catch (error) {
        console.error('Error al eliminar estudiante:', error);
        alert('Error al eliminar el estudiante');
      }
    }
  };

  const handleEdit = (estudiante) => {
    setEditingEstudiante(estudiante);
    setFormData({
      name: estudiante.user.name,
      email: estudiante.user.email,
      password: '',
      carrera_id: estudiante.carrera_id,
      codigo_estudiante: estudiante.codigo_estudiante,
      documento_identidad: estudiante.documento_identidad,
      fecha_nacimiento: estudiante.fecha_nacimiento || '',
      telefono: estudiante.telefono || '',
      direccion: estudiante.direccion || '',
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingEstudiante(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      carrera_id: '',
      codigo_estudiante: '',
      documento_identidad: '',
      fecha_nacimiento: '',
      telefono: '',
      direccion: '',
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
              <h1 className="text-xl font-bold text-gray-800">Sistema Académico</h1>
              <div className="flex space-x-4">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="text-gray-600 hover:text-gray-900 px-3 py-2"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => navigate('/carreras')}
                  className="text-gray-600 hover:text-gray-900 px-3 py-2"
                >
                  Carreras
                </button>
                <button
                  onClick={() => navigate('/estudiantes')}
                  className="text-blue-600 font-semibold px-3 py-2"
                >
                  Estudiantes
                </button>
                <button
                  onClick={() => navigate('/docentes')}
                  className="text-gray-600 hover:text-gray-900 px-3 py-2"
                >
                  Docentes
                </button>
              </div>
            </div>
            <div className="flex items-center">
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
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Gestión de Estudiantes</h2>
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              + Nuevo Estudiante
            </button>
          </div>

          {/* Table */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Código
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Carrera
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    DNI
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {estudiantes.map((estudiante) => (
                  <tr key={estudiante.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {estudiante.codigo_estudiante}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {estudiante.user.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {estudiante.user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {estudiante.carrera.nombre}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {estudiante.documento_identidad}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(estudiante)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(estudiante.id)}
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
                {editingEstudiante ? 'Editar Estudiante' : 'Nuevo Estudiante'}
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      disabled={editingEstudiante}
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      disabled={editingEstudiante}
                    />
                  </div>

                  {!editingEstudiante && (
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Contraseña *
                      </label>
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required={!editingEstudiante}
                      />
                    </div>
                  )}

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
                      Código Estudiante *
                    </label>
                    <input
                      type="text"
                      value={formData.codigo_estudiante}
                      onChange={(e) =>
                        setFormData({ ...formData, codigo_estudiante: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      DNI *
                    </label>
                    <input
                      type="text"
                      value={formData.documento_identidad}
                      onChange={(e) =>
                        setFormData({ ...formData, documento_identidad: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Fecha de Nacimiento
                    </label>
                    <input
                      type="date"
                      value={formData.fecha_nacimiento}
                      onChange={(e) =>
                        setFormData({ ...formData, fecha_nacimiento: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Teléfono
                    </label>
                    <input
                      type="text"
                      value={formData.telefono}
                      onChange={(e) =>
                        setFormData({ ...formData, telefono: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="mb-4 col-span-2">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Dirección
                    </label>
                    <textarea
                      value={formData.direccion}
                      onChange={(e) =>
                        setFormData({ ...formData, direccion: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="2"
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

export default Estudiantes;
