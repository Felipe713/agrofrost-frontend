# AgroFrost Frontend

Aplicación web en TypeScript Vanilla y Vite que consulta temperaturas actuales de campos agrícolas y evalúa visualmente su riesgo de helada. Continúa conceptualmente el dominio de [AgroFrost Core](https://github.com/Felipe713/agrofrost-core), pero es un frontend completamente independiente: aún no se conecta al backend Java.

## Funcionalidades

- Consulta Open-Meteo para tres campos iniciales chilenos.
- Clasifica cada lectura como `SAFE`, `WARNING` o `CRITICAL`.
- Permite agregar un campo temporal con formulario validado.
- Ofrece estados de carga, éxito, vacío y error, con reintento para la carga inicial.

## Reglas de riesgo

- `CRITICAL`: temperatura medida menor o igual a la crítica.
- `WARNING`: superior a la crítica y menor o igual a crítica + 2 °C.
- `SAFE`: superior a crítica + 2 °C.

## Tecnologías y arquitectura

TypeScript estricto, Vite, HTML semántico, CSS Vanilla, módulos ES y Fetch. La estructura separa `models`, `components`, `services`, `views`, `utils` y `data`.

Las interfaces describen datos (`AgriculturalField`, `WeatherReading`, `FrostObservation`, `FieldFormPayload`); los enums controlan riesgos y estados sin strings libres. El modo strict, las guardias de DOM y las aserciones especializadas manejan valores potencialmente nulos. El submit usa `preventDefault`, `async/await`, `try/catch` y `response.ok`; el JSON externo se recibe como `unknown` y se valida antes de utilizarse.

## API

Usa [Open-Meteo](https://open-meteo.com/), sin claves ni temperaturas simuladas. El servicio devuelve datos meteorológicos demostrativos, no lecturas de sensores instalados en terreno.

## Ejecutar

```bash
npm install
npm run dev
npm run build
npm run preview
```

Para probar el formulario, ingresa nombre y cultivo, una latitud entre -90 y 90, longitud entre -180 y 180 y temperatura crítica entre -10 y 10 °C. También prueba textos vacíos y valores fuera de rango: se mostrarán mensajes accesibles junto al formulario.

## Estados visuales

Carga inicial, éxito con tarjetas, vacío, error con botón Reintentar y confirmación/error durante el envío del formulario.

## Limitaciones

No hay persistencia: los campos añadidos desaparecen al recargar. No existe conexión al backend Java. Las temperaturas son de un servicio meteorológico externo, no de sensores físicos.
