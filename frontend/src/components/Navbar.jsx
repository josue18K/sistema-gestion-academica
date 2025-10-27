import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = ({ title = 'Sistema Académico', menuItems = [] }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <h1 className="text-xl font-bold text-gray-800">{title}</h1>
            <div className="flex space-x-4">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => navigate(item.path)}
                  className={`px-3 py-2 transition ${
                    isActive(item.path)
                      ? 'text-blue-600 font-semibold'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">
              <strong>{user?.name}</strong>
            </span>
            <span
              className={`px-3 py-1 rounded-full text-sm ${
                user?.role === 'administrador'
                  ? 'bg-blue-100 text-blue-800'
                  : user?.role === 'docente'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-purple-100 text-purple-800'
              }`}
            >
              {user?.role === 'administrador'
                ? 'Administrador'
                : user?.role === 'docente'
                ? 'Docente'
                : 'Estudiante'}
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
  );
};

export default Navbar;
