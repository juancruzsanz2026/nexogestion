import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { crearInvitacion } from '../services/invitacionService';
import './InvitarMiembro.css';

export const InvitarMiembro: React.FC = () => {
  const { clubActual, usuario } = useAuth();
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [email, setEmail] = useState('');
  const [rol, setRol] = useState<'admin' | 'editor' | 'visor'>('visor');
  const [permisos, setPermisos] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const permisosDisponibles = [
    { id: 'crear_eventos', nombre: 'Crear Eventos' },
    { id: 'editar_miembros', nombre: 'Editar Miembros' },
    { id: 'ver_reportes', nombre: 'Ver Reportes' },
    { id: 'eliminar_contenido', nombre: 'Eliminar Contenido' },
  ];

  const handleTogglePermiso = (permisoId: string) => {
    setPermisos((prev) =>
      prev.includes(permisoId)
        ? prev.filter((p) => p !== permisoId)
        : [...prev, permisoId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email.trim()) {
      setError('El email es requerido');
      return;
    }

    if (!clubActual) {
      setError('No hay club seleccionado');
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token no disponible');

      const permisosObj = permisosDisponibles
        .filter((p) => permisos.includes(p.id))
        .map((p) => ({ id: p.id, nombre: p.nombre, descripcion: '' }));

      await crearInvitacion(clubActual.id, email, rol, permisosObj, token);

      setSuccess(`¡Invitación enviada a ${email}!`);
      setEmail('');
      setRol('visor');
      setPermisos([]);
      setTimeout(() => {
        setMostrarFormulario(false);
        setSuccess('');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al enviar invitación');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="invitar-miembro">
      {!mostrarFormulario ? (
        <button
          className="btn-invitar"
          onClick={() => setMostrarFormulario(true)}
        >
          + Invitar Miembro
        </button>
      ) : (
        <div className="formulario-invitacion">
          <div className="form-header">
            <h4>Invitar Nuevo Miembro</h4>
            <button
              className="btn-cerrar"
              onClick={() => setMostrarFormulario(false)}
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email del usuario</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usuario@email.com"
                disabled={isLoading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="rol">Rol</label>
              <select
                id="rol"
                value={rol}
                onChange={(e) => setRol(e.target.value as any)}
                disabled={isLoading}
              >
                <option value="visor">Visor (Solo lectura)</option>
                <option value="editor">Editor (Crear y editar)</option>
                <option value="admin">Admin (Control total)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Permisos adicionales</label>
              <div className="permisos-list">
                {permisosDisponibles.map((permiso) => (
                  <label key={permiso.id} className="permiso-checkbox">
                    <input
                      type="checkbox"
                      checked={permisos.includes(permiso.id)}
                      onChange={() => handleTogglePermiso(permiso.id)}
                      disabled={isLoading}
                    />
                    <span>{permiso.nombre}</span>
                  </label>
                ))}
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <div className="form-actions">
              <button
                type="button"
                className="btn-cancelar"
                onClick={() => setMostrarFormulario(false)}
                disabled={isLoading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn-enviar"
                disabled={isLoading}
              >
                {isLoading ? 'Enviando...' : 'Enviar Invitación'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
