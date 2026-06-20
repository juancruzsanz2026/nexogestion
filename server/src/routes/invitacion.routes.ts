import { Router, Response } from 'express';
import crypto from 'crypto';
import { Invitacion } from '../models/Invitacion';
import { User } from '../models/User';
import { Club } from '../models/Club';
import { AuthRequest, authMiddleware } from '../middleware/auth';
import { sendEmail } from '../utils/email';
import jwt from 'jsonwebtoken';

const router = Router();

// Helper para generar token JWT
const generateToken = (userId: string, email: string) => {
  return jwt.sign(
    { id: userId, email },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// POST /api/invitaciones/crear
router.post('/crear', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { clubId, email, rol, permisos } = req.body;

    if (!clubId || !email || !rol) {
      return res.status(400).json({ error: 'Datos incompletos' });
    }

    // Verificar que el usuario es admin del club
    const club = await Club.findById(clubId);
    if (!club) {
      return res.status(404).json({ error: 'Club no encontrado' });
    }

    const miembroActual = club.miembros.find(
      (m) => m.userId.toString() === req.user?.id
    );

    if (!miembroActual || miembroActual.rol !== 'admin') {
      return res.status(403).json({ error: 'No tienes permiso' });
    }

    // Generar token único
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 días

    // Crear invitación
    const invitacion = new Invitacion({
      clubId,
      email,
      rol,
      permisos: permisos || [],
      token,
      invitadoPor: req.user?.id,
      expiresAt,
    });

    await invitacion.save();

    // Enviar email
    const invitationLink = `${process.env.FRONTEND_URL}/invitacion/${token}`;
    await sendEmail(
      email,
      `Invitación a ${club.nombre} - Nexo Gestión`,
      `Has sido invitado a unirte a <strong>${club.nombre}</strong>.\n\n<a href="${invitationLink}">Aceptar invitación</a>\n\nEl link expira en 30 días.`
    );

    res.json({
      message: 'Invitación enviada',
      invitacion: {
        id: invitacion._id,
        email,
        rol,
        expiresAt,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear invitación' });
  }
});

// GET /api/invitaciones/validar/:token
router.get('/validar/:token', async (req: AuthRequest, res: Response) => {
  try {
    const { token } = req.params;

    const invitacion = await Invitacion.findOne({ token });

    if (!invitacion) {
      return res.status(404).json({ error: 'Invitación no encontrada' });
    }

    if (new Date() > invitacion.expiresAt) {
      // Marcar como expirada
      await Invitacion.findByIdAndUpdate(invitacion._id, {
        estado: 'expirada',
      });
      return res.status(410).json({ error: 'La invitación ha expirado' });
    }

    if (invitacion.estado !== 'pendiente') {
      return res.status(400).json({ error: 'La invitación ya fue procesada' });
    }

    // Obtener datos del club
    const club = await Club.findById(invitacion.clubId);

    res.json({
      id: invitacion._id,
      email: invitacion.email,
      rol: invitacion.rol,
      permisos: invitacion.permisos,
      clubId: invitacion.clubId,
      clubNombre: club?.nombre,
      estado: invitacion.estado,
      expiresAt: invitacion.expiresAt,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al validar invitación' });
  }
});

// POST /api/invitaciones/aceptar
router.post('/aceptar', async (req: AuthRequest, res: Response) => {
  try {
    const { token, nombre, apellido, contraseña } = req.body;

    if (!token || !nombre || !apellido || !contraseña) {
      return res.status(400).json({ error: 'Datos incompletos' });
    }

    const invitacion = await Invitacion.findOne({ token });

    if (!invitacion) {
      return res.status(404).json({ error: 'Invitación no encontrada' });
    }

    if (new Date() > invitacion.expiresAt) {
      await Invitacion.findByIdAndUpdate(invitacion._id, {
        estado: 'expirada',
      });
      return res.status(410).json({ error: 'La invitación ha expirado' });
    }

    if (invitacion.estado !== 'pendiente') {
      return res.status(400).json({ error: 'La invitación ya fue procesada' });
    }

    // Verificar si el usuario ya existe
    let usuario = await User.findOne({ email: invitacion.email });

    if (!usuario) {
      // Crear nuevo usuario
      usuario = new User({
        email: invitacion.email,
        nombre,
        apellido,
        password: contraseña,
      });
      await usuario.save();
    }

    // Agregar usuario al club
    const club = await Club.findById(invitacion.clubId);
    if (club) {
      const yaEsMiembro = club.miembros.some(
        (m) => m.userId.toString() === usuario!._id.toString()
      );

      if (!yaEsMiembro) {
        club.miembros.push({
          userId: usuario._id,
          rol: invitacion.rol as any,
          permisos: invitacion.permisos.map((p) => p.id),
          agreatedAt: new Date(),
        });
        await club.save();
      }
    }

    // Marcar invitación como aceptada
    await Invitacion.findByIdAndUpdate(invitacion._id, {
      estado: 'aceptada',
      aceptadoAt: new Date(),
    });

    // Obtener todos los clubes del usuario
    const clubes = await Club.find({ 'miembros.userId': usuario._id });

    // Generar token JWT
    const jwtToken = generateToken(usuario._id.toString(), usuario.email);

    res.json({
      token: jwtToken,
      usuario: {
        id: usuario._id,
        email: usuario.email,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
      },
      clubes: clubes.map((c) => ({
        id: c._id,
        nombre: c.nombre,
        descripcion: c.descripcion,
        ciudad: c.ciudad,
        logo: c.logo,
        miembros: c.miembros,
      })),
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al aceptar invitación' });
  }
});

// POST /api/invitaciones/rechazar/:token
router.post('/rechazar/:token', async (req: AuthRequest, res: Response) => {
  try {
    const { token } = req.params;

    const invitacion = await Invitacion.findOne({ token });

    if (!invitacion) {
      return res.status(404).json({ error: 'Invitación no encontrada' });
    }

    await Invitacion.findByIdAndUpdate(invitacion._id, {
      estado: 'rechazada',
    });

    res.json({ message: 'Invitación rechazada' });
  } catch (error) {
    res.status(500).json({ error: 'Error al rechazar invitación' });
  }
});

// GET /api/clubes/:clubId/invitaciones/pendientes
router.get('/clubes/:clubId/pendientes', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { clubId } = req.params;

    const invitaciones = await Invitacion.find({
      clubId,
      estado: 'pendiente',
    }).sort({ createdAt: -1 });

    res.json(invitaciones);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener invitaciones' });
  }
});

export default router;
