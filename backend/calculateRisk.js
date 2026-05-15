
// Placeholder for Risk Calculation Logic
// This logic determines the risk level based on the predicted disease.
// You can expand this with more complex rules or database lookups.

function calculateRisk(disease, symptoms = []) {
    const normalizedDisease = disease ? disease.trim().toLowerCase() : "";
    
    // Normalize symptoms
    let lowerSymptoms = [];
    if (Array.isArray(symptoms)) {
        lowerSymptoms = symptoms.map(s => s ? s.toLowerCase() : "");
    } else if (typeof symptoms === 'string') {
        lowerSymptoms = [symptoms.toLowerCase()];
    }

    // High Risk Symptoms that immediately trigger 'Danger'
    const highRiskSymptoms = [
        "chest pain", "breathlessness", "shortness of breath", "high fever",
        "palpitations", "loss of consciousness"
    ];

    const hasHighRiskSymptom = lowerSymptoms.some(s => highRiskSymptoms.some(hrs => s.includes(hrs)));
    
    if (hasHighRiskSymptom) {
        return "Danger";
    }

    // High Risk: Requires immediate medical attention
    const highRiskDiseases = [
        "malaria", "dengue", "typhoid", "covid-19", "pneumonia",
        "heart disease", "hypertension", "diabetes", "jaundice", "tuberculosis", "heart attack"
    ];

    // Moderate Risk: Should consult a doctor soon
    const moderateRiskDiseases = [
        "flu", "migraine", "arthritis", "bronchial asthma",
        "chicken pox", "hepatitis a", "hepatitis b", "hepatitis c",
        "hepatitis d", "hepatitis e", "food poisoning"
    ];

    if (highRiskDiseases.includes(normalizedDisease)) {
        return "Danger";
    } else if (moderateRiskDiseases.includes(normalizedDisease)) {
        return "Medium";
    } else {
        // Default to Low for things like Common Cold, Fungal infection, etc.
        return "Low";
    }
}

module.exports = calculateRisk;
