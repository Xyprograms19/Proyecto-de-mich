// src/ThemeContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

// Crear el contexto
const ThemeContext = createContext();

// Proveedor del contexto
export const ThemeProvider = ({ children }) => {
  const [isLightTheme, setIsLightTheme] = useState(() => {
    const savedTheme = localStorage.getItem('isLightTheme');
    return savedTheme ? JSON.parse(savedTheme) : true; // Por defecto, claro
  });

  useEffect(() => {
    localStorage.setItem('isLightTheme', JSON.stringify(isLightTheme));
    document.body.style.backgroundColor = isLightTheme ? '#FFFFFF' : '#111827';
    document.body.style.color = isLightTheme ? '#1F2937' : '#F9FAFB';
  }, [isLightTheme]);

  const toggleTheme = () => {
    setIsLightTheme(prev => !prev);
  };

  return (
    <ThemeContext.Provider value={{ isLightTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook para usar el contexto
export const useTheme = () => {
  return useContext(ThemeContext);
};