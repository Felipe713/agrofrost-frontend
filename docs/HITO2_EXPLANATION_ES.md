# Hito 2: explicación para defensa

> **DOCUMENTO HISTÓRICO ARCHIVADO.** Conserva evidencia del Hito 2 y describe la implementación de ese momento. Su comportamiento ya no representa la integración full-stack actual; consulta `README.md` y `docs/FINAL_FULLSTACK_EXPLANATION_ES.md` para el estado vigente.

## Fundamentos

TypeScript añade tipos estáticos a JavaScript para detectar errores antes de ejecutar. Una `interface` describe la forma de un objeto; un `enum` representa un conjunto cerrado de opciones. Por eso `FrostRiskLevel` y `RequestStatus` evitan estados escritos libremente. `any` está prohibido porque desactiva esa protección.

`AgriculturalField` representa la configuración del cuartel, `WeatherReading` una lectura remota, `FrostObservation` une ambos con el riesgo y `FieldFormPayload` separa los datos del formulario de los nodos HTML.

## Riesgo y servicio

`evaluateFrostRisk` es una función pura: si la temperatura es menor o igual al umbral es CRITICAL; hasta dos grados por encima es WARNING; sobre eso es SAFE. No toca el DOM ni red.

WeatherService construye una URL de Open-Meteo con `URL` y `URLSearchParams`, ejecuta Fetch con `async/await`, comprueba `response.ok` (éxito HTTP) y devuelve una lectura. El JSON llega como `unknown`; un type guard comprueba `current`, `temperature_2m` finita y `time` string antes de confiar en él. `try/catch` captura fallos de red, HTTP o payload y muestra un mensaje útil.

## DOM y experiencia

Una guardia de nulidad comprueba que un elemento existe antes de usarlo. Una aserción de tipo especializada expresa el tipo esperado, por ejemplo `HTMLInputElement | null`, pero se acompaña de la guardia. `preventDefault()` es la primera instrucción del submit para impedir la recarga antes de validar.

La vista usa `RequestStatus` como concepto de operación y muestra loading, success, empty y error; el error inicial ofrece reintento. Durante una consulta del formulario se deshabilita el botón y después se restaura.

## Cómo probar

Ejecuta `npm install` y `npm run dev`. Verifica las tarjetas iniciales; prueba un campo válido de Chile y luego nombre vacío, latitud 91, longitud 181 y temperatura 11. Confirma los mensajes y el cambio temporal del botón.

## Qué explicar al profesor

Explica la separación de responsabilidades: componentes sólo renderizan/capturan formulario, servicio sólo consulta red, utilidad sólo calcula riesgo y la vista coordina el DOM. Aclara que Open-Meteo no representa sensores locales y que no hay persistencia ni backend todavía.

## Preguntas posibles de defensa

1. **¿Por qué interface?** Para tipar objetos de negocio sin generar código en runtime.
2. **¿Por qué enum?** Para limitar riesgos y estados a valores válidos.
3. **¿Por qué no any?** Porque ocultaría errores de tipo.
4. **¿Qué es unknown?** Un valor que debe validarse antes de usarse.
5. **¿Qué hace response.ok?** Confirma que el estado HTTP está en el rango exitoso.
6. **¿Por qué async/await?** Hace legible el flujo asíncrono sin cadenas `.then()`.
7. **¿Qué captura try/catch?** Errores de fetch, HTTP y estructura de respuesta.
8. **¿Por qué preventDefault?** Evita la recarga automática del formulario.
9. **¿Qué es una guardia de nulidad?** Una comprobación explícita antes de acceder a un nodo posiblemente nulo.
10. **¿Qué pasa si falla la API?** Se muestra el error y se permite reintentar la carga inicial.
11. **¿Cómo se calcula WARNING?** Está sobre el umbral crítico y hasta dos grados por encima.
12. **¿Los campos se guardan?** No; son temporales hasta una futura integración backend.
