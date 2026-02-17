# 🔐 Sistema de Cierre de Sesión Seguro con JWT

## 📋 Descripción General

Se ha implementado un sistema robusto de autenticación y cierre de sesión que **cierra automáticamente la sesión en caso de acceso no autorizado**. El sistema combina validaciones en el **backend (Node.js)** y el **frontend (JavaScript)**.

---

## ⚙️ Componentes Implementados

### 1. **Backend - Middleware Mejorado** (`backend/middleware/authMiddleware.js`)

El middleware `verificarToken()` ahora maneja **4 escenarios de error**:

| Escenario | Código HTTP | Acción |
|-----------|-------------|--------|
| ❌ No hay header Authorization | 401 | Logout forzado |
| ❌ Formato de token inválido (no Bearer) | 401 | Logout forzado |
| ❌ Token vacío | 401 | Logout forzado |
| ❌ Token expirado/inválido | 401 | Logout forzado |
| ⏱️ Inactividad > 5 minutos | 401 | Logout forzado |

**Respuesta estándar con logout:**
```json
{
  "message": "Token inválido o expirado",
  "reason": "token_expired",
  "logout": true
}
```

### 2. **Backend - Endpoint de Validación** (`backend/routes/users.js`)

Se agregó una nueva ruta POST para validar token desde el frontend:

```javascript
// POST /users/validar-token
// Valida que el token sea válido cada 2 minutos (desde frontend)
```

---

## 🎯 Frontend - Sistema de Protección en 4 Niveles

### **Nivel 1: Protección de Rutas** (`frontend/dashboard/scripts/protectRoute.js`)

✅ Se ejecuta **ANTES** que cualquier otro script.
- Verifica que el token exista en `localStorage`
- Si no existe → redirige a login inmediatamente
- Impide acceso a páginas del dashboard sin autenticación

```javascript
// Se carga PRIMERO en cada página del dashboard
<script src="scripts/protectRoute.js"></script>
```

### **Nivel 2: Monitoreo de Inactividad** (`frontend/dashboard/scripts/sessionManager.js`)

⏱️ Cierra sesión automáticamente si el usuario está inactivo:
- **5 minutos sin actividad** → Logout
- **4 minutos sin actividad** → Advertencia
- Detecta: clicks, scroll, teclado, touchscreen

### **Nivel 3: Validación Periódica** (`frontend/dashboard/scripts/sessionManager.js`)

🔄 Valida token cada 2 minutos con el backend:
```javascript
const VALIDATION_INTERVAL = 2 * 60 * 1000; // Cada 2 minutos

// Realiza POST a /users/validar-token
// Si recibe 401 → cierra sesión automáticamente
```

### **Nivel 4: Interceptor Global de Errores 401** (`frontend/dashboard/scripts/global.js`)

🚨 **Captura TODOS los errores 401** de cualquier fetch en la aplicación:

```javascript
// Intercepta TODAS las llamadas fetch
window.fetch = function(...args) {
    return originalFetch.apply(this, args)
        .then(response => {
            if (response.status === 401) {
                // Cierra sesión automáticamente
                localStorage.clear();
                // Redirige a login
            }
            return response;
        });
}
```

**Ventaja**: Aunque un atacante logre obtener un token expirado o inválido, cualquier intento de usar ese token resultará en logout inmediato.

---

## 🔄 Flujo de Cierre de Sesión No Autorizado

```
┌─────────────────────────────────────────────────────┐
│ Usuario intenta acceder sin token válido            │
└─────────────────────────┬───────────────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
        ▼                 ▼                 ▼
   Accede a          Intenta hacer        Token está
   dashboard sin     request HTTP con     expirado
   token             token inválido       (>4 horas)
        │                 │                 │
        │                 │                 │
        ├────────────────┼─────────────────┤
        │                │                 │
        ▼                ▼                 ▼
   protectRoute.js  Interceptor Global  sessionManager.js
   detecta ausencia  (global.js)         valida cada 2 min
   de token         captura 401          
        │                │                 │
        └────────────────┴─────────────────┘
                        │
                        ▼
          ✅ Limpia localStorage
          ✅ Detiene timers
          ✅ Muestra alerta
          ✅ Redirige a login.html
```

---

## 🛡️ Casos de Seguridad Cubiertos

| Caso | Solución |
|------|----------|
| Usuario intenta acceder a dashboard sin token | `protectRoute.js` redirige a login |
| Token expirado (>4 horas) | Backend rechaza + `sessionManager.js` cierra sesión |
| Usuario inactivo >5 min | `sessionManager.js` cierra sesión |
| Usuario con token robado intenta hacer request | `interceptor` (global.js) captura 401 |
| Session Storage corrupto o manipulado | `protectRoute.js` detecta token vacío |
| Usuario intenta editar token en localStorage | Backend rechaza en `verificarToken()` |
| Atacante intenta forzar acceso a rutas | Middleware requiere `verificarToken` en todas las rutas |

