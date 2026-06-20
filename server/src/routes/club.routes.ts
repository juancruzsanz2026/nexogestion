import { Router, Response } from 'express';
import { Club } from '../models/Club';
import { AuthRequest, authMiddleware } from '../middleware/auth';

const router = Router();

// GET /api/clubes/:id
router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const club = await Club.findById(id)
      .populate('createdBy', 'nombre apellido email')
      .populate('miembros.userId', 'nombre apellido email avatar');

    if (!club) {
      return res.status(404).json({ error: 'Club no encontrado' });
    }

    // Verificar que el usuario es miembro del club
    const esMiembro = club.miembros.some(
      (m) => m.userId.toString() === req.user?.id
    );

    if (!esMiembro) {
      return res.status(403).json({ error: 'No tienes permiso' });
    }

    res.json(club);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener club' });
  }
});

// POST /api/clubes
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { nombre, descripcion, ciudad } = req.body;

    if (!nombre || !ciudad) {
      return res.status(400).json({ error: 'Nombre y ciudad son requeridos' });
    }

    const club = new Club({
      nombre,
      descripcion,
      ciudad,
      createdBy: req.user?.id,
      miembros: [
        {
          userId: req.user?.id,
          rol: 'admin',
          permisos: [],
          agreatedAt: new Date(),
        },
      ],
    });

    await club.save();

    res.status(201).json({
      id: club._id,
      nombre: club.nombre,
      descripcion: club.descripcion,
      ciudad: club.ciudad,
      miembros: club.miembros,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear club' });
  }
});

// PUT /api/clubes/:id
router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, ciudad } = req.body;

    const club = await Club.findById(id);

    if (!club) {
      return res.status(404).json({ error: 'Club no encontrado' });
    }

    // Verificar que es admin
    const miembro = club.miembros.find(
      (m) => m.userId.toString() === req.user?.id
    );

    if (!miembro || miembro.rol !== 'admin') {
      return res.status(403).json({ error: 'No tienes permiso' });
    }

    if (nombre) club.nombre = nombre;
    if (descripcion) club.descripcion = descripcion;
    if (ciudad) club.ciudad = ciudad;

    await club.save();

    res.json(club);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar club' });
  }
});

// DELETE /api/clubes/:id
router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const club = await Club.findById(id);

    if (!club) {
      return res.status(404).json({ error: 'Club no encontrado' });
    }

    // Verificar que es el creador
    if (club.createdBy.toString() !== req.user?.id) {
      return res.status(403).json({ error: 'No tienes permiso' });
    }

    await Club.findByIdAndDelete(id);

    res.json({ message: 'Club eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar club' });
  }
});

export default router;
