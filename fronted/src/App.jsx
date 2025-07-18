import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import UserProfile from "./pages/UserProfile";
import Login from "./pages/Login";
import { ThemeProvider } from "./context/ThemeContext";
import AdminDashboard from "../src/pages/AdminDashboard";
import AdminProfile from "../src/pages/AdminProfile";
import Password from "./pages/Password";
import UserPage from "./pages/UserPage";

import ProtectedRoute from "./components/ProtectedRoute";
import authService from "./services/authService";

const App = () => {
  const handleRootRedirect = () => {
    const user = authService.getCurrentUser();
    if (user) {
      if (user.role === "Admin") {
        return <Navigate to="/admin-dashboard" replace />;
      } else if (user.role === "Employee" || user.role === "Manager") {
        return <Navigate to="/extrahours-list" replace />;
      }
    }
    return <Navigate to="/login" replace />;
  };

  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/password" element={<Password />} />

          <Route path="/" element={handleRootRedirect()} />

          {/* Rutas para Administradores */}
          <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/admin-profile" element={<AdminProfile />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["Employee"]} />}>
            <Route path="/extrahours-list" element={<UserPage />} />{" "}
            <Route path="/user-profile" element={<UserProfile />} />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
