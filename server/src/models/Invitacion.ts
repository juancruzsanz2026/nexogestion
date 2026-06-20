import { Schema, model, Types } from 'mongoose';
import crypto from 'crypto';

interface IInvitacion {
  clubId: Types.ObjectId;
  email: string;
  rol: 'admin' | 'editor' | 'visor';
  permisos: Array<{ id: string; nombre: string; descripcion: string }>;
  token: string;
  invitadoPor: Types.ObjectId;
  estado: 'pendiente' | 'aceptada' | 'rechazada' | 'expirada';
  createdAt: Date;
  expiresAt: Date;
  aceptadoAt?: Date;
}

const invitacionSchema = new Schema<IInvitacion>(
  {
    clubId: {
      type: Schema.Types.ObjectId,
      ref: 'Club',
      required: true,
    },
    email: {
      type: String,
      required: [true, 'Email es requerido'],
      lowercase: true,
    },
    rol: {
      type: String,
      enum: ['admin', 'editor', 'visor'],
      default: 'visor',
    },
    permisos: [
      {
        id: String,
        nombre: String,
        descripcion: String,
      },
    ],
    token: {
      type: String,
      unique: true,
      required: true,
    },
    invitadoPor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    estado: {
      type: String,
      enum: ['pendiente', 'aceptada', 'rechazada', 'expirada'],
      default: 'pendiente',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    aceptadoAt: Date,
  },
  {
    timestamps: false,
  }
);

// Índice para eliminar automáticamente invitaciones expiradas
invitacionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Invitacion = model<IInvitacion>('Invitacion', invitacionSchema);
export type { IInvitacion };
