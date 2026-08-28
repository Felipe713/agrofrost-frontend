# AgroFrost API Contract

The Spring Boot API is the canonical source for persisted fields and frost-risk decisions. The frontend does not calculate risk and does not retain Open-Meteo coordinates or observations.

## Base URL

Local development uses `http://localhost:8080`. The frontend reads it from `VITE_API_BASE_URL`.

## Operations

| Operation | Success | Contract errors |
|---|---|---|
| `GET /api/v1/fields` | `200`, `FieldResponse[]` | `500` |
| `GET /api/v1/fields/{id}` | `200`, `FieldResponse` | `404`, `422`, `500` |
| `POST /api/v1/fields` | `201`, `FieldResponse`, relative `Location` | `400`, `422`, `500` |
| `POST /api/v1/fields/{id}/assessments` | `200`, `FrostAssessmentResponse` | `400`, `404`, `422`, `500` |

Unsupported methods return `405`.

## Field

Creation request and successful response use the same required, non-null properties:

```json
{
  "id": "field-norte",
  "name": "Parcela Norte",
  "crop": "Palto",
  "criticalTemperature": 0.0
}
```

## Frost Assessment

Request:

```json
{
  "measuredTemperature": 2.0
}
```

Response:

```json
{
  "fieldId": "field-norte",
  "measuredTemperature": 2.0,
  "criticalTemperature": 0.0,
  "riskLevel": "WARNING"
}
```

`riskLevel` is exactly `SAFE`, `WARNING`, or `CRITICAL`.

## Errors

Every canonical API error has required, non-null properties:

```json
{
  "timestamp": "2026-08-28T12:00:00Z",
  "status": 422,
  "error": "Unprocessable Entity",
  "code": "DOMAIN_RULE_VIOLATION",
  "message": "The submitted value violates a domain rule.",
  "path": "/api/v1/fields"
}
```

`timestamp` is an ISO-8601 instant and `status` matches the HTTP status. A malformed or non-canonical error body is presented with a safe generic message.
