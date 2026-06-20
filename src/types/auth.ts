// Tipos de autenticación y usuario

export interface User {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Club {
  id: string;
  nombre: string;
  descripcion: string;
  ciudad: string;
  logo?: string;
  createdBy: string; // ID del usuario que creó
  miembros: ClubMember[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ClubMember {
  userId: string;
  nombre?: string;
  email?: string;
  rol: 'admin' | 'editor' | 'visor';
  permisos: Permiso[];
  agreatedAt: Date;
}

export interface Permiso {
  id: string;
  nombre: string; // 'crear_eventos', 'editar_miembros', 'ver_reportes', etc
  descripcion: string;
}

export interface Invitacion {
  id: string;
  clubId: string;
  email: string;
  rol: 'admin' | 'editor' | 'visor';
  permisos: Permiso[];
  token: string; // Token único para aceptar
  invitadoPor: string; // ID del user que invitó
  estado: 'pendiente' | 'aceptada' | 'rechazada' | 'expirada';
  createdAt: Date;
  expiresAt: Date; // 30 días desde creación
  aceptadoAt?: Date;
}

export interface AuthContextType {
  usuario: User | null;
  clubActual: Club | null;
  clubes: Club[];
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, contraseña: string) => Promise<void>;
  logout: () => Promise<void>;
  aceptarInvitacion: (token: string, datos: AceptarInvitacionData) => Promise<void>;
  seleccionarClub: (clubId: string) => Promise<void>;
  crearClub: (datos: CrearClubData) => Promise<Club>;
  invitarMiembro: (clubId: string, email: string, rol: string, permisos: string[]) => Promise<Invitacion>;
}

export interface AceptarInvitacionData {
  nombre: string;
  apellido: string;
  contraseña: string;
}

export interface CrearClubData {
  nombre: string;
  descripcion: string;
  ciudad: string;
  logo?: File;
}

export interface LoginResponse {
  token: string;
  usuario: User;
  clubes: Club[];
}
