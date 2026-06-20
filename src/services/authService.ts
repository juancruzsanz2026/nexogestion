import { LoginResponse } from '../types/auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Solicita código de activación para el primer admin
 */
export async function solicitarActivacionAdmin(email: string): Promise<void> {
  const response = await fetch(`${API_URL}/auth/solicitar-activacion`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    throw new Error('Error al solicitar activación');
  }
}

/**
 * Completa la activación del primer admin
 */
export async function completarActivacionAdmin(
  email: string,
  codigo: string,
  nombre: string,
  apellido: string,
  contraseña: string
): Promise<LoginResponse> {
  const response = await fetch(`${API_URL}/auth/completar-activacion`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      codigo,
      nombre,
      apellido,
      contraseña,
    }),
  });

  if (!response.ok) {
    if (response.status === 400) {
      throw new Error('Código de activación inválido o expirado');
    }
    throw new Error('Error al completar activación');
  }

  return response.json();
}

/**
 * Login con email y contraseña
 */
export async function login(email: string, contraseña: string): Promise<LoginResponse> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, contraseña }),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Email o contraseña incorrectos');
    }
    if (response.status === 404) {
      throw new Error('Usuario no encontrado');
    }
    throw new Error('Error en login');
  }

  return response.json();
}

/**
 * Logout
 */
export async function logout(token: string): Promise<void> {
  const response = await fetch(`${API_URL}/auth/logout`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    console.warn('Error en logout');
  }
}

/**
 * Valida si el token es válido
 */
export async function validarToken(token: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/auth/validar-token`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Refresca el token
 */
export async function refrescarToken(token: string): Promise<string> {
  const response = await fetch(`${API_URL}/auth/refrescar-token`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Error al refrescar token');
  }

  const data = await response.json();
  return data.token;
}