---

## 🚀 Cómo Funciona Paso a Paso

### **1. Usuario se autentica:**
```javascript
// login.js
const response = await fetch("http://localhost:9000/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id_usuario, clave })
});

// Se guarda el token
localStorage.setItem("token", data.token);
```

### **2. Usuario accede al dashboard:**
```
1. Se carga protectRoute.js → verifica token existe
2. Se carga global.js → configura interceptor de 401
3. Se carga sessionManager.js → inicia monitoreo
4. Dashboard se muestra
```

### **3. Token expira o es inválido:**
```
Opción A: Inactividad
├─ 4 min → sessionManager muestra advertencia
└─ 5 min → sessionManager cierra sesión

Opción B: Request con token inválido
├─ Backend responde 401
└─ Interceptor (global.js) captura + cierra sesión

Opción C: Validación periódica (cada 2 min)
├─ sessionManager hace POST a /validar-token
├─ Backend rechaza (401)
└─ sessionManager cierra sesión
```

### **4. Cierre de sesión:**
```javascript
function cerrarSesion(razon) {
    // 1. Limpia localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('nameUser');
    // ...
    
    // 2. Detiene timers
    detenerMonitoreoInactividad();
    detenerValidacionToken();
    
    // 3. Muestra alerta
    Swal.fire({ title: 'Sesión Cerrada' });
    
    // 4. Redirige a login
    window.location.href = '../main/login.html';
}
```

---

## 📁 Archivos Modificados

### Backend:
- ✅ `backend/middleware/authMiddleware.js` - Mejorado `verificarToken()`
- ✅ `backend/routes/users.js` - Agregado endpoint `/validar-token`

### Frontend:
- ✅ `frontend/dashboard/scripts/protectRoute.js` - **NUEVO** (protector de rutas)
- ✅ `frontend/dashboard/scripts/sessionManager.js` - Mejorado (validación periódica)
- ✅ `frontend/dashboard/scripts/global.js` - Agregado interceptor de 401
- ✅ `frontend/dashboard/dashboard-main.html` - Script `protectRoute.js` primero
- ✅ `frontend/dashboard/dashboard-citas.html` - Script `protectRoute.js` primero
- ✅ `frontend/dashboard/dashboard-usuarios.html` - Script `protectRoute.js` primero

---

## ⚙️ Configuración de Timeouts

Puedes modificar estos valores en `sessionManager.js`:

```javascript
const SESSION_TIMEOUT = 5 * 60 * 1000;      // Logout si inactivo 5 min
const WARNING_TIMEOUT = 4 * 60 * 1000;      // Advertencia a 4 min
const VALIDATION_INTERVAL = 2 * 60 * 1000;  // Validar token cada 2 min
```

---

## 🧪 Probando el Sistema

### **Prueba 1: Token Expirado**
```javascript
// Cambiar en localStorage un token válido a uno inválido
localStorage.setItem('token', 'token_fake.invalid.jwt');

// Hacer cualquier request o esperar validación periódica
// → Sistema debe cerrar sesión
```

### **Prueba 2: Sin Token**
```javascript
// Eliminar token
localStorage.removeItem('token');

// Intentar acceder a dashboard
// → protectRoute.js debe redirigir a login
```

### **Prueba 3: Inactividad**
```javascript
// Iniciar sesión normalmente
// No hacer nada durante 5 minutos
// → sessionManager debe cerrar sesión automáticamente
```

### **Prueba 4: Token Válido Pero Request Rechazado**
```javascript
// Abrir DevTools > Network
// Manipular request con Bearer token inválido
// → Backend responde 401
// → Interceptor (global.js) cierra sesión
```

---

## 🔒 Seguridad Adicional Recomendada

Para mayor seguridad en producción:

1. **HTTPS obligatorio** (JWT en headers)
2. **Agregar `httpOnly` cookies** para el token (no localStorage)
3. **Refresh tokens** con expiración corta
4. **CSRF protection** en formularios
5. **Rate limiting** en endpoint de login
6. **Logs de intentos de acceso no autorizado**

---

## 📞 Soporte

Si el usuario:
- ✅ Está inactivo 5 minutos → Se cierra sesión automáticamente
- ✅ Su token expira → Se cierra sesión al siguiente request
- ✅ Intenta acceder sin token → Se redirige a login
- ✅ Hace request con token inválido → Se cierra sesión inmediatamente

**Resultado**: Sistema robusto contra accesos no autorizados ✨
