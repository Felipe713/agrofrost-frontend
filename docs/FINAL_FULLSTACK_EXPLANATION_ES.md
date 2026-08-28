# Guía de defensa final full-stack

## Idea central

AgroFrost integra dos repositorios independientes: un frontend Vanilla TypeScript/Vite y una API Spring Boot. El frontend no contiene la fórmula de riesgo ni persiste datos. Spring coordina los casos de uso, Domain protege las reglas y JPA adapta PostgreSQL.

```text
Browser -> Spring MVC -> Application -> Domain -> puerto Repository -> JPA -> PostgreSQL
Browser <- JSON/HTTP  <- DTO/mapper  <- resultado Domain <- adapter JPA <- PostgreSQL
```

Al abrir la página, Browser ejecuta `GET /api/v1/fields`; Spring lista entidades recuperadas por JPA y responde DTO JSON. Al registrar, Browser envía `POST /api/v1/fields`; Domain valida, JPA guarda y la respuesta `201` actualiza el panel. Después de refrescar o reiniciar sin borrar el volumen, el nuevo `GET` demuestra el ciclo PostgreSQL -> Browser.

La evaluación usa `POST /api/v1/fields/{id}/assessments`. Browser aporta `measuredTemperature`, pero Domain decide `CRITICAL`, `WARNING` o `SAFE`. El resultado no se persiste.

## Contrato canónico

La API Spring es la fuente canónica. Frontend replica únicamente DTO de transporte y valida el JSON recibido desde `unknown`:

- `CreateFieldRequest` y `FieldResponse`: `id`, `name`, `crop`, `criticalTemperature`.
- `FrostAssessmentRequest`: `measuredTemperature`.
- `FrostAssessmentResponse`: `fieldId`, `measuredTemperature`, `criticalTemperature`, `riskLevel`.
- `ErrorResponse`: `timestamp`, `status`, `error`, `code`, `message`, `path`.

Los estados exitosos esperados son `200` para listado/evaluación y `201` para creación. Si el status o la forma JSON no coincide, el frontend falla de forma segura. No hay `PUT/PATCH`: “actualizar la UI” significa renderizar la respuesta creada, no editar un registro existente.

## CORS

CORS es política del backend porque Browser llama a otro origen. Spring aplica una allowlist exacta sobre `/api/**`: `GET`, `POST`, `OPTIONS`, headers `Accept` y `Content-Type`, sin credenciales ni wildcard. En DEV permite por defecto `http://localhost:5173`; PROD debe recibir el origen real mediante `CORS_ALLOWED_ORIGINS`.

`VITE_API_BASE_URL` indica al frontend dónde está la API. No habilita CORS y no puede contener secretos porque Vite lo publica en el bundle.

## TDD y arquitectura

El cambio CORS siguió RED-GREEN-REFACTOR: primero falló el test por ausencia de configuración, luego se implementó la política mínima y finalmente se refactorizó con toda la suite verde. `./mvnw --batch-mode clean verify` protege pruebas previas, arquitectura y gates JaCoCo de 100% de líneas y ramas en Domain/Application.

La regla existe solo en `Field` dentro de Domain. Con umbral `0.0`, los bordes defendibles son `0.0 -> CRITICAL`, `2.0 -> WARNING` y `2.1 -> SAFE`. Domain/Application no dependen de Spring, JPA, Hibernate ni Jackson; Infrastructure implementa web y persistencia mediante mappers y adapters.

## Seguridad

- Secretos y credenciales de PostgreSQL pertenecen al entorno del backend, nunca al frontend ni a Git.
- CORS usa orígenes explícitos y no se presenta como autenticación.
- Errores `500` devuelven un cuerpo genérico sin stack trace, excepción ni detalles internos.
- Swagger y `/api-docs` están habilitados solo en DEV y bloqueados en PROD.
- PROD usa `ddl-auto=validate`, exige esquema previo y configuración externa.
- La ausencia de autenticación/autorización es una limitación explícita del proyecto educativo.

## Evidencia 4 + 3 + 3

| Puntaje | Qué se defiende | Evidencia repetible |
| --- | --- | --- |
| 4 integración | Contrato real, crear/listar/refrescar, PostgreSQL, evaluación backend y CORS | Network: `POST 201`, `GET 200`, refresh/restart con dato presente, tres riesgos en UI, consola limpia; `npm ci && npm run build` |
| 3 DDD/TDD | Clean Architecture, regla solo en Domain, bordes, RED-GREEN-REFACTOR y cobertura | Tests de arquitectura y límites; registro RED de CORS; `./mvnw --batch-mode clean verify` con JaCoCo |
| 3 seguridad | Configuración externa, secretos, CORS mínimo, error seguro y perfiles | `.env.example` sin secretos reales; origen/método/header rechazados; body `500` seguro; Swagger disponible en DEV y bloqueado en PROD |

No se marca evidencia remota antes de producirla: las URLs de GitHub Actions, SHA y resultado deben registrarse solamente después de publicar con autorización.

## Recorrido breve de defensa

1. Mostrar ambos repositorios y levantar PostgreSQL, backend DEV y Vite.
2. Crear un Field desde Browser y señalar `POST 201`, Controller, caso de uso, Domain, adapter JPA y fila PostgreSQL.
3. Refrescar y reiniciar sin `-v`; demostrar que `GET 200` reconstruye la UI desde PostgreSQL.
4. Evaluar `0.0`, `2.0` y `2.1`; explicar que la fórmula vive solo en Domain.
5. Mostrar headers CORS y consola limpia; detener backend para enseñar error y retry.
6. Ejecutar build frontend y `clean verify`; cerrar con perfiles DEV/PROD, error seguro y limitaciones.
