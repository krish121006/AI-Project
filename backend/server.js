const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { spawn } = require('child_process');
const path = require('path');
const calculateRisk = require('./calculateRisk');
const getRemedies = require('./remediesData');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

app.post('/api/predict', (req, res) => {
    const { symptoms } = req.body;
    let s1, s2, s3;

    if (Array.isArray(symptoms) && symptoms.length > 0) {
        s1 = symptoms[0] || "None";
        s2 = symptoms[1] || "None";
        s3 = symptoms[2] || "None";
    } else {
        s1 = req.body.symptom1 || "None";
        s2 = req.body.symptom2 || "None";
        s3 = req.body.symptom3 || "None";
    }

    if (s1 === "None" && s2 === "None" && s3 === "None") {
        return res.status(400).json({ error: "Please provide at least one symptom." });
    }

    const pythonScript = path.join(__dirname, 'get_prediction.py');
    const pythonProcess = spawn('python', [pythonScript, s1, s2, s3]);

    let dataString = '';
    let errorString = '';

    pythonProcess.stdout.on('data', (data) => {
        dataString += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
        errorString += data.toString();
        console.error(`Python STDERR: ${data}`);
    });

    pythonProcess.on('close', (code) => {
        if (code !== 0) {
            return res.status(500).json({ error: "Prediction failed", details: errorString });
        }

        try {
            const responseData = JSON.parse(dataString.trim());
            const predictions = responseData.predictions || [];

            if (predictions.length === 0) {
                return res.status(500).json({ error: "No prediction results obtained" });
            }

            const mainPrediction = predictions[0];
            let disease = mainPrediction.disease;
            
            const rawSymptoms = symptoms || [s1, s2, s3];
            const riskLevel = calculateRisk(disease, rawSymptoms);
            const { remedies, tips } = getRemedies(disease, rawSymptoms);

            // If it's a fallback prediction (100 confidence) and it doesn't really match
            if (mainPrediction.confidence === 100) {
                // If the user entered custom symptoms that triggered our keyword risk analysis
                if (riskLevel === "Danger" || riskLevel === "Medium") {
                    disease = "Unidentified Condition (Requires Attention)";
                } else {
                    disease = "General Condition (Based on Custom Symptoms)";
                }
            }

            res.json({
                disease: disease,
                risk_level: riskLevel,
                predictions: predictions.slice(0, 3),
                remedies: remedies,
                tips: tips
            });

        } catch (e) {
            res.status(500).json({ error: "Failed to parse result", raw_output: dataString });
        }
    });
});

app.listen(port, () => {
    console.log(`Backend server running at http://localhost:${port}`);
});
