# Server Setup

## Environment Configuration

Create a `.env` file in this directory with:

```env
PORT=5055
GEMINI_API_KEY=your_google_generative_ai_key
GEMINI_MODEL=gemini-2.5-pro
```

## Installation

```bash
npm install
```

## Running

**Development (with hot reload):**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

## API Endpoints

### POST /api/review
Analyzes code and provides AI-powered review with hints.

**Request:**
```json
{
  "code": "string",
  "language": "string"
}
```

**Response:**
```json
{
  "review": "string"
}
```

### POST /api/complexity
Analyzes time and space complexity of code.

**Request:**
```json
{
  "code": "string",
  "language": "string"
}
```

**Response:**
```json
{
  "summary": "string",
  "complexity": {
    "time": "string",
    "space": "string",
    "explanation": "string"
  }
}
```

### GET /health
Health check endpoint.

**Response:**
```json
{
  "ok": true
}
```

## Static Files

The server also serves the built React app from the `public/` directory at the root path.

