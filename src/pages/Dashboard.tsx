import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { ChatbotWidget } from '../components/ChatbotWidget';
import './Dashboard.css';

export const Dashboard: React.FC = () => {
  const { usuario, clubActual, clubes, logout, seleccionarClub } = useAuth();
  const navigate = useNavigate();
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const [pestanaActiva, setPestanaActiva] = useState<'inicio' | 'miembros' | 'eventos' | 'reportes' | 'configuracion'>('inicio');

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleSeleccionarClub = async (clubId: string) => {
    await seleccionarClub(clubId);
    setMostrarMenu(false);
  };

  if (!usuario || !clubActual) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <button
            className="menu-toggle"
            onClick={() => setMostrarMenu(!mostrarMenu)}
            title="Menú"
          >
            ☰
          </button>
          <div className="header-title">
            <h1>🤖 Nexo Gestión</h1>
          </div>
        </div>

        <div className="header-right">
          <div className="usuario-info">
            <span className="nombre">{usuario.nombre} {usuario.apellido}</span>
            <span className="email">{usuario.email}</span>
          </div>
          <div className="usuario-avatar">
            {usuario.avatar ? (
              <img src={usuario.avatar} alt={usuario.nombre} />
            ) : (
              <div className="avatar-placeholder">
                {usuario.nombre.charAt(0)}
              </div>
            )}
          </div>
          <button
            className="logout-button"
            onClick={handleLogout}
            title="Cerrar sesión"
          >
            🚪
          </button>
        </div>
      </header>

      {/* Selector de Clubes */}
      <div className="club-selector">
        <div className="club-actual">
          <div className="club-logo">
            {clubActual.logo ? (
              <img src={clubActual.logo} alt={clubActual.nombre} />
            ) : (
              <div className="logo-placeholder">⚽</div>
            )}
          </div>
          <div className="club-info">
            <h2>{clubActual.nombre}</h2>
            <p>{clubActual.ciudad}</p>
          </div>
          <button
            className="cambiar-club-btn"
            onClick={() => setMostrarMenu(!mostrarMenu)}
            disabled={clubes.length <= 1}
            title="Cambiar club"
          >
            {clubes.length > 1 ? '↓' : '✓'}
          </button>
        </div>

        {mostrarMenu && clubes.length > 1 && (
          <div className="club-menu">
            <p className="menu-title">Mis Clubes:</p>
            {clubes.map((club) => (
              <button
                key={club.id}
                className={`club-option ${club.id === clubActual.id ? 'activo' : ''}`}
                onClick={() => handleSeleccionarClub(club.id)}
              >
                <span className="club-nombre">{club.nombre}</span>
                <span className="club-ciudad">{club.ciudad}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Contenido Principal */}
      <main className="dashboard-main">
        {/* Navegación por pestañas */}
        <nav className="dashboard-nav">
          <button
            className={`nav-item ${pestanaActiva === 'inicio' ? 'activo' : ''}`}
            onClick={() => setPestanaActiva('inicio')}
          >
            📊 Inicio
          </button>
          <button
            className={`nav-item ${pestanaActiva === 'miembros' ? 'activo' : ''}`}
            onClick={() => setPestanaActiva('miembros')}
          >
            👥 Miembros
          </button>
          <button
            className={`nav-item ${pestanaActiva === 'eventos' ? 'activo' : ''}`}
            onClick={() => setPestanaActiva('eventos')}
          >
            📅 Eventos
          </button>
          <button
            className={`nav-item ${pestanaActiva === 'reportes' ? 'activo' : ''}`}
            onClick={() => setPestanaActiva('reportes')}
          >
            📈 Reportes
          </button>
          <button
            className={`nav-item ${pestanaActiva === 'configuracion' ? 'activo' : ''}`}
            onClick={() => setPestanaActiva('configuracion')}
          >
            ⚙️ Configuración
          </button>
        </nav>

        {/* Contenido por pestañas */}
        <div className="dashboard-content">
          {pestanaActiva === 'inicio' && (
            <div className="tab-content">
              <h3>Bienvenido a {clubActual.nombre}</h3>
              <p className="descripcion">{clubActual.descripcion}</p>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">👥</div>
                  <h4>Miembros</h4>
                  <p className="stat-number">{clubActual.miembros?.length || 0}</p>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">📅</div>
                  <h4>Eventos</h4>
                  <p className="stat-number">0</p>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">💰</div>
                  <h4>Balance</h4>
                  <p className="stat-number">$0</p>
                </div>
              </div>
            </div>
          )}

          {pestanaActiva === 'miembros' && (
            <div className="tab-content">
              <div className="tab-header">
                <h3>Gestión de Miembros</h3>
                <button className="btn-primary">+ Invitar Miembro</button>
              </div>
              <div className="miembros-list">
                {clubActual.miembros && clubActual.miembros.length > 0 ? (
                  <table className="tabla-miembros">
                    <thead>
                      <tr>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Rol</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clubActual.miembros.map((miembro) => (
                        <tr key={miembro.userId}>
                          <td>{miembro.nombre || 'N/A'}</td>
                          <td>{miembro.email || 'N/A'}</td>
                          <td>
                            <span className={`rol-badge rol-${miembro.rol}`}>
                              {miembro.rol}
                            </span>
                          </td>
                          <td>
                            <button className="btn-small">Editar</button>
                            <button className="btn-small btn-danger">Remover</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="empty-state">No hay miembros aún. ¡Invita a los primeros!</p>
                )}
              </div>
            </div>
          )}

          {pestanaActiva === 'eventos' && (
            <div className="tab-content">
              <div className="tab-header">
                <h3>Eventos</h3>
                <button className="btn-primary">+ Crear Evento</button>
              </div>
              <p className="empty-state">No hay eventos aún.</p>
            </div>
          )}

          {pestanaActiva === 'reportes' && (
            <div className="tab-content">
              <h3>Reportes</h3>
              <div className="reportes-grid">
                <div className="report-card">
                  <h4>Reporte de Miembros</h4>
                  <p>Descargar en PDF o Excel</p>
                  <button className="btn-secondary">Descargar</button>
                </div>
                <div className="report-card">
                  <h4>Reporte de Eventos</h4>
                  <p>Descargar en PDF o Excel</p>
                  <button className="btn-secondary">Descargar</button>
                </div>
              </div>
            </div>
          )}

          {pestanaActiva === 'configuracion' && (
            <div className="tab-content">
              <h3>Configuración del Club</h3>
              <div className="config-section">
                <h4>Información General</h4>
                <div className="config-form">
                  <div className="form-group">
                    <label>Nombre del Club</label>
                    <input type="text" value={clubActual.nombre} disabled />
                  </div>
                  <div className="form-group">
                    <label>Ciudad</label>
                    <input type="text" value={clubActual.ciudad} disabled />
                  </div>
                  <div className="form-group">
                    <label>Descripción</label>
                    <textarea value={clubActual.descripcion} disabled></textarea>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Chatbot */}
      <ChatbotWidget />
    </div>
  );
};

export default Dashboard;
