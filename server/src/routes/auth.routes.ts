import { Router, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { Club } from '../models/Club';
import { ActivacionAdmin } from '../models/ActivacionAdmin';
import { Invitacion } from '../models/Invitacion';
import { AuthRequest, authMiddleware } from '../middleware/auth';
import { sendEmail } from '../utils/email';
import crypto from 'crypto';

const router = Router();

// Helper para generar token JWT
const generateToken = (userId: string, email: string) => {
  return jwt.sign(
    { id: userId, email },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// POST /api/auth/solicitar-activacion
// Solicitar código de activación para el primer admin
router.post('/solicitar-activacion', async (req: AuthRequest, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email es requerido' });
    }

    // Verificar si el usuario ya existe
    const usuarioExistente = await User.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ error: 'El usuario ya existe' });
    }

    // Generar código de 6 dígitos
    const codigo = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutos

    // Guardar/actualizar código de activación
    await ActivacionAdmin.findOneAndUpdate(
      { email },
      {
        email,
        codigo,
        estado: 'pendiente',
        expiresAt,
      },
      { upsert: true }
    );

    // Enviar email
    await sendEmail(
      email,
      'Código de Activación - Nexo Gestión',
      `Tu código de activación es: <strong>${codigo}</strong>\n\nVálido por 10 minutos.`
    );

    res.json({
      message: 'Código enviado a tu email',
      expiresIn: '10 minutos',
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al solicitar activación' });
  }
});

// POST /api/auth/completar-activacion
// Completar la activación del primer admin
router.post('/completar-activacion', async (req: AuthRequest, res: Response) => {
  try {
    const { email, codigo, nombre, apellido, contraseña } = req.body;

    if (!email || !codigo || !nombre || !apellido || !contraseña) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    // Validar código
    const activacion = await ActivacionAdmin.findOne({ email });

    if (!activacion) {
      return res.status(400).json({ error: 'Código de activación no encontrado' });
    }

    if (activacion.codigo !== codigo) {
      return res.status(400).json({ error: 'Código incorrecto' });
    }

    if (new Date() > activacion.expiresAt) {
      return res.status(400).json({ error: 'Código expirado' });
    }

    // Crear usuario
    const usuario = new User({
      email,
      nombre,
      apellido,
      password: contraseña,
    });

    await usuario.save();

    // Crear primer club
    const club = new Club({
      nombre: `Club de ${nombre}`,
      descripcion: 'Mi primer club',
      ciudad: 'Buenos Aires',
      createdBy: usuario._id,
      miembros: [
        {
          userId: usuario._id,
          rol: 'admin',
          permisos: [],
          agreatedAt: new Date(),
        },
      ],
    });

    await club.save();

    // Marcar activación como completada
    await ActivacionAdmin.findByIdAndUpdate(activacion._id, {
      estado: 'completada',
    });

    // Generar token
    const token = generateToken(usuario._id.toString(), usuario.email);

    res.json({
      token,
      usuario: {
        id: usuario._id,
        email: usuario.email,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
      },
      clubes: [
        {
          id: club._id,
          nombre: club.nombre,
          descripcion: club.descripcion,
          ciudad: club.ciudad,
          miembros: club.miembros,
        },
      ],
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al completar activación' });
  }
});

// POST /api/auth/login
router.post('/login', async (req: AuthRequest, res: Response) => {
  try {
    const { email, contraseña } = req.body;

    if (!email || !contraseña) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    const usuario = await User.findOne({ email }).select('+password');

    if (!usuario || !(await usuario.comparePassword(contraseña))) {
      return res.status(401).json({ error: 'Email o contraseña incorrectos' });
    }

    // Obtener clubes del usuario
    const clubes = await Club.find({ 'miembros.userId': usuario._id });

    const token = generateToken(usuario._id.toString(), usuario.email);

    res.json({
      token,
      usuario: {
        id: usuario._id,
        email: usuario.email,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
      },
      clubes: clubes.map((club) => ({
        id: club._id,
        nombre: club.nombre,
        descripcion: club.descripcion,
        ciudad: club.ciudad,
        logo: club.logo,
        createdBy: club.createdBy,
        miembros: club.miembros,
      })),
    });
  } catch (error) {
    res.status(500).json({ error: 'Error en login' });
  }
});

// GET /api/auth/validar-token
router.get('/validar-token', authMiddleware, (req: AuthRequest, res: Response) => {
  res.json({
    valid: true,
    user: req.user,
  });
});

// POST /api/auth/logout
router.post('/logout', authMiddleware, (req: AuthRequest, res: Response) => {
  // El logout se maneja en el frontend eliminando el token
  res.json({ message: 'Logout exitoso' });
});

export default router;
