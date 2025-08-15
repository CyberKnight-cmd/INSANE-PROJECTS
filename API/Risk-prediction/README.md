# AI Guardian - Real-time Risk Prediction API

AI Guardian is a safety-focused application that provides real-time risk assessment for routes. This project implements a risk prediction API that evaluates the safety of routes based on various factors.

## Features

- Real-time risk prediction for routes
- Safety score calculation based on multiple factors
- Alternative safer route suggestions
- Detailed risk explanations

## API Endpoints

### Risk Prediction

```
POST /api/risk/route
```

**Request Body:**

```json
{
  "start": "37.7749,-122.4194",
  "end": "37.7849,-122.4094",
  "mode": "walking"
}
```

**Response:**

```json
{
  "riskScore": 7.2,
  "saferAlternatives": [...],
  "explanation": "Route passes through 2 high-crime areas with poor lighting."
}
```

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env` file with required environment variables
4. Start the server: `npm start`

## Technologies

- Node.js
- Express.js
- MongoDB (for data storage)
- Various APIs for risk assessment