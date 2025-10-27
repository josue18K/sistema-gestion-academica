import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-800">
                Sistema Académico
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                Bienvenido, <strong>{user?.name}</strong>
              </span>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {user?.role}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
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
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Dashboard
            </h2>
            <p className="text-gray-600">
              Bienvenido al sistema de gestión académica.
            </p>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-blue-500 text-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold">Estudiantes</h3>
                <p className="text-3xl font-bold mt-2">50</p>
              </div>
              <div className="bg-green-500 text-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold">Docentes</h3>
                <p className="text-3xl font-bold mt-2">10</p>
              </div>
              <div className="bg-purple-500 text-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold">Carreras</h3>
                <p className="text-3xl font-bold mt-2">4</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
