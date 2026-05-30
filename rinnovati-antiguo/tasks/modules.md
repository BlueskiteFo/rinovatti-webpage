# Módulos opcionales — Catálogo por proyecto

Cada módulo es independiente. Al iniciar un proyecto nuevo, marcar con `[x]` los que aplican
en la sección "Activos" y copiar sus tareas al `todo.md` del proyecto.

---

## Módulos activos en este proyecto

> Marcar aquí antes de empezar. La IA leerá esto para saber qué implementar.

- [ ] WhatsApp
- [ ] Automatizaciones / Cron jobs
- [ ] Impresión / POS físico
- [ ] Comunicación POS ↔ Cocina (Realtime)
- [ ] Pagos (Culqi / Stripe)
- [ ] Reservas y agenda
- [ ] Control de inventario
- [ ] Reportes y exportación

---

## Catálogo de módulos

---

### WhatsApp

**Cuándo activarlo:** el negocio quiere enviar confirmaciones, notificaciones o atender clientes por WhatsApp.
**Proveedores:** Meta API oficial, 360dialog, Twilio, Vonage.

**Tareas a copiar en `todo.md`:**
- [ ] Definir proveedor y agregar credenciales a `.env.example`
- [ ] `src/app/api/webhooks/whatsapp/route.ts` — recibir mensajes entrantes con verificación de firma HMAC
- [ ] Crear función `sendWhatsAppMessage()` en `src/lib/whatsapp.ts` — nunca llamar la API directamente desde el webhook
- [ ] Documentar en `lessons.md`: patrón de queue para mensajes salientes (evitar timeouts)
- [ ] Probar con número de prueba del proveedor

---

### Automatizaciones / Cron jobs

**Cuándo activarlo:** el negocio necesita tareas programadas (recordatorios, reportes, limpieza de datos, sincronizaciones).
**Opciones:** Vercel Cron (simple), Supabase Edge Functions + `pg_cron` (más potente).

**Tareas a copiar en `todo.md`:**
- [ ] Decidir opción: Vercel Cron vs Supabase Edge Functions (documentar decisión en `lessons.md`)
- [ ] `src/app/api/cron/[tarea]/route.ts` — handler con validación de header secreto (`CRON_SECRET`)
- [ ] Agregar `CRON_SECRET` a `.env.example`
- [ ] Configurar schedule en `vercel.json` o en el dashboard de Supabase
- [ ] Probar que el endpoint responde correctamente y no es accesible sin el header

---

### Impresión / POS físico

**Cuándo activarlo:** el negocio necesita imprimir tickets, comandas o reportes desde la app (impresoras térmicas o normales).
**Opciones:** `window.print()` con CSS de impresión, `react-to-print`, `@react-pdf/renderer`, ESC/POS directo.

**Tareas a copiar en `todo.md`:**
- [ ] Decidir tipo de impresión: PDF visual vs ticket térmico ESC/POS (documentar en `lessons.md`)
- [ ] Crear componente `PrintLayout` en `src/components/shared/` — solo visible en `@media print`
- [ ] Si es PDF: instalar `@react-pdf/renderer` y crear template base
- [ ] Si es térmica: evaluar librería ESC/POS compatible con el modelo del cliente
- [ ] Probar en el hardware real del cliente antes de dar por terminado

---

### Comunicación POS ↔ Cocina (Realtime)

**Cuándo activarlo:** restaurantes o negocios donde caja y cocina necesitan ver pedidos en tiempo real sin refresh.
**Tecnología:** Supabase Realtime (broadcast o postgres changes).

**Tareas a copiar en `todo.md`:**
- [ ] Definir schema: tabla `pedidos` con estado (`recibido`, `en_preparacion`, `listo`, `entregado`)
- [ ] `src/hooks/useRealtimeTable.ts` — hook genérico que suscribe a cambios con filtro por `organization_id`
- [ ] Vista cocina: `src/app/cocina/page.tsx` — muestra pedidos en vivo, sin controles de caja
- [ ] Vista caja: actualiza estado del pedido → cocina lo ve al instante
- [ ] Documentar en `lessons.md`: patrón de cleanup de suscripción (evitar memory leaks en desmontaje)
- [ ] Probar con dos dispositivos simultáneos

---

### Pagos (Culqi / Stripe)

**Cuándo activarlo:** el negocio cobra en línea desde la app.
**Proveedores:** Culqi (Perú, soles), Stripe (internacional, dólares).

**Tareas a copiar en `todo.md`:**
- [ ] Definir proveedor y agregar credenciales a `.env.example`
- [ ] `src/app/api/pagos/crear-sesion/route.ts` — crea sesión de pago, retorna URL o token
- [ ] `src/app/api/webhooks/pagos/route.ts` — confirma pago con verificación de firma del proveedor
- [ ] Nunca confiar en el frontend para confirmar un pago — siempre validar desde el webhook
- [ ] Registrar cada transacción en tabla `pagos` con estado y referencia del proveedor
- [ ] Probar con tarjeta de prueba del proveedor en staging

---

### Reservas y agenda

**Cuándo activarlo:** el negocio agenda citas, turnos, reservas o cualquier slot de tiempo con recursos limitados (profesionales, mesas, salas, equipos).

**Tareas a copiar en `todo.md`:**
- [ ] Definir schema según el negocio: tablas `recursos` (profesionales, mesas, salas…), `servicios`, `reservas` con `organization_id`
- [ ] `src/app/api/disponibilidad/route.ts` — calcular slots libres según duración del servicio y reservas existentes
- [ ] `src/app/api/reservas/route.ts` — crear reserva con validación de solapamiento (Lección 003: prefixar columnas en joins)
- [ ] Vista pública de reserva (si aplica): selección de recurso → servicio → horario → confirmación
- [ ] Vista admin/staff: ver agenda del día, cancelar, reprogramar
- [ ] Notificación de confirmación (email vía Supabase o WhatsApp si ese módulo está activo)

---

### Control de inventario

**Cuándo activarlo:** el negocio necesita rastrear stock de productos, insumos o materiales.

**Tareas a copiar en `todo.md`:**
- [ ] Schema: tablas `productos`, `movimientos_stock` (entradas/salidas), `alertas_stock`
- [ ] Regla: nunca modificar stock directamente — siempre insertar un `movimiento` y calcular stock como suma
- [ ] `src/app/api/inventario/movimiento/route.ts` — registra entrada o salida con motivo y usuario
- [ ] Vista de stock actual: tabla con filtro por categoría y alerta visual si stock < mínimo
- [ ] Vista de historial de movimientos con filtro por fecha y producto
- [ ] (Opcional) Integración con módulo POS para descontar stock automáticamente al vender

---

### Reportes y exportación

**Cuándo activarlo:** el negocio necesita ver métricas o exportar datos a Excel/PDF.

**Tareas a copiar en `todo.md`:**
- [ ] Definir qué reportes necesita el cliente (ventas, reservas, stock, usuarios activos)
- [ ] `src/app/api/reportes/[tipo]/route.ts` — queries agregadas, siempre escopadas por `organization_id` y rango de fechas
- [ ] Vista de reporte con gráficos: evaluar `recharts` o `chart.js` según complejidad
- [ ] Exportación a CSV: generar en el servidor, devolver como `Content-Type: text/csv`
- [ ] Exportación a PDF: usar `@react-pdf/renderer` o impresión del navegador
- [ ] Asegurarse que los reportes solo son accesibles para roles `admin` u `owner`
