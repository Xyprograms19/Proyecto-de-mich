import { useState } from 'react';
import { Link } from 'react-router-dom';

const PasswordRecovery = () => {
  const [email, setEmail] = useState('');

  const handlePasswordRecovery = (e) => {
    e.preventDefault();
    alert('Instrucciones de recuperación enviadas a ' + email);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
        {/* Cabecera responsive */}
        <div className="bg-[#005EB8] p-4 sm:p-6 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">AMADEUS</h1>
        </div>
        
        <div className="p-6 sm:p-8">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">Recupera tu contraseña</h2>
            <p className="text-gray-600 mt-2 sm:mt-3 text-sm sm:text-base">
              Ingresa tu correo electrónico registrado. Te enviaremos un enlace para restablecer tu contraseña.
            </p>
          </div>
          
          <form onSubmit={handlePasswordRecovery}>
            <div className="mb-4 sm:mb-6">
              <label className="block text-gray-700 text-xs sm:text-sm font-medium mb-1 sm:mb-2">Correo electrónico</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 bg-white border border-gray-300 rounded-lg text-sm sm:text-base text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#005EB8] focus:border-transparent transition duration-200" 
                  placeholder="correo@ejemplo.com"
                  required 
                />
              </div>
            </div>
            
            <button 
              type="submit" 
              className="w-full bg-[#005EB8] hover:bg-[#004b94] text-white py-2 sm:py-3 px-4 rounded-lg transition duration-300 shadow-md flex items-center justify-center text-sm sm:text-base"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Enviar Instrucciones
            </button>
            
            <div className="mt-4 sm:mt-6 text-center">
              <Link 
                to="/login" 
                className="text-[#005EB8] hover:text-[#004b94] transition duration-200 flex items-center justify-center text-xs sm:text-sm"
              >
                <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Volver al inicio de sesión
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PasswordRecovery;