# 🔐 Explicación: Cómo funciona tu validación de JWT

Hola! Te explico de forma sencilla cómo tu sistema de JWT protege la aplicación.

---

## El viaje de un token JWT

### **Paso 1: El usuario inicia sesión**
Cuando alguien se loguea con su usuario y contraseña, el backend verifica que todo esté correcto:
- ✅ La contraseña se compara con un hash seguro (bcrypt)
- ✅ Si todo está bien, se genera un **token JWT** que es válido por **4 horas**

Este token es como una "credencial temporal" que dice: *"Esta persona es válida, confía en ella durante 4 horas"*.

---

## **Paso 2: El frontend guarda el token**
El navegador guarda ese token en `localStorage` para las próximas peticiones. Es como llevar un "carnet de acceso".

---

## **Paso 3: En cada petición, se valida el token**
Cada vez que el usuario intenta hacer algo (ver citas, cargar datos, etc.), el frontend envía ese token al backend con un formato especial:

```
Authorization: Bearer <el-token-aqui>
```

El middleware del backend (esa función `verificarToken()`) entonces se pregunta:

| Pregunta | Si falla... |
|----------|------------|
| ¿Viene el token en el header? | ❌ Sesión cerrada |
| ¿Tiene el formato correcto (Bearer token)? | ❌ Sesión cerrada |
| ¿El token no está vacío? | ❌ Sesión cerrada |
| ¿El token no está expirado? | ❌ Sesión cerrada |
| ¿Ha estado el usuario inactivo más de 5 minutos? | ❌ Sesión cerrada |

Si todo está OK, ✅ la petición se ejecuta normalmente.

---

## **Paso 4: Protecciones extras en el navegador**

Además del backend, hay **3 vigilantes** en el frontend que cierran la sesión automáticamente:

1. **El guardián de rutas** (`protectRoute.js`)
   - Si alguien intenta entrar al dashboard sin token → lo redirige a login

2. **El monitor de tiempo** (`sessionManager.js`)
   - Si pasas 5 minutos sin hacer nada → cierra sesión automáticamente
   - Cada 2 minutos verifica que el token siga siendo válido

3. **El interceptor de errores** (`global.js`)
   - Si el servidor devuelve un error 401 (no autorizado), limpia todo y redirige a login

---

## **¿Por qué es seguro?**

Imagina que alguien "roba" tu token. No importa, porque:
- ⏰ El token vence en 4 horas
- 👁️ Si no haces nada en 5 minutos, se cierra automáticamente
- 🔍 Si intentas usarlo después de que expire, el servidor te rechaza
- 🚨 Cualquier fallo de autenticación cierra la sesión inmediatamente

---

## **TL;DR (La versión ultra corta)**

Tu sistema funciona así:
1. **Login** → Genera un token válido por 4 horas
2. **Cada petición** → Valida que el token sea legítimo
3. **Inactividad** → Cierra sesión a los 5 minutos
4. **Token expirado** → Cierra sesión automáticamente
5. **Error de seguridad** → Cierra sesión inmediatamente

Es como un control de acceso a un edificio: verifican tu tarjeta en cada entrada, y si no la usas en mucho tiempo, caduca. 🎫

---

*Documento generado para documentar el flujo de autenticación JWT de la aplicación MeditechWeb.*
