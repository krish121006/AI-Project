# AI Health Predictor

An advanced AI-powered health prediction web application that analyzes user symptoms to predict potential diseases, calculate risk levels, and provide home care remedies.

## 🚀 Features
- **Symptom Analysis:** Users can select or search for symptoms they are experiencing.
- **AI Disease Prediction:** Utilizes a trained Machine Learning model to predict top possible diseases with confidence scores.
- **Dynamic Risk Level:** Calculates health risk (Low, Medium, Danger) based on the specific symptoms and predicted diseases in real-time.
- **Multilingual Chatbot:** A built-in AI chat assistant that responds in the same language the user asks their question (supports English, Hindi, Hinglish, and Gujarati).
- **Downloadable Reports:** Generates a comprehensive and clean PDF health report that users can download.
- **Remedies & Recommendations:** Provides home remedies, health tips, and basic medical advice tailored to the specific condition.

## 💻 Tech Stack
- **Frontend:** HTML5, CSS3, Vanilla JavaScript, jsPDF (for PDF generation)
- **Backend:** Node.js, Express.js
- **Machine Learning:** Python, scikit-learn (Pickle model)

## 📂 Project Structure
- `/Frontend`: Contains the web interface (HTML, CSS, JS) and the frontend server.
- `/backend`: Contains the Node.js API server (`server.js`) that handles requests and calls the ML model.
- `/Model`: Contains the Python machine learning scripts (`predict_model.py`) and the trained model file (`disease_prediction_model.pkl`).

## 🛠️ How to Run Locally

### Prerequisites
- [Node.js](https://nodejs.org/)
- [Python 3.x](https://www.python.org/)

### 1. Start the Backend Server
```bash
cd backend
npm install
node server.js
```
*The backend server will run on `http://localhost:5000`.*

### 2. Start the Frontend Server
```bash
cd Frontend
node serve_frontend.js
```
*The frontend application will be available at `http://localhost:3000`.*
