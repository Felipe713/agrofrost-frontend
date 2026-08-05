# AgroFrost Frontend

AgroFrost Frontend is a TypeScript Vanilla and Vite web application that retrieves current weather data for agricultural fields and visually evaluates frost risk. It continues the agricultural domain introduced in [AgroFrost Core](https://github.com/Felipe713/agrofrost-core), while remaining a fully independent frontend project: it is not connected to the Java backend yet.

## Features

- Loads current weather data for three Chilean agricultural fields through Open-Meteo.
- Classifies each reading as `SAFE`, `WARNING`, or `CRITICAL`.
- Adds a temporary field through a validated form.
- Shows loading, success, empty, and error states.
- Provides a retry action when the initial weather request fails.

## Frost-risk rules

- `CRITICAL`: measured temperature is less than or equal to the critical temperature.
- `WARNING`: measured temperature is above the critical temperature and less than or equal to critical temperature + 2 °C.
- `SAFE`: measured temperature is above critical temperature + 2 °C.

## Technologies

- TypeScript
- Vite
- Vanilla HTML and CSS
- Native ES modules
- Fetch API
- [Open-Meteo](https://open-meteo.com/)

## Project structure

```text
src/
  components/     Reusable DOM rendering and form modules
  data/           Initial agricultural field configuration
  models/         Business interfaces and enums
  services/       Open-Meteo communication
  styles/         Global Vanilla CSS
  utils/          DOM, validation, type-guard, and risk helpers
  views/          Dashboard coordination
  main.ts         Application entry point
docs/             Spanish study and defense documentation
```

## Strict typing and safe DOM handling

Interfaces define the application data (`AgriculturalField`, `WeatherReading`, `FrostObservation`, and `FieldFormPayload`), while enums constrain frost-risk and request-state values. TypeScript runs in strict mode, including strict null checks. External JSON is first handled as `unknown` and validated through a type guard; there is zero use of `any` in the TypeScript source.

DOM references use explicit null guards and specialized type assertions such as `HTMLInputElement | null`. The form calls `preventDefault()` before reading and validating its values, preventing a page reload.

## Asynchronous behavior

Weather requests use `async/await`, `try/catch`, and `response.ok`. The interface provides visual feedback for loading, success, empty, and error conditions. A failed initial request keeps the Retry button available. Technical request details are logged to the browser console, while users receive a clear, non-technical error message.

## Installation and execution

```bash
npm install
npm run dev
npm run build
npm run preview
```

## Testing the form

Run the development server, then enter a field name and crop, a latitude between -90 and 90, a longitude between -180 and 180, and a critical temperature between -10 and 10 °C. A valid submission retrieves the current weather and adds a temporary card. Try blank text values and out-of-range numbers to verify the validation feedback.

## Testing network errors and retry

With the application open, temporarily disable network access and reload the page. The error state should display a friendly message and the Retry button. Restore the connection and select Retry to request the initial fields again. The technical failure details remain available in the browser console for diagnosis.

## Limitations

- There is no persistence.
- Added fields disappear after reload.
- There is no Java backend integration yet.
- Weather data comes from an external service, not from physical field sensors.

## Related project

[AgroFrost Core](https://github.com/Felipe713/agrofrost-core)
