
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
        "chest", "breath", "heart", "unconscious", "blood", "bleed", "stroke", "paralysis",
        "suicide", "faint", "seizure", "choking", "severe", "extreme", "palpitation", "lump"
    ];

    const hasHighRiskSymptom = lowerSymptoms.some(s => highRiskSymptoms.some(hrs => s.includes(hrs)));
    
    if (hasHighRiskSymptom) {
        return "Danger";
    }

    // Moderate Risk Symptoms
    const moderateRiskSymptoms = [
        "fever", "pain", "vomit", "dizzy", "nausea", "swell", "rash", "vision",
        "weak", "weight loss", "diarrhea", "infection", "burn", "ache", "cough"
    ];

    const hasModerateRiskSymptom = lowerSymptoms.some(s => moderateRiskSymptoms.some(mrs => s.includes(mrs)));

    // Disease based risks
    const highRiskDiseases = [
        "malaria", "dengue", "typhoid", "covid-19", "pneumonia",
        "heart disease", "hypertension", "diabetes", "jaundice", "tuberculosis", "heart attack"
    ];

    const moderateRiskDiseases = [
        "flu", "migraine", "arthritis", "bronchial asthma",
        "chicken pox", "hepatitis a", "hepatitis b", "hepatitis c",
        "hepatitis d", "hepatitis e", "food poisoning"
    ];

    if (highRiskDiseases.includes(normalizedDisease)) {
        return "Danger";
    } else if (moderateRiskDiseases.includes(normalizedDisease) || hasModerateRiskSymptom) {
        return "Medium";
    } else {
        return "Low";
    }
}

module.exports = calculateRisk;
