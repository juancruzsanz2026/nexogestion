import { Schema, model, Types } from 'mongoose';

interface IClub {
  nombre: string;
  descripcion: string;
  ciudad: string;
  logo?: string;
  createdBy: Types.ObjectId;
  miembros: Array<{
    userId: Types.ObjectId;
    rol: 'admin' | 'editor' | 'visor';
    permisos: string[];
    agreatedAt: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const clubSchema = new Schema<IClub>(
  {
    nombre: {
      type: String,
      required: [true, 'Nombre del club es requerido'],
    },
    descripcion: {
      type: String,
      default: '',
    },
    ciudad: {
      type: String,
      required: [true, 'Ciudad es requerida'],
    },
    logo: String,
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    miembros: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
        rol: {
          type: String,
          enum: ['admin', 'editor', 'visor'],
          default: 'visor',
        },
        permisos: [String],
        agreatedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Club = model<IClub>('Club', clubSchema);
export type { IClub };
