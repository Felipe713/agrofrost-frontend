# Checklist de revisión Hito 2

## Pilar 1: Modelado y tipado estricto

- [x] Interfaces exportadas y usadas para los modelos.
- [x] Enums `FrostRiskLevel` y `RequestStatus` exportados.
- [x] Cero `any` en TypeScript (verificado con ripgrep).
- [x] TypeScript strict y opciones adicionales configuradas.
- [x] Riesgo controlado por enum, sin strings libres.

## Pilar 2: DOM y formulario

- [x] Guardias de nulidad y utilidad de elemento requerido.
- [x] Aserciones especializadas para formulario e inputs.
- [x] Submit con `addEventListener`.
- [x] `preventDefault` como primera instrucción.
- [x] Validación de presencia de nombre y cultivo.
- [x] Validaciones de rangos numéricos.
- [x] Mensajes visibles con `aria-live`.

## Pilar 3: Asincronía

- [x] Funciones `async` y `await`.
- [x] Fetch hacia Open-Meteo.
- [x] Verificación de `response.ok`.
- [x] `try/catch` con error `unknown`.
- [x] JSON validado desde `unknown` mediante type guard.
- [x] Loading visible.
- [x] Error visible y reintento inicial.
- [x] Feedback y deshabilitación al enviar formulario.

## Entregable

- [x] README en español.
- [x] `npm install`, `npm run dev` y `npm run build` documentados.
- [ ] Repositorio GitHub público (pendiente de poder inicializar Git en este entorno).
