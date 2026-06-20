import { Schema, model } from 'mongoose';

interface IActivacionAdmin {
  email: string;
  codigo: string;
  estado: 'pendiente' | 'completada';
  createdAt: Date;
  expiresAt: Date;
}

const activacionAdminSchema = new Schema<IActivacionAdmin>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    codigo: {
      type: String,
      required: true,
    },
    estado: {
      type: String,
      enum: ['pendiente', 'completada'],
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
  },
  {
    timestamps: false,
  }
);

// Eliminar automáticamente después de expirar
activacionAdminSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const ActivacionAdmin = model<IActivacionAdmin>(
  'ActivacionAdmin',
  activacionAdminSchema
);
export type { IActivacionAdmin };
