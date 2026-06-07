# 🤖 Guía de Instalación - Chatbot de Asistencia Técnica

## Descripción

Chatbot simple y efectivo para responder preguntas técnicas frecuentes en tu aplicación web de gestión de clubes. No requiere IA ni APIs externas.

## 📦 Archivos Creados

```
src/
├── components/
│   ├── ChatbotWidget.tsx       # Componente principal del chat
│   └── ChatbotWidget.css       # Estilos del chatbot
├── services/
│   ├── chatbotService.ts       # Lógica de búsqueda y respuestas
│   └── knowledgeBase.ts        # Base de datos de preguntas y respuestas
```

## 🚀 Instalación

### 1. Importa el componente en tu app principal

En tu archivo principal (ej: `App.tsx` o `App.jsx`):

```typescript
import { ChatbotWidget } from './components/ChatbotWidget';

function App() {
  return (
    <div>
      {/* Tu contenido */}
      <ChatbotWidget />
    </div>
  );
}

export default App;
```

### 2. Asegúrate de que TypeScript esté configurado

Si usas TypeScript, verifica que tu `tsconfig.json` incluya:

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true
  }
}
```

### 3. Sin dependencias adicionales necesarias

El chatbot usa solo React estándar. No requiere librerías externas.

## 📝 Cómo funciona

### Búsqueda por Palabras Clave

1. **Búsqueda Exacta**: Primero busca coincidencias exactas con las palabras clave definidas
2. **Búsqueda Similar**: Si no encuentra coincidencia exacta, calcula similitud usando Jaccard Index
3. **Respuesta por Defecto**: Si no hay coincidencia, sugiere contactar a soporte

### Ejemplo

```
Usuario escribe: "¿Cómo añado un miembro?"
↓
El bot busca palabras como: "agregar", "miembro", "usuario", etc.
↓
Encuentra coincidencia en knowledgeBase
↓
Devuelve la respuesta apropiada
```

## 🔧 Personalización

### Agregar nuevas preguntas

Edita `src/services/knowledgeBase.ts`:

```typescript
{
  id: 'mi-pregunta',
  keywords: ['palabra clave 1', 'palabra clave 2', 'palabra clave 3'],
  question: '¿Cuál es mi pregunta?',
  answer: 'Mi respuesta aquí...',
  category: 'Mi Categoría',
}
```

### Cambiar estilos

Edita `src/components/ChatbotWidget.css`:

- Colores: Busca `#667eea` y `#764ba2` (gradiente actual)
- Tamaño: Busca `max-width: 420px` para cambiar ancho
- Posición: Busca `bottom: 20px; right: 20px;` para mover el botón

### Agregar emoji personalizados

En `ChatbotWidget.tsx`, busca:

```typescript
<div className="chatbot-button">
  💬  {/* Cambiar este emoji */}
</div>
```

## 📱 Características

✅ **Responsive**: Se adapta a dispositivos móviles  
✅ **Accesible**: Incluye atributos ARIA  
✅ **Animaciones**: Transiciones suaves  
✅ **Typing indicator**: Muestra cuando el bot está "escribiendo"  
✅ **Timestamps**: Muestra hora de cada mensaje  
✅ **Sin dependencias externas**: Solo React  
✅ **Búsqueda inteligente**: Por palabras clave y similitud

## 🎨 Personalización de Colores

### Paleta Actual

```css
Gradiente: #667eea → #764ba2
Fondo claro: #f7f7f7
Bordes: #e0e0e0
Texto: #333
```

### Para cambiar a otros colores

En `ChatbotWidget.css`, reemplaza:

```css
/* Antes */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Después - Ejemplo verde */
background: linear-gradient(135deg, #10b981 0%, #059669 100%);
```

## 🚨 Troubleshooting

### El chatbot no aparece

1. Verifica que `ChatbotWidget` esté importado correctamente
2. Revisa la consola del navegador (F12) para errores
3. Asegúrate que el CSS se haya importado

### Las respuestas no se muestran

1. Verifica que `knowledgeBase.ts` esté en la ruta correcta
2. Revisa que los imports sean correctos
3. Abre la consola del navegador para ver errores

### Errores de TypeScript

Si ves errores de tipos, asegúrate de:

1. Que `React` esté importado en los archivos `.tsx`
2. Que la versión de React sea 16.8+
3. Que `tsconfig.json` tenga `"jsx": "react-jsx"`

## 📊 Estadísticas de Base de Datos

- **Preguntas frecuentes**: 15+
- **Categorías**: 6 (Gestión de Clubes, Miembros, Eventos, Reportes, Seguridad, Soporte)
- **Palabras clave totales**: 50+

## 🔐 Seguridad

- Sin información sensible en el código
- Sin almacenamiento de datos del usuario
- Respetuoso con privacidad GDPR
- Puedes personalizar completamente las respuestas

## 📞 Próximos Pasos

1. ✅ Integra el chatbot en tu app
2. 📝 Personaliza las preguntas frecuentes
3. 🎨 Ajusta los colores a tu marca
4. 📊 Monitorea las preguntas que no se responden
5. 🚀 Considera agregar analytics más adelante

## 💡 Ideas para Mejorar

- Guardar preguntas no respondidas para análisis
- Agregar rating ("¿Te fue útil?")
- Integrar con analytics para ver qué preguntas son populares
- Agregar búsqueda por categoría
- Crear dashboard de admin para gestionar la base de conocimiento

## 📄 Licencia

Parte del proyecto nexogestion. Uso interno.

---

**¿Preguntas?** Contacta al equipo de desarrollo.
