// Tipos para interactuar con la base de datos

export interface ActivacionAdmin {
  id: string;
  email: string;
  token: string;
  estado: 'pendiente' | 'completada';
  createdAt: Date;
  expiresAt: Date; // 7 días
}

export interface UsuarioConClub {
  userId: string;
  clubId: string;
  rol: string;
  permisos: string[];
  agreatedAt: Date;
}
