import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('❌ Error:', error);

  if (error.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Error de validación',
      details: error.message,
    });
  }

  if (error.code === 11000) {
    return res.status(400).json({
      error: 'El email ya existe',
    });
  }

  res.status(error.status || 500).json({
    error: error.message || 'Error interno del servidor',
  });
};
