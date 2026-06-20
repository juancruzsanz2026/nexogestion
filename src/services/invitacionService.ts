import { Invitacion, Permiso } from '../types/auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Crea una invitación para un nuevo miembro
 */
export async function crearInvitacion(
  clubId: string,
  email: string,
  rol: 'admin' | 'editor' | 'visor',
  permisos: Permiso[],
  token: string
): Promise<Invitacion> {
  const response = await fetch(`${API_URL}/invitaciones/crear`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      clubId,
      email,
      rol,
      permisos: permisos.map(p => p.id),
    }),
  });

  if (!response.ok) {
    throw new Error('Error al crear invitación');
  }

  return response.json();
}

/**
 * Obtiene los detalles de una invitación sin autenticarse
 */
export async function obtenerInvitacion(token: string): Promise<Invitacion> {
  const response = await fetch(`${API_URL}/invitaciones/validar/${token}`);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Invitación no encontrada');
    }
    if (response.status === 410) {
      throw new Error('La invitación ha expirado');
    }
    throw new Error('Error al validar invitación');
  }

  return response.json();
}

/**
 * Acepta una invitación y crea el usuario
 */
export async function aceptarInvitacion(
  token: string,
  nombre: string,
  apellido: string,
  contraseña: string
): Promise<{
  token: string;
  usuario: any;
  clubes: any[];
}> {
  const response = await fetch(`${API_URL}/invitaciones/aceptar`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      token,
      nombre,
      apellido,
      contraseña,
    }),
  });

  if (!response.ok) {
    throw new Error('Error al aceptar invitación');
  }

  return response.json();
}

/**
 * Rechaza una invitación
 */
export async function rechazarInvitacion(token: string): Promise<void> {
  const response = await fetch(`${API_URL}/invitaciones/rechazar/${token}`, {
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error('Error al rechazar invitación');
  }
}

/**
 * Lista todas las invitaciones pendientes de un club
 */
export async function listarInvitacionesPendientes(
  clubId: string,
  token: string
): Promise<Invitacion[]> {
  const response = await fetch(
    `${API_URL}/clubes/${clubId}/invitaciones/pendientes`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Error al listar invitaciones');
  }

  return response.json();
}

/**
 * Cancela una invitación pendiente
 */
export async function cancelarInvitacion(
  invitacionId: string,
  token: string
): Promise<void> {
  const response = await fetch(
    `${API_URL}/invitaciones/${invitacionId}/cancelar`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Error al cancelar invitación');
  }
}
