# AgroFrost Frontend

AgroFrost Frontend is a web application built with TypeScript Vanilla and Vite. It retrieves current meteorological temperatures for agricultural fields and visually evaluates their frost risk. It conceptually continues the AgroFrost Core domain, but it currently works as an independent frontend and is not connected to the Java backend.

## Features

- Loading current weather data for three Chilean agricultural fields.
- Classifying frost risk as `SAFE`, `WARNING`, or `CRITICAL`.
- Adding a temporary agricultural field through a validated form.
- Displaying loading, success, empty, and error states.
- Retrying failed weather requests.
- Responsive design for desktop, tablet, and mobile.
- Accessible visual feedback for forms and asynchronous operations.

## Frost Risk Rules

- `CRITICAL`:

  `measuredTemperature <= criticalTemperature`

- `WARNING`:

  `measuredTemperature > criticalTemperature`

  and

  `measuredTemperature <= criticalTemperature + 2.0`

- `SAFE`:

  `measuredTemperature > criticalTemperature + 2.0`

## Frost Risk Examples

For a field with a critical temperature of **0 °C**:

| Measured temperature | Result | Explanation |
|---:|---|---|
| -1.0 °C | CRITICAL | The measured temperature is below the critical threshold. |
| 0.0 °C | CRITICAL | A temperature equal to the critical threshold is still critical. |
| 1.5 °C | WARNING | The temperature is above the threshold but remains within the 2 °C warning margin. |
| 2.0 °C | WARNING | The upper warning boundary is inclusive. |
| 2.1 °C | SAFE | The temperature is more than 2 °C above the critical threshold. |

The critical threshold is inclusive. The upper warning boundary is also inclusive. A measured temperature exactly equal to the critical temperature is `CRITICAL`, and a measured temperature exactly 2 °C above the critical temperature is still `WARNING`.

## Technologies

- TypeScript
- Vite
- Vanilla HTML
- Vanilla CSS
- Native ES modules
- Native Fetch API
- Open-Meteo API

## Project Structure

```text
agrofrost-frontend/
├── public/
├── src/
│   ├── components/
│   ├── data/
│   ├── models/
│   ├── services/
│   ├── styles/
│   ├── utils/
│   ├── views/
│   └── main.ts
├── docs/
├── index.html
├── package.json
├── tsconfig.json
└── README.md
```

- `models`: business interfaces and enums.
- `components`: reusable DOM rendering and form modules.
- `services`: communication with Open-Meteo.
- `views`: dashboard DOM coordination.
- `utils`: DOM helpers, validation, type guards, and frost-risk calculation.
- `data`: initial agricultural field configuration.
- `main.ts`: application entry point and bootstrap orchestration.

## Strict TypeScript

Interfaces model business data, and enums restrict frost-risk and request states. External JSON and caught errors are handled as `unknown`; external JSON is validated before it is trusted. The project does not use `any`. Strict null checks require safe DOM handling before elements are used.

## Safe DOM and Form Handling

DOM elements may be `null`, so null guards run before elements are accessed. Specialized type assertions are used for `HTMLFormElement` and `HTMLInputElement`. `event.preventDefault()` avoids the form's native page reload. Invalid form data displays visible feedback and does not trigger a weather request.

## Asynchronous Behavior

The application uses `async/await` instead of nested `.then()` calls. `try/catch` protects the interface from network failures, while `response.ok` validates the HTTP response. Loading and error messages are displayed in the DOM, and the Retry button repeats the initial weather request. Technical errors are logged to the console while user-facing messages remain friendly.

## Installation and Execution

```bash
npm install
npm run dev
npm run build
npm run preview
```

- `npm install`: installs the project dependencies.
- `npm run dev`: starts the Vite development server.
- `npm run build`: checks TypeScript and produces the production build.
- `npm run preview`: serves the generated production build locally.

## Form Testing

Use the following valid example:

- Field name: `Campo de prueba`
- Crop: `Palto`
- Latitude: `-33.60`
- Longitude: `-70.88`
- Critical temperature: `1`

Try these invalid examples as well:

- Empty field name.
- Empty crop.
- Latitude `91`.
- Longitude `181`.
- Critical temperature `-11`.
- Critical temperature `11`.

Invalid data must display visible messages and must not execute a weather request.

## Network Error and Retry Testing

1. Start the application with `npm run dev`.
2. Open browser developer tools.
3. Block requests to `api.open-meteo.com`.
4. Reload the application.
5. Confirm that a friendly error message and the Retry button appear.
6. Remove the request block.
7. Press Retry.
8. Confirm that the three agricultural fields load again.

## Limitations

- No persistence is implemented.
- Fields added through the form disappear after reloading.
- The frontend is not connected to AgroFrost Core yet.
- Weather readings come from an external meteorological service.
- The readings do not represent physical sensors installed in agricultural fields.

## Related Project

[AgroFrost Core](https://github.com/Felipe713/agrofrost-core) corresponds to the Java domain developed in Hito 1 with TDD, JUnit, Mockito, and JaCoCo.
