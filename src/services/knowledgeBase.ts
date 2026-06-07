export interface FAQItem {
  id: string;
  keywords: string[];
  question: string;
  answer: string;
  category: string;
}

export const knowledgeBase: FAQItem[] = [
  // Creación de Clubs
  {
    id: 'crear-club',
    keywords: ['crear club', 'nuevo club', 'cómo crear', 'crear organización'],
    question: '¿Cómo creo un club?',
    answer:
      'Para crear un club:\n1. Dirígete a la sección "Mis Clubes"\n2. Haz clic en "Crear Nuevo Club"\n3. Completa los datos básicos (nombre, descripción, ciudad)\n4. Sube el logo del club\n5. Configura los permisos iniciales\n6. ¡Listo! Tu club ha sido creado. Ahora puedes invitar miembros.',
    category: 'Gestión de Clubes',
  },

  {
    id: 'editar-club',
    keywords: ['editar club', 'modificar club', 'cambiar datos club'],
    question: '¿Cómo edito los datos de mi club?',
    answer:
      'Para editar tu club:\n1. Abre tu club\n2. Ve a "Configuración"\n3. Haz clic en "Editar Información"\n4. Modifica los datos que necesites (nombre, descripción, contacto)\n5. Guarda los cambios',
    category: 'Gestión de Clubes',
  },

  {
    id: 'eliminar-club',
    keywords: ['eliminar club', 'borrar club', 'eliminar organización'],
    question: '¿Cómo elimino un club?',
    answer:
      'Para eliminar un club:\n1. Ve a "Configuración" del club\n2. Baja hasta "Zona de Peligro"\n3. Haz clic en "Eliminar Club"\n4. Confirma que entiendes que esta acción es irreversible\n5. El club será eliminado completamente\n\n⚠️ Advertencia: Esta acción no se puede deshacer. Todos los datos serán eliminados.',
    category: 'Gestión de Clubes',
  },

  // Gestión de Miembros
  {
    id: 'agregar-miembro',
    keywords: ['agregar miembro', 'invitar usuario', 'nuevo miembro', 'invitar persona'],
    question: '¿Cómo agrego miembros a mi club?',
    answer:
      'Para agregar miembros:\n1. Abre tu club\n2. Ve a "Miembros"\n3. Haz clic en "Agregar Miembro"\n4. Ingresa el email del usuario\n5. Selecciona el rol (Admin, Editor, Visor)\n6. Envía la invitación\n\nEl usuario recibirá un email con la invitación para unirse.',
    category: 'Gestión de Miembros',
  },

  {
    id: 'cambiar-rol-miembro',
    keywords: [
      'cambiar rol',
      'modificar permiso',
      'cambiar permisos',
      'promover miembro',
    ],
    question: '¿Cómo cambio el rol de un miembro?',
    answer:
      'Para cambiar el rol de un miembro:\n1. Ve a "Miembros" en tu club\n2. Encuentra el miembro que deseas modificar\n3. Haz clic en los tres puntos (...)\n4. Selecciona "Cambiar Rol"\n5. Elige el nuevo rol\n6. Confirma los cambios\n\nRoles disponibles:\n- Admin: Control total\n- Editor: Puede crear y editar contenido\n- Visor: Solo puede ver información',
    category: 'Gestión de Miembros',
  },

  {
    id: 'eliminar-miembro',
    keywords: ['eliminar miembro', 'remover usuario', 'quitar miembro'],
    question: '¿Cómo elimino un miembro del club?',
    answer:
      'Para eliminar un miembro:\n1. Ve a "Miembros"\n2. Busca el miembro a eliminar\n3. Haz clic en los tres puntos (...)\n4. Selecciona "Eliminar de Club"\n5. Confirma la acción\n\nEl usuario perderá acceso inmediato al club.',
    category: 'Gestión de Miembros',
  },

  // Eventos y Actividades
  {
    id: 'crear-evento',
    keywords: ['crear evento', 'nuevo evento', 'agendar evento', 'crear actividad'],
    question: '¿Cómo creo un evento?',
    answer:
      'Para crear un evento:\n1. Ve a "Eventos" en tu club\n2. Haz clic en "Crear Evento"\n3. Completa los detalles:\n   - Nombre del evento\n   - Fecha y hora\n   - Ubicación\n   - Descripción\n4. Selecciona quién puede asistir\n5. Guarda el evento\n\nLos miembros recibirán notificación del nuevo evento.',
    category: 'Eventos',
  },

  {
    id: 'editar-evento',
    keywords: ['editar evento', 'modificar evento', 'cambiar evento'],
    question: '¿Cómo edito un evento?',
    answer:
      'Para editar un evento:\n1. Abre el evento\n2. Haz clic en "Editar"\n3. Modifica los detalles necesarios\n4. Guarda los cambios\n\nLos miembros serán notificados de los cambios importantes.',
    category: 'Eventos',
  },

  {
    id: 'cancelar-evento',
    keywords: ['cancelar evento', 'eliminar evento', 'borrar evento'],
    question: '¿Cómo cancelo un evento?',
    answer:
      'Para cancelar un evento:\n1. Abre el evento\n2. Haz clic en "Más Opciones"\n3. Selecciona "Cancelar Evento"\n4. Opcionalmente, agrega un motivo\n5. Confirma la cancelación\n\nLos asistentes recibirán una notificación de cancelación.',
    category: 'Eventos',
  },

  // Reportes y Estadísticas
  {
    id: 'generar-reporte',
    keywords: ['generar reporte', 'crear reporte', 'descargar reporte', 'reporte'],
    question: '¿Cómo genero un reporte?',
    answer:
      'Para generar un reporte:\n1. Ve a "Reportes"\n2. Elige el tipo de reporte:\n   - Miembros\n   - Eventos\n   - Asistencias\n   - Finanzas\n3. Selecciona el rango de fechas\n4. Haz clic en "Generar"\n5. Descarga en PDF o Excel\n\nLos reportes te ayudarán a analizar datos de tu club.',
    category: 'Reportes',
  },

  {
    id: 'descargar-datos',
    keywords: ['descargar datos', 'exportar datos', 'exportar información'],
    question: '¿Cómo descargo los datos de mi club?',
    answer:
      'Para descargar datos:\n1. Ve a "Configuración"\n2. Selecciona "Exportar Datos"\n3. Elige qué datos deseas exportar\n4. Selecciona el formato (CSV, Excel, JSON)\n5. Haz clic en "Descargar"\n\nTendrás acceso a todos los datos de tu club en un archivo.',
    category: 'Reportes',
  },

  // Configuración y Privacidad
  {
    id: 'cambiar-contrasena',
    keywords: ['cambiar contraseña', 'cambiar password', 'nueva contraseña'],
    question: '¿Cómo cambio mi contraseña?',
    answer:
      'Para cambiar tu contraseña:\n1. Haz clic en tu perfil (esquina superior derecha)\n2. Ve a "Configuración de Cuenta"\n3. Selecciona "Seguridad"\n4. Haz clic en "Cambiar Contraseña"\n5. Ingresa tu contraseña actual\n6. Escribe la nueva contraseña dos veces\n7. Confirma los cambios\n\nPor seguridad, usa una contraseña fuerte con mayúsculas, números y caracteres especiales.',
    category: 'Seguridad',
  },

  {
    id: 'recuperar-cuenta',
    keywords: ['recuperar cuenta', 'olvidé contraseña', 'acceso perdido', 'cuenta bloqueada'],
    question: '¿Cómo recupero mi cuenta si olvidé la contraseña?',
    answer:
      'Para recuperar tu cuenta:\n1. En la pantalla de login, haz clic en "¿Olvidaste tu contraseña?"\n2. Ingresa tu email\n3. Recibirás un email con un enlace de recuperación\n4. Haz clic en el enlace\n5. Crea una nueva contraseña\n6. Accede con tu nueva contraseña\n\nSi no recibes el email, revisa tu carpeta de spam.',
    category: 'Seguridad',
  },

  {
    id: 'privacidad-datos',
    keywords: ['privacidad', 'datos personales', 'protección datos', 'GDPR'],
    question: '¿Cómo está protegida mi información?',
    answer:
      'Tu información está protegida:\n✓ Encriptación de extremo a extremo\n✓ Cumplimiento con GDPR\n✓ Backups automáticos diarios\n✓ Acceso restringido solo a administradores\n✓ Auditoría de seguridad regularmente\n\nLee nuestra Política de Privacidad para más detalles.',
    category: 'Seguridad',
  },

  // Soporte Técnico
  {
    id: 'error-login',
    keywords: ['error login', 'no puedo acceder', 'acceso denegado', 'error de acceso'],
    question: '¿Por qué no puedo acceder a mi cuenta?',
    answer:
      'Si no puedes acceder:\n1. Verifica que el email sea correcto\n2. Asegúrate que la contraseña sea correcta\n3. Intenta desde otro navegador o dispositivo\n4. Borra cookies y caché\n5. Si aún no funciona, usa "¿Olvidaste tu contraseña?"\n\nSi el problema persiste, contacta a soporte técnico.',
    category: 'Soporte',
  },

  {
    id: 'errores-comunes',
    keywords: [
      'error',
      'problema',
      'falla',
      'no funciona',
      'bug',
      'no me deja',
    ],
    question: '¿Qué hago si encuentro un error?',
    answer:
      'Si encuentras un error:\n1. Recarga la página (F5 o Ctrl+R)\n2. Borra el caché y cookies\n3. Intenta desde otro navegador\n4. Si aún persiste:\n   - Toma una captura del error\n   - Nota la URL donde ocurrió\n   - Contacta a soporte@nexoargentina.app\n\nNuestro equipo revisará tu caso en las próximas 24 horas.',
    category: 'Soporte',
  },

  {
    id: 'contacto-soporte',
    keywords: ['contacto', 'soporte', 'ayuda', 'asistencia', 'email soporte'],
    question: '¿Cómo contacto al equipo de soporte?',
    answer:
      'Contacto de soporte:\n📧 Email: soporte@nexoargentina.app\n💬 Chat en vivo: Disponible lunes-viernes 9-18 hs\n📱 Teléfono: +54 (11) XXXX-XXXX\n🐦 Twitter: @nexoargentina\n\nTiempo de respuesta:\n- Chat: 15-30 minutos\n- Email: 24 horas\n- Teléfono: Según disponibilidad',
    category: 'Soporte',
  },
];
