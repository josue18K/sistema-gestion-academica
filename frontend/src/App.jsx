import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Carreras from './pages/Carreras';
import Estudiantes from './pages/Estudiantes';
import Docentes from './pages/Docentes';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/carreras"
            element={
              <ProtectedRoute>
                <Carreras />
              </ProtectedRoute>
            }
          />
          <Route
            path="/estudiantes"
            element={
              <ProtectedRoute>
                <Estudiantes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/docentes"
            element={
              <ProtectedRoute>
                <Docentes />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
