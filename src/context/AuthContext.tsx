import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { AuthContextType, User, Club } from '../types/auth';
import { login as loginService, logout as logoutService, validarToken } from '../services/authService';
import { aceptarInvitacion as aceptarInvitacionService } from '../services/invitacionService';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [usuario, setUsuario] = useState<User | null>(null);
  const [clubActual, setClubActual] = useState<Club | null>(null);
  const [clubes, setClubes] = useState<Club[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Verificar token al cargar
  useEffect(() => {
    const verificarToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        const isValid = await validarToken(token);
        if (isValid) {
          // Cargar usuario y clubes desde localStorage
          const usuarioGuardado = localStorage.getItem('usuario');
          const clubesGuardados = localStorage.getItem('clubes');
          if (usuarioGuardado && clubesGuardados) {
            setUsuario(JSON.parse(usuarioGuardado));
            setClubes(JSON.parse(clubesGuardados));
            setIsAuthenticated(true);
          }
        } else {
          // Token inválido
          localStorage.removeItem('token');
          localStorage.removeItem('usuario');
          localStorage.removeItem('clubes');
        }
      }
      setIsLoading(false);
    };

    verificarToken();
  }, []);

  const handleLogin = async (email: string, contraseña: string) => {
    setIsLoading(true);
    try {
      const response = await loginService(email, contraseña);
      localStorage.setItem('token', response.token);
      localStorage.setItem('usuario', JSON.stringify(response.usuario));
      localStorage.setItem('clubes', JSON.stringify(response.clubes));
      setUsuario(response.usuario);
      setClubes(response.clubes);
      setIsAuthenticated(true);
      // Seleccionar primer club automáticamente
      if (response.clubes.length > 0) {
        setClubActual(response.clubes[0]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await logoutService(token);
      }
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      localStorage.removeItem('clubes');
      setUsuario(null);
      setClubActual(null);
      setClubes([]);
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  };

  const handleAceptarInvitacion = async (
    token: string,
    nombre: string,
    apellido: string,
    contraseña: string
  ) => {
    setIsLoading(true);
    try {
      const response = await aceptarInvitacionService(token, nombre, apellido, contraseña);
      localStorage.setItem('token', response.token);
      localStorage.setItem('usuario', JSON.stringify(response.usuario));
      localStorage.setItem('clubes', JSON.stringify(response.clubes));
      setUsuario(response.usuario);
      setClubes(response.clubes);
      setIsAuthenticated(true);
      if (response.clubes.length > 0) {
        setClubActual(response.clubes[0]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSeleccionarClub = async (clubId: string) => {
    const club = clubes.find(c => c.id === clubId);
    if (club) {
      setClubActual(club);
    }
  };

  const handleCrearClub = async (datos: any) => {
    // Implementar después
    throw new Error('No implementado');
  };

  const handleInvitarMiembro = async () => {
    // Implementar después
    throw new Error('No implementado');
  };

  const value: AuthContextType = {
    usuario,
    clubActual,
    clubes,
    isLoading,
    isAuthenticated,
    login: handleLogin,
    logout: handleLogout,
    aceptarInvitacion: handleAceptarInvitacion,
    seleccionarClub: handleSeleccionarClub,
    crearClub: handleCrearClub,
    invitarMiembro: handleInvitarMiembro,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
