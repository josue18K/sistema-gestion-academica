import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Carreras from './pages/Carreras';
import Semestres from './pages/Semestres';
import Materias from './pages/Materias';
import Grupos from './pages/Grupos';
import Inscripciones from './pages/Inscripciones';
import Estudiantes from './pages/Estudiantes';
import Docentes from './pages/Docentes';
import EstudianteDashboard from './pages/EstudianteDashboard';
import EstudianteMisCursos from './pages/EstudianteMisCursos';
import EstudianteMisTareas from './pages/EstudianteMisTareas';
import EstudianteMisNotas from './pages/EstudianteMisNotas';
import DocenteDashboard from './pages/DocenteDashboard';
import DocenteMisGrupos from './pages/DocenteMisGrupos';

// Componente para redirigir según rol
function RoleBasedRedirect() {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;

  switch (user.role) {
    case 'administrador':
      return <Navigate to="/dashboard" />;
    case 'docente':
      return <Navigate to="/docente/dashboard" />;
    case 'estudiante':
      return <Navigate to="/estudiante/dashboard" />;
    default:
      return <Navigate to="/login" />;
  }
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<Login />} />

          {/* Redirección basada en rol */}
          <Route path="/" element={<RoleBasedRedirect />} />

          {/* Rutas de Administrador */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requiredRole="administrador">
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/carreras"
            element={
              <ProtectedRoute requiredRole="administrador">
                <Carreras />
              </ProtectedRoute>
            }
          />
          <Route
            path="/semestres"
            element={
              <ProtectedRoute requiredRole="administrador">
                <Semestres />
              </ProtectedRoute>
            }
          />
          <Route
            path="/materias"
            element={
              <ProtectedRoute requiredRole="administrador">
                <Materias />
              </ProtectedRoute>
            }
          />
          <Route
            path="/grupos"
            element={
              <ProtectedRoute requiredRole="administrador">
                <Grupos />
              </ProtectedRoute>
            }
          />
          <Route
            path="/inscripciones"
            element={
              <ProtectedRoute requiredRole="administrador">
                <Inscripciones />
              </ProtectedRoute>
            }
          />
          <Route
            path="/estudiantes"
            element={
              <ProtectedRoute requiredRole="administrador">
                <Estudiantes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/docentes"
            element={
              <ProtectedRoute requiredRole="administrador">
                <Docentes />
              </ProtectedRoute>
            }
          />

          {/* Rutas de Docente */}
          <Route
            path="/docente/dashboard"
            element={
              <ProtectedRoute requiredRole="docente">
                <DocenteDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/docente/mis-grupos"
            element={
              <ProtectedRoute requiredRole="docente">
                <DocenteMisGrupos />
              </ProtectedRoute>
            }
          />

          {/* Rutas de Estudiante */}
          <Route
            path="/estudiante/dashboard"
            element={
              <ProtectedRoute requiredRole="estudiante">
                <EstudianteDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/estudiante/mis-cursos"
            element={
              <ProtectedRoute requiredRole="estudiante">
                <EstudianteMisCursos />
              </ProtectedRoute>
            }
          />
          <Route
            path="/estudiante/mis-tareas"
            element={
              <ProtectedRoute requiredRole="estudiante">
                <EstudianteMisTareas />
              </ProtectedRoute>
            }
          />
          <Route
            path="/estudiante/mis-notas"
            element={
              <ProtectedRoute requiredRole="estudiante">
                <EstudianteMisNotas />
              </ProtectedRoute>
            }
          />

          {/* Ruta por defecto */}
          <Route path="*" element={<RoleBasedRedirect />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
