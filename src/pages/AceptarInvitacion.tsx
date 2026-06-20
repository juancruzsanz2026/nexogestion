import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { obtenerInvitacion } from '../services/invitacionService';
import { Invitacion } from '../types/auth';
import './AceptarInvitacion.css';

export const AceptarInvitacion: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { aceptarInvitacion, isLoading } = useAuth();

  const [invitacion, setInvitacion] = useState<Invitacion | null>(null);
  const [error, setError] = useState('');
  const [paso, setPaso] = useState<'cargando' | 'validar' | 'registrar'>('cargando');

  // Datos del formulario
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [confirmarContraseña, setConfirmarContraseña] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Validar token y obtener invitación
  useEffect(() => {
    const validarInvitacion = async () => {
      if (!token) {
        setError('Token de invitación no proporcionado');
        setPaso('validar');
        return;
      }

      try {
        const inv = await obtenerInvitacion(token);
        setInvitacion(inv);
        setPaso('registrar');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error validando invitación');
        setPaso('validar');
      }
    };

    validarInvitacion();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validaciones
    if (!nombre.trim()) {
      setError('El nombre es requerido');
      return;
    }
    if (!apellido.trim()) {
      setError('El apellido es requerido');
      return;
    }
    if (contraseña.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }
    if (contraseña !== confirmarContraseña) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      if (!token) throw new Error('Token no disponible');
      await aceptarInvitacion(token, nombre, apellido, contraseña);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al aceptar invitación');
    }
  };

  if (paso === 'cargando') {
    return (
      <div className="invitacion-container">
        <div className="invitacion-box">
          <div className="loading">Validando invitación...</div>
        </div>
      </div>
    );
  }

  if (paso === 'validar' || error) {
    return (
      <div className="invitacion-container">
        <div className="invitacion-box">
          <h2>❌ Invitación no válida</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/login')} className="button-primary">
            Volver a login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="invitacion-container">
      <div className="invitacion-box">
        <div className="invitacion-header">
          <h1>✅ ¡Bienvenido!</h1>
          <p>
            Has sido invitado a unirte a <strong>{invitacion?.clubId}</strong>
          </p>
          <p className="rol-badge">Rol: {invitacion?.rol}</p>
        </div>

        <form onSubmit={handleSubmit} className="invitacion-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nombre">Nombre</label>
              <input
                id="nombre"
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Juan"
                disabled={isLoading}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="apellido">Apellido</label>
              <input
                id="apellido"
                type="text"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                placeholder="García"
                disabled={isLoading}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="contraseña">Contraseña</label>
            <div className="password-input">
              <input
                id="contraseña"
                type={showPassword ? 'text' : 'password'}
                value={contraseña}
                onChange={(e) => setContraseña(e.target.value)}
                placeholder="••••••••"
                disabled={isLoading}
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            <small>Mínimo 8 caracteres</small>
          </div>

          <div className="form-group">
            <label htmlFor="confirmar">Confirmar contraseña</label>
            <input
              id="confirmar"
              type={showPassword ? 'text' : 'password'}
              value={confirmarContraseña}
              onChange={(e) => setConfirmarContraseña(e.target.value)}
              placeholder="••••••••"
              disabled={isLoading}
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button
            type="submit"
            className="button-primary"
            disabled={isLoading}
          >
            {isLoading ? 'Creando cuenta...' : 'Crear cuenta y unirme'}
          </button>
        </form>

        <div className="invitacion-footer">
          <p>
            ¿Ya tienes cuenta?{' '}
            <a href="/login">Inicia sesión aquí</a>
          </p>
        </div>
      </div>
    </div>
  );
};
