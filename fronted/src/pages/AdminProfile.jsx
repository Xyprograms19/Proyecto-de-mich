import React, { useState, useEffect } from "react";
import {
  User,
  Settings,
  Briefcase,
  Award,
  Mail,
  Clock,
  Sun,
  Moon,
  ChevronLeft,
  Upload,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";

const AdminProfile = () => {
  const { isLightTheme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [user, setUser] = useState({
    firstName: "Cargando",
    lastName: "",
    email: "",
    role: "",
    department: "",
    position: "",
    isActive: true,
    profilePicture: null,
  });

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      navigate("/login");
      return;
    }

    const userIdToFetch = currentUser.userId;

    if (!userIdToFetch) {
      console.error(
        "AdminProfile: No se pudo obtener el userId del usuario actual."
      );
      navigate("/login");
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const res = await fetch(
          `http://localhost:5023/api/users/${userIdToFetch}`,
          {
            headers: {
              Authorization: `Bearer ${currentUser.token}`,
            },
          }
        );
        if (!res.ok) throw new Error("No se pudo obtener el perfil");
        const data = await res.json();
        setUser((prevUser) => ({
          ...prevUser,
          ...data,
        }));
      } catch (err) {
        console.error("Error al cargar el perfil del administrador:", err);
        navigate("/login");
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const colors = {
    light: {
      primary: "#3B82F6",
      accent: "#10B981",
      background: "#FFFFFF",
      cardBackground: "#FFFFFF",
      text: "#1F2937",
      subtleText: "#6B7280",
      border: "#E5E7EB",
      iconBackground: "#EFF6FF",
    },
    dark: {
      primary: "#60A5FA",
      accent: "#34D399",
      background: "#111827",
      cardBackground: "#1F2937",
      text: "#F9FAFB",
      subtleText: "#9CA3AF",
      border: "#374151",
      iconBackground: "#1E40AF",
    },
  };

  const currentTheme = isLightTheme ? colors.light : colors.dark;

  return (
    <div
      className="flex flex-col min-h-screen w-full"
      style={{
        backgroundColor: currentTheme.background,
        color: currentTheme.text,
      }}
    >
      <div className="flex-grow flex items-center justify-center p-4">
        <div
          className="w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden"
          style={{ backgroundColor: currentTheme.cardBackground }}
        >
          <div
            className="relative py-12 px-8 flex flex-col items-center"
            style={{ backgroundColor: currentTheme.primary, color: "white" }}
          >
            <a
              href="/admin-dashboard"
              className="absolute top-4 left-4 p-2 rounded-full hover:bg-white/20 transition-colors flex items-center justify-center"
              aria-label="Volver a AdminDashboard"
            >
              <ChevronLeft size={24} />
            </a>

            <button
              onClick={toggleTheme}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 transition-colors"
            >
              {isLightTheme ? <Moon size={24} /> : <Sun size={24} />}
            </button>

            <div
              className="w-28 h-28 rounded-full flex items-center justify-center shadow-lg mb-4 overflow-hidden"
              style={{ backgroundColor: currentTheme.iconBackground }}
            >
              <User size={64} color={currentTheme.primary} strokeWidth={1.5} />
            </div>

            <h1 className="text-3xl font-bold">
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-lg opacity-80">{user.role}</p>
            <div className="flex items-center mt-2 space-x-2">
              <Mail className="w-5 h-5" />
              <span className="text-sm">{user.email}</span>
            </div>
          </div>

          <div className="p-8">
            <div
              className="w-full rounded-2xl p-6 space-y-4 border mb-6"
              style={{ borderColor: currentTheme.border }}
            >
              <h2
                className="text-xl font-semibold flex items-center mb-4"
                style={{ color: currentTheme.primary }}
              >
                <Briefcase className="mr-3" /> Detalles profesionales
              </h2>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Briefcase className="mr-3" color={currentTheme.primary} />
                  <span>Departamento: {user.department}</span>
                </div>
                <div>
                  <span>Posición: {user.position}</span>
                </div>
                <div>
                  <span>
                    Estado:
                    <span
                      className="ml-2 px-3 py-1 rounded-full text-sm font-medium"
                      style={{
                        backgroundColor: user.isActive
                          ? currentTheme.accent
                          : "#EF4444",
                        color: "white",
                      }}
                    >
                      {user.isActive ? "Activo" : "Inactivo"}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            <div
              className="w-full rounded-2xl p-6 space-y-4 border"
              style={{ borderColor: currentTheme.border }}
            >
              <h2
                className="text-xl font-semibold flex items-center mb-4"
                style={{ color: currentTheme.primary }}
              >
                <Settings className="mr-3" /> Configuración de la cuenta
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Tema preferido</span>
                  <div
                    className="w-16 h-8 rounded-full flex items-center cursor-pointer"
                    style={{
                      backgroundColor: isLightTheme ? "#E0E0E0" : "#444444",
                      justifyContent: isLightTheme ? "flex-start" : "flex-end",
                    }}
                    onClick={toggleTheme}
                  >
                    <span
                      className="w-6 h-6 rounded-full m-1"
                      style={{
                        backgroundColor: isLightTheme ? "white" : "#2196F3",
                      }}
                    ></span>
                  </div>
                </div>
                <div
                  className="text-sm"
                  style={{ color: currentTheme.subtleText }}
                >
                  Tema actual: {isLightTheme ? "Claro" : "Oscuro"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
