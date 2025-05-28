import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FaLinkedin, FaTwitter, FaYoutube, FaInstagram } from "react-icons/fa";
import authService from "../services/authService";

const schema = yup
  .object({
    email: yup
      .string()
      .email("El correo electrónico no es válido.")
      .required("El correo electrónico es requerido."),
    password: yup.string().required("La contraseña es requerida."),
  })
  .required();

const Login = () => {
  const navigate = useNavigate();
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setErrorMessage("");
    try {
      const userData = await authService.login(
        data.email,
        data.password,
        rememberMe
      );

      if (userData) {
        const userRole = userData.role;

        console.log("Login exitoso. Rol:", userRole);

        if (userRole === "Admin") {
          navigate("/admin-dashboard");
        } else if (userRole === "Employee" || userRole === "Manager") {
          navigate("/extrahours-list");
        } else {
          navigate("/extrahours-list");
        }
      } else {
        setErrorMessage("Credenciales inválidas.");
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          setErrorMessage("Correo o contraseña incorrectos.");
        } else if (error.response.data && error.response.data.message) {
          setErrorMessage(error.response.data.message);
        } else {
          setErrorMessage("Error en el servidor. Inténtalo de nuevo.");
        }
      } else if (error.request) {
        setErrorMessage(
          "No se pudo conectar con el servidor. Verifica tu conexión."
        );
      } else {
        setErrorMessage("Ocurrió un error inesperado.");
      }
      console.error("Login fallido:", error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-full min-h-screen w-full font-sans overflow-hidden m-0 p-0">
      <div className="w-full md:w-1/2 bg-gradient-to-br from-[#0A2A66] to-[#0091DA] flex items-center justify-center min-h-screen">
        <div className="text-white text-center px-4">
          <img
            src="/utils/AmadeusLogoBlanco.png"
            alt="Amadeus Logo"
            className="w-3/4 max-w-xs mx-auto mb-4"
          />
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
            SELLING PLATFORM CONNECT
          </h1>
          <div className="flex justify-center space-x-4 mt-8 md:mt-12">
            <a
              href="https://www.linkedin.com/company/amadeus/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedin className="text-2xl md:text-3xl hover:text-blue-300 transition-colors" />
            </a>
            <a
              href="https://twitter.com/AmadeusITGroup"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaTwitter className="text-2xl md:text-3xl hover:text-blue-300 transition-colors" />
            </a>
            <a
              href="https://www.youtube.com/user/AmadeusITGroup"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaYoutube className="text-2xl md:text-3xl hover:text-red-300 transition-colors" />
            </a>
            <a
              href="https://www.instagram.com/amadeusitgroup/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram className="text-2xl md:text-3xl hover:text-pink-300 transition-colors" />
            </a>
          </div>
        </div>
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center min-h-screen bg-white">
        <div className="w-full max-w-xl p-4 sm:p-6 md:p-10 bg-white flex flex-col justify-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#041E42] mb-6 text-center">
            Inicio de sesión
          </h2>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="md:max-w-md md:mx-auto w-full"
          >
            <div className="mb-4">
              <label className="block text-[#041E42] font-medium mb-1">
                Correo electrónico *
              </label>
              <input
                type="email"
                className={`w-full p-2 border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-[#0073CF] transition-all text-black [&::placeholder]:text-gray-500`}
                {...register("email")}
              />
              <p className="text-red-500 text-sm mt-1">
                {errors.email?.message}
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-[#041E42] font-medium mb-1">
                Contraseña *
              </label>
              <input
                type="password"
                className={`w-full p-2 border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-[#0073CF] transition-all text-black [&::placeholder]:text-gray-500`}
                {...register("password")}
              />
              <p className="text-red-500 text-sm mt-1">
                {errors.password?.message}
              </p>
            </div>

            {errorMessage && (
              <p className="text-red-500 text-sm mb-4 text-center">
                {errorMessage}
              </p>
            )}

            <div className="mb-4 text-right">
              <Link
                to="/password"
                className="text-[#0073CF] hover:text-[#005EA8] text-sm transition-all"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <div className="mb-4 flex items-center">
              <input
                type="checkbox"
                className="mr-2 accent-[#0073CF]"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              <span className="text-[#041E42]">Recuérdame</span>
            </div>

            <button
              type="submit"
              className="w-full bg-[#0073CF] text-white p-2 rounded-lg hover:bg-[#005EA8] transition-all duration-300 shadow-md"
            >
              Inicio de sesión
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
