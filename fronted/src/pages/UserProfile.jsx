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

const UserProfile = () => {
  const { isLightTheme, toggleTheme } = useTheme();
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("userData");
    return savedUser
      ? JSON.parse(savedUser)
      : {
          name: "Juan Pérez",
          email: "juan.perez@company.com",
          role: "Desarrollador",
          department: "Desarrollo",
          isActive: true,
          profilePicture: null,
        };
  });

  useEffect(() => {
    localStorage.setItem("userData", JSON.stringify(user));
  }, [user]);

  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser((prev) => ({
          ...prev,
          profilePicture: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

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
          {/* Header Section */}
          <div
            className="relative py-12 px-8 flex flex-col items-center"
            style={{ backgroundColor: currentTheme.primary, color: "white" }}
          >
            {/* Back Button */}
            <a
              href="/user-page"
              className="absolute top-4 left-4 p-2 rounded-full hover:bg-white/20 transition-colors flex items-center justify-center"
              aria-label="Volver a UserPage"
            >
              <ChevronLeft size={24} />
            </a>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 transition-colors"
            >
              {isLightTheme ? <Moon size={24} /> : <Sun size={24} />}
            </button>

            {/* Profile Picture & Upload Interface */}
            <div className="relative">
              <div
                className="w-28 h-28 rounded-full flex items-center justify-center shadow-lg mb-4 overflow-hidden"
                style={{ backgroundColor: currentTheme.iconBackground }}
              >
                {user.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt="Foto de perfil"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User
                    size={64}
                    color={currentTheme.primary}
                    strokeWidth={1.5}
                  />
                )}
              </div>

              {/* Profile picture upload button */}
              <label
                htmlFor="profile-picture-upload"
                className="absolute bottom-4 right-0 bg-white rounded-full p-2 shadow-md cursor-pointer hover:bg-gray-100 transition-colors border"
                style={{
                  borderColor: currentTheme.border,
                  backgroundColor: currentTheme.cardBackground,
                }}
              >
                <Upload size={16} color={currentTheme.primary} />
                <input
                  type="file"
                  id="profile-picture-upload"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfilePictureChange}
                />
              </label>
            </div>

            <h1 className="text-3xl font-bold">{user.name}</h1>
            <p className="text-lg opacity-80">{user.role}</p>
            <div className="flex items-center mt-2 space-x-2">
              <Mail className="w-5 h-5" />
              <span className="text-sm">{user.email}</span>
            </div>
          </div>

          {/* Content Sections */}
          <div className="p-8">
            {/* Professional Details */}
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

            {/* Performance Overview */}
            <div
              className="w-full rounded-2xl p-6 space-y-4 border mb-6"
              style={{ borderColor: currentTheme.border }}
            >
              <h2
                className="text-xl font-semibold flex items-center mb-4"
                style={{ color: currentTheme.primary }}
              >
                <Award className="mr-3" /> Rendimiento
              </h2>
              <div className="space-y-4">
                {[
                  { label: "Horas extra", value: "20 este mes", icon: Clock },
                  {
                    label: "Aprobación de horas extra",
                    value: "95%",
                    icon: Award,
                  },
                  { label: "Última revisión", value: "Excelente", icon: User },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between p-4 rounded-xl border"
                    style={{ borderColor: currentTheme.border }}
                  >
                    <div className="flex items-center space-x-4">
                      <item.icon
                        className="w-6 h-6"
                        color={currentTheme.primary}
                      />
                      <div>
                        <h3
                          className="text-sm"
                          style={{ color: currentTheme.subtleText }}
                        >
                          {item.label}
                        </h3>
                        <p
                          className="text-lg font-bold"
                          style={{ color: currentTheme.accent }}
                        >
                          {item.value}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Account Settings */}
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

export default UserProfile;
