
# AI Disease Prediction Backend

This backend service uses Node.js and Express to interface with a Python AI model for disease prediction.

## Prerequisites

1.  **Node.js**: Install Node.js from [nodejs.org](https://nodejs.org/).
2.  **Python**: Ensure Python is installed and added to your system PATH.
3.  **Python Libraries**: Ensure the required Python libraries are installed (e.g., `pandas`, `numpy`, `scikit-learn`).

## Setup

1.  Open a terminal in this directory (`backend`).
2.  Install Node.js dependencies:
    ```bash
    npm install
    ```

## Running the Server

1.  Start the backend server:
    ```bash
    npm start
    ```
    The server will run at `http://localhost:5000`.

## API Usage

**Endpoint:** `POST /api/predict`

**Request Body:**
```json
{
  "symptom1": "Fever",
  "symptom2": "Cough",
  "symptom3": "Fatigue"
}
```

**Response:**
```json
{
  "disease": "Common Cold",
  "risk_level": "Low",
  "original_prediction": { ... }
}
```
