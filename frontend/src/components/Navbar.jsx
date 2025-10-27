import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  FiLogOut,
  FiUser,
  FiHome,
  FiBook,
  FiUsers,
  FiCalendar,
  FiGrid,
  FiUserPlus,
  FiUserCheck,
  FiClipboard,
  FiFileText,
  FiCheckSquare,
  FiAward
} from 'react-icons/fi';

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

  const getIcon = (label) => {
    const iconMap = {
      'Dashboard': FiHome,
      'Inicio': FiHome,
      'Carreras': FiBook,
      'Semestres': FiCalendar,
      'Materias': FiGrid,
      'Grupos': FiUsers,
      'Estudiantes': FiUserPlus,
      'Docentes': FiUserCheck,
      'Inscripciones': FiClipboard,
      'Mis Grupos': FiUsers,
      'Tareas': FiFileText,
      'Asistencias': FiCheckSquare,
      'Calificaciones': FiAward,
      'Mis Cursos': FiBook,
      'Mis Tareas': FiFileText,
      'Mis Notas': FiAward,
    };
    const Icon = iconMap[label] || FiHome;
    return <Icon className="text-lg" />;
  };

  const getRoleBadgeColor = () => {
    switch(user?.role) {
      case 'administrador':
        return 'bg-gradient-to-r from-blue-500 to-blue-600';
      case 'docente':
        return 'bg-gradient-to-r from-green-500 to-green-600';
      case 'estudiante':
        return 'bg-gradient-to-r from-purple-500 to-purple-600';
      default:
        return 'bg-gray-500';
    }
  };

  const getRoleLabel = () => {
    switch(user?.role) {
      case 'administrador':
        return 'Administrador';
      case 'docente':
        return 'Docente';
      case 'estudiante':
        return 'Estudiante';
      default:
        return user?.role;
    }
  };

  return (
    <nav className="bg-white shadow-lg border-b-2 border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            {/* Logo/Title */}
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <FiBook className="text-white text-xl" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {title}
              </h1>
            </div>

            {/* Menu Items */}
            <div className="hidden md:flex space-x-1">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive(item.path)
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md transform scale-105'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  {getIcon(item.label)}
                  <span className="font-medium text-sm">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* User Info and Logout */}
          <div className="flex items-center space-x-4">
            {/* User Info */}
            <div className="flex items-center space-x-3 bg-gray-50 rounded-lg px-4 py-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center shadow-md">
                <FiUser className="text-white text-sm" />
              </div>
              <div className="hidden sm:block text-right">
                <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
                <span className={`text-xs font-medium text-white px-2 py-0.5 rounded-full ${getRoleBadgeColor()}`}>
                  {getRoleLabel()}
                </span>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <FiLogOut className="text-lg" />
              <span className="hidden sm:inline font-medium">Salir</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
