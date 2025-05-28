// import React from "react";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
// } from "react-router-dom";
// import UserPage from "./pages/UserPage";
// import UserProfile from "./pages/UserProfile";
// import Header from "./components/ui/Header";
// import Login from "./pages/Login";
// import { ThemeProvider } from "./context/ThemeContext";
// import AdminDashboard from "./pages/AdminDashboard";
// import ExtraHour from "./pages/ExtraHour";
// import Dashboard from "./pages/Dashboard";
// import Password from "./pages/Password";
// import AdminProfile from "./pages/AdminProfile";
// import ExtraHoursPage from "./pages/ExtraHoursPage"; // Asegúrate de que esta ruta sea correcta

// const App = () => {
//   return (
//     <ThemeProvider>
//       {" "}
//       {/* Envuelve tu aplicación con el ThemeProvider */}
//       <Router>
//         {window.location.pathname !== "/user-page" && <Header />}
//         <Routes>
//           <Route path="/admin-dashboard" element={<AdminDashboard />} />{" "}
//           {/* Asegúrate de que la ruta sea correcta */}
//           {/* Redirige a AdminDashboard */}
//           <Route path="/login" element={<Login />} />
//           <Route path="/user-page" element={<UserPage />} />
//           <Route path="/profile" element={<UserProfile />} />
//           <Route path="/extrahour" element={<ExtraHour />} />
//           <Route path="/dashboard" element={<Dashboard />} />
//           <Route path="/password" element={<Password />} />
//           <Route path="/admin-profile" element={<AdminProfile />} />
//           <Route path="/extrahours-test" element={<ExtraHoursPage />} />
//           {/* <Route path="/user-dashboard" element={<UserDashboard />} /> */}
//         </Routes>
//       </Router>
//     </ThemeProvider>
//   );
// };

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
import AdminDashboard from "./pages/AdminDashboard";

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
          </Route>

          <Route
            element={
              <ProtectedRoute allowedRoles={["Employee", "Manager", "Admin"]} />
            }
          >
            <Route path="/extrahours-list" element={<UserPage />} />{" "}
            <Route path="/profile" element={<UserProfile />} />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
