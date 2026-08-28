# AgroFrost Frontend

AgroFrost Frontend is the browser client for the final AgroFrost full-stack integration. It is a framework-free application built with Vanilla TypeScript, native DOM APIs, native `fetch`, and Vite 8. It lists and creates agricultural fields persisted by the separate Spring Boot API and asks that API's Domain layer to assess frost risk.

This is an educational system, not a production frost-alert service.

## Repositories and Runtime Boundary

The frontend and backend remain independent Git repositories and run as separate processes:

- Frontend: [github.com/Felipe713/agrofrost-frontend](https://github.com/Felipe713/agrofrost-frontend)
- Backend: [github.com/Felipe713/agrofrost-api-springboot](https://github.com/Felipe713/agrofrost-api-springboot)
- Local frontend origin: `http://localhost:5173`
- Default API origin: `http://localhost:8080`

The browser never connects directly to PostgreSQL. Its integration path is:

```text
Browser -> Spring MVC -> Application -> Domain -> JPA -> PostgreSQL
Browser <- JSON/HTTP  <- Application <- Domain <- JPA <- PostgreSQL
```

The Spring Boot API is the canonical source of field data and frost-risk decisions. Only fields are persisted. Assessments are calculated by the backend from a client-supplied measured temperature and are not stored as history.

## Capabilities

- Load the persisted field collection with `GET /api/v1/fields`.
- Register a field with `POST /api/v1/fields` and render the server response.
- Keep created fields after browser refresh and service restart when the PostgreSQL volume is preserved.
- Request a Domain-owned frost assessment with `POST /api/v1/fields/{id}/assessments`.
- Render `SAFE`, `WARNING`, and `CRITICAL` results returned by the backend.
- Validate form values before sending a request and validate every remote JSON payload before use.
- Present loading, success, empty, error, and retry states.
- Use strict TypeScript without `any` and without a UI framework.

## Technology

| Area | Choice |
| --- | --- |
| Language | TypeScript 6 in strict mode |
| Development and build | Vite 8 |
| UI | Semantic HTML, CSS, native DOM APIs |
| HTTP | Native Fetch API |
| Backend | Separate Spring Boot 3 API |
| Persistence | PostgreSQL through backend JPA adapters |

Vite 8 requires Node.js `^20.19.0` or `>=22.12.0`. Use a currently supported Node release that satisfies that range.

## Quick Start

### 1. Start the backend

Follow the [backend README](https://github.com/Felipe713/agrofrost-api-springboot#quick-start). For the standard local environment, its essential commands are:

```bash
cp .env.example .env
docker compose up -d db
set -a
source .env
set +a
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

The development API listens on `http://localhost:8080`. Its default CORS allowlist includes `http://localhost:5173`.

### 2. Configure the frontend

Create a local environment file when the API does not use the default origin:

```bash
cp .env.example .env
```

```dotenv
VITE_API_BASE_URL=http://localhost:8080
```

`VITE_API_BASE_URL` is read by Vite and defaults to `http://localhost:8080`. It must identify the Spring Boot API origin, without an API path. Like every `VITE_*` value, it is exposed to browser code and must never contain credentials or secrets. Restart the development server after changing it.

### 3. Install and run

Use the lockfile for a reproducible install:

```bash
npm ci
npm run dev
```

Open the URL printed by Vite, normally `http://localhost:5173`.

### 4. Verify and build

```bash
npm run build
npm run preview
```

`npm run build` runs `tsc` before Vite and writes the deployable static assets to `dist/`. `npm run preview` is a local build check, not a production server.

## Canonical HTTP Contract

The complete API also supports `GET /api/v1/fields/{id}`; the current UI uses the following three operations:

| Method and path | Expected success | Frontend use |
| --- | --- | --- |
| `GET /api/v1/fields` | `200 FieldResponse[]` | Initial list and retry |
| `POST /api/v1/fields` | `201 FieldResponse` | Persist and render a field |
| `POST /api/v1/fields/{id}/assessments` | `200 FrostAssessmentResponse` | Ask the backend to classify risk |

The client rejects an unexpected status or JSON shape instead of trusting it. Canonical failures use `ErrorResponse`; malformed failure payloads receive a generic safe message.

### Exact DTO Overview

All properties shown below are required and non-null in the canonical contract.

```ts
interface CreateFieldRequest {
  id: string;
  name: string;
  crop: string;
  criticalTemperature: number;
}

interface FieldResponse {
  id: string;
  name: string;
  crop: string;
  criticalTemperature: number;
}

interface FrostAssessmentRequest {
  measuredTemperature: number;
}

interface FrostAssessmentResponse {
  fieldId: string;
  measuredTemperature: number;
  criticalTemperature: number;
  riskLevel: 'SAFE' | 'WARNING' | 'CRITICAL';
}

interface ErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  code: string;
  message: string;
  path: string;
}
```

`timestamp` is an ISO-8601 instant and `ErrorResponse.status` must equal the HTTP status. See [`docs/API_CONTRACT.md`](docs/API_CONTRACT.md) and the backend OpenAPI document for contract details.

## State and Failure Handling

Initial collection loading displays a loading state. A successful non-empty response renders field cards; an empty array renders the empty state. A connection, HTTP, JSON, status, or contract failure renders a safe error and exposes **Retry**, which repeats the list request.

Field creation disables the submit button while the request is active. Success resets the form, displays a persisted-success message, and adds the returned field to the current collection. Failure preserves the form values and allows another submission.

Each field card accepts a measured temperature. Assessment success replaces the pending badge with the backend result. Failure displays the API message and changes the action to **Reintentar evaluación**. These assessment results live only in current browser memory; refreshing requests the persisted fields again in an unevaluated state.

## Type Safety

`tsconfig.json` enables `strict`, `noImplicitAny`, `strictNullChecks`, `noUncheckedIndexedAccess`, unused-code checks, and no emit. The application contains no `any` usage or TypeScript suppression directives.

Remote JSON is parsed as `unknown` and narrowed through runtime guards for field arrays, field responses, assessments, and errors. DOM lookups are null-safe and narrowed to the required element class. These checks complement the backend contract; they do not replace server-side validation.

## CORS

The browser and API use different local origins, so the backend owns the CORS policy. In `dev`, `CORS_ALLOWED_ORIGINS` defaults to the exact Vite origin `http://localhost:5173`. The global `/api/**` policy allows only:

- Methods: `GET`, `POST`, `OPTIONS`
- Request headers: `Accept`, `Content-Type`
- Credentials: disabled
- Origins: explicit allowlist, never `*`

If Vite selects another port or the frontend is deployed elsewhere, set `CORS_ALLOWED_ORIGINS` on the backend to the exact frontend origin. `VITE_API_BASE_URL` and CORS solve different sides of the connection: the first tells the browser where to send requests; the second tells Spring which browser origins may read responses.

## End-to-End Verification

1. Start PostgreSQL and the backend in `dev` as described above.
2. Run `npm ci` and `npm run dev` in this repository.
3. Open `http://localhost:5173` and confirm the initial `GET /api/v1/fields` returns `200` in the Network panel.
4. Register `FIELD-E2E`, a name, a crop, and critical temperature `0`. Confirm `POST /api/v1/fields` returns `201` and the card appears.
5. Refresh the browser. Confirm `GET /api/v1/fields` still includes `FIELD-E2E`.
6. Restart the API or PostgreSQL without running `docker compose down -v`, refresh again, and confirm the field remains. This demonstrates PostgreSQL persistence rather than browser-only state.
7. Assess `FIELD-E2E` with `0.0`, `2.0`, and `2.1`. For a `0.0` threshold, confirm the backend returns `CRITICAL`, `WARNING`, and `SAFE`, respectively.
8. Stop the backend and refresh the page. Confirm the error and **Retry** action appear; restart the backend and retry successfully.
9. Confirm successful API responses include `Access-Control-Allow-Origin: http://localhost:5173` where applicable and the browser console has no CORS or integration errors.

Never use `docker compose down -v` when testing durability because it deletes the PostgreSQL volume.

## Production Notes

- Build with the production API origin already set, for example `VITE_API_BASE_URL=https://api.example.com npm run build`; Vite embeds the value in the static bundle at build time.
- Serve `dist/` from a real static host or reverse proxy. Do not use `vite` or `vite preview` as a production server.
- Configure the backend `CORS_ALLOWED_ORIGINS` with the exact HTTPS frontend origin.
- Keep database credentials and other secrets only in backend runtime configuration or a secret manager. They must not enter the frontend bundle.
- The backend `prod` profile disables Swagger/OpenAPI, uses `ddl-auto=validate`, and requires an already provisioned compatible schema and external database settings.
- Terminate TLS, set operational logging/monitoring, and apply deployment controls outside this educational repository.

## CI and Quality Gates

The backend repository has GitHub Actions CI that runs its Java 17 Maven verification and Compose validation. Locally, its equivalent quality gate is:

```bash
./mvnw --batch-mode clean verify
```

This frontend's reproducible gate is:

```bash
npm ci
npm run build
```

The versioned `.github/workflows/ci.yml` runs on pushes and pull requests to `main`, uses Node 22 with npm caching, and executes the same `npm ci` plus `npm run build` gate. A remote CI result is recorded only after an authorized publication.

## Current Limitations

- The UI supports list, create, and assess; it does not update or delete persisted fields.
- Assessments are not persisted and there is no assessment history.
- Measured temperature is entered by the user; there is no weather-provider or physical-sensor integration.
- Authentication, authorization, notifications, and multi-user isolation are not implemented.
- The frontend has no automated browser test suite; strict build checks and the documented manual E2E flow provide current frontend evidence.
- Production deployment manifests, schema migrations, observability, and operational hardening are outside the project scope.
