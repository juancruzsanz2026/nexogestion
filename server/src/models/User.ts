import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';

interface IUser {
  email: string;
  nombre: string;
  apellido: string;
  password: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, 'Email es requerido'],
      unique: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Email inválido'],
    },
    nombre: {
      type: String,
      required: [true, 'Nombre es requerido'],
    },
    apellido: {
      type: String,
      required: [true, 'Apellido es requerido'],
    },
    password: {
      type: String,
      required: [true, 'Contraseña es requerida'],
      minlength: 8,
      select: false,
    },
    avatar: String,
  },
  {
    timestamps: true,
  }
);

// Hash password antes de guardar
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(Number(process.env.BCRYPT_ROUNDS) || 10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as any);
  }
});

// Comparar contraseña
userSchema.methods.comparePassword = async function (password: string) {
  return bcrypt.compare(password, this.password);
};

export const User = model<IUser>('User', userSchema);
export type { IUser };
