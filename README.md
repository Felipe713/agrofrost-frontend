# ❄️ AgroFrost Frontend — Frost Risk at a Glance

> 🎓 **Educational project:** This repository is the **Hito 2** frontend deliverable for a Java Full Stack bootcamp. It focuses on strict TypeScript, safe DOM manipulation, form validation, asynchronous requests, and resilient user feedback.

---

## 🌱 About the Project

**AgroFrost Frontend** is a responsive web application built with **Vanilla TypeScript and Vite**. It retrieves current meteorological temperatures for agricultural fields and compares them with each crop's critical threshold to provide a clear frost-risk classification.

The project continues the domain introduced in [AgroFrost Core](https://github.com/Felipe713/agrofrost-core), but both repositories are currently independent:

- **AgroFrost Core:** Java domain logic developed with TDD, JUnit, Mockito, and JaCoCo.
- **AgroFrost Frontend:** browser-based interface built with TypeScript, native DOM APIs, and Fetch.

No Java backend integration or data persistence is implemented yet.

---

## 🎯 Engineering Goals

This project demonstrates how to build a maintainable frontend without a framework, with special emphasis on:

1. **Strict domain modeling:** interfaces describe business data, while enums restrict frost-risk and request states.
2. **Safe browser interactions:** DOM nodes are protected with null guards and specialized type assertions.
3. **Resilient asynchronous flows:** weather requests use `async/await`, `try/catch`, `response.ok`, loading states, friendly errors, and retry behavior.
4. **Clear separation of responsibilities:** models, components, services, views, utilities, and initial data live in dedicated modules.

---

## 🔥 Main Features

- 🌡️ Loads current weather data for three Chilean agricultural fields.
- ❄️ Classifies each field as `SAFE`, `WARNING`, or `CRITICAL`.
- 🧾 Adds a temporary field through a strictly validated form.
- ⏳ Displays loading, success, empty, and error states.
- 🔁 Recovers from failed weather requests through a Retry action.
- 📱 Adapts to desktop, tablet, and mobile screens.
- ♿ Provides accessible visual feedback for forms and asynchronous operations.
- 🛡️ Validates external JSON before trusting it inside the application.

---

## 🧊 Frost Risk Model

The risk level is calculated by comparing the measured temperature with the field's critical temperature.

| Risk level | Rule | Meaning |
|---|---|---|
| `CRITICAL` | `measuredTemperature <= criticalTemperature` | The crop has reached or crossed its critical threshold. |
| `WARNING` | `measuredTemperature > criticalTemperature` and `measuredTemperature <= criticalTemperature + 2.0` | The crop is still above the threshold, but inside the precaution margin. |
| `SAFE` | `measuredTemperature > criticalTemperature + 2.0` | The temperature is above the warning margin. |

### Frost Risk Examples

Assume a field has a critical temperature of **0 °C**:

| Measured temperature | Result | Explanation |
|---:|---|---|
| `-1.0 °C` | `CRITICAL` | The measured temperature is below the critical threshold. |
| `0.0 °C` | `CRITICAL` | A temperature equal to the critical threshold is still critical. |
| `1.5 °C` | `WARNING` | The temperature is above the threshold but remains within the 2 °C warning margin. |
| `2.0 °C` | `WARNING` | The upper warning boundary is inclusive. |
| `2.1 °C` | `SAFE` | The temperature is more than 2 °C above the critical threshold. |

> The critical threshold is inclusive, and the upper warning boundary is inclusive as well. Therefore, exactly `0 °C` is `CRITICAL`, while exactly `2 °C` is still `WARNING` in this example.

---

## 🔄 From Weather Data to a Visual Decision

```text
Agricultural field configuration
              ↓
      Open-Meteo request
              ↓
 External JSON validation
              ↓
    Frost-risk calculation
              ↓
 SAFE / WARNING / CRITICAL card
```

The frontend treats remote data as `unknown`, validates the expected payload structure, creates a typed weather reading, evaluates the risk, and then renders the result in the dashboard.

---

## 🚀 Technology Stack

| Area | Technology |
|---|---|
| Language | TypeScript |
| Development server and build | Vite |
| Interface | Semantic HTML + Vanilla CSS |
| Architecture | Native ES modules |
| HTTP client | Native Fetch API |
| Weather source | Open-Meteo API |
| DOM handling | Native browser APIs |

No React, Vue, Angular, Axios, Bootstrap, Tailwind CSS, or backend framework is used.

---

## 📁 Project Structure

```text
agrofrost-frontend/
├── public/                         # Static public assets
├── src/
│   ├── components/                 # Reusable cards, form, and state views
│   │   ├── FieldCard/
│   │   ├── FieldForm/
│   │   └── StateView/
│   ├── data/
│   │   └── initialFields.ts        # Initial Chilean agricultural fields
│   ├── models/                     # Interfaces and enums
│   ├── services/
│   │   └── weather.service.ts      # Open-Meteo communication
│   ├── styles/
│   │   └── global.css              # Responsive application styles
│   ├── utils/                      # DOM, validation, type guards, and risk logic
│   ├── views/
│   │   └── frostDashboard.view.ts  # Dashboard DOM coordination
│   └── main.ts                     # Application bootstrap
├── docs/
│   ├── HITO2_CHECKLIST.md
│   └── HITO2_EXPLANATION_ES.md
├── index.html
├── package.json
├── tsconfig.json
└── README.md
```

### Module Responsibilities

- **`models`** — defines business interfaces and strict enums.
- **`components`** — creates reusable visual elements and captures form interactions.
- **`services`** — communicates with Open-Meteo and validates its response.
- **`views`** — coordinates dashboard containers and visual states.
- **`utils`** — contains pure risk logic, validators, DOM helpers, and type guards.
- **`data`** — stores the initial field configuration.
- **`main.ts`** — starts the application and orchestrates the initial loading flow.

---

## 🛡️ Strict TypeScript and Safe DOM Handling

The application keeps TypeScript protections active throughout the frontend:

- Business objects are modeled with exported `interface` declarations.
- `FrostRiskLevel` and `RequestStatus` prevent free-form state strings.
- External JSON and caught errors are handled as `unknown`.
- The source code does not use `any`.
- External JSON is checked with a type guard before use.
- DOM elements are treated as potentially `null`.
- `HTMLFormElement` and `HTMLInputElement` assertions are combined with explicit guards.
- `event.preventDefault()` stops the form from reloading the page.
- Invalid data is rejected before any weather request is sent.

---

## ⚡ Asynchronous and Resilient UI

Weather requests use modern asynchronous control:

- `async/await` keeps the flow readable.
- `try/catch` prevents network failures from breaking the page.
- `response.ok` validates the HTTP response before reading the payload.
- Loading messages guide the user while data is being requested.
- Friendly errors are displayed in the interface.
- Technical details remain available through `console.error`.
- The Retry button repeats the initial weather request after a failure.
- The form button is temporarily disabled to prevent duplicate submissions.

---

## 🛠️ Installation and Local Execution

### 1. Install dependencies

```bash
npm install
```

### 2. Start the development server

```bash
npm run dev
```

Vite will display the local URL in the terminal, usually `http://localhost:5173`.

### 3. Verify TypeScript and create the production build

```bash
npm run build
```

### 4. Preview the production build

```bash
npm run preview
```

---

## 🧪 Try the Form

Use this valid Chilean example:

| Field | Value |
|---|---|
| Field name | `Campo de prueba` |
| Crop | `Palto` |
| Latitude | `-33.60` |
| Longitude | `-70.88` |
| Critical temperature | `1` |

The application should request the current temperature, classify the frost risk, add a new card, and clear the form.

### Validation Scenarios

Try the following values one at a time:

- Empty field name.
- Empty crop.
- Latitude `91`.
- Longitude `181`.
- Critical temperature `-11`.
- Critical temperature `11`.

Invalid data must display visible feedback and must not trigger a weather request.

---

## 🧯 Test Network Failure and Recovery

1. Start the application with `npm run dev`.
2. Open the browser developer tools.
3. Block requests to `api.open-meteo.com`.
4. Reload the application.
5. Confirm that the dashboard displays a friendly error and the **Retry** button.
6. Remove the request block.
7. Press **Retry**.
8. Confirm that the three initial fields load again.

> Do not place the entire browser in Offline mode for this test, because that also blocks the local Vite application.

---

## ⚠️ Current Limitations

- No persistence is implemented.
- Fields added through the form disappear after reloading.
- The frontend is not connected to AgroFrost Core yet.
- Weather readings come from an external meteorological service.
- The readings do not represent physical sensors installed in agricultural fields.

---

## 🔗 Related Project

### [AgroFrost Core](https://github.com/Felipe713/agrofrost-core)

The Hito 1 Java domain project developed with:

- TDD
- JUnit 5
- Mockito
- JaCoCo
- Constructor dependency injection
- Pure domain architecture

Together, both repositories represent the first two stages of the AgroFrost learning project: tested Java business rules and a dynamic TypeScript frontend.
