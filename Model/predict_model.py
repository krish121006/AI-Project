import pickle
import pandas as pd
import numpy as np

def predict_disease(symptom1, symptom2, symptom3):
    # 1. Load the model and encoders
    try:
        with open('disease_prediction_model.pkl', 'rb') as f:
            model_data = pickle.load(f)
    except FileNotFoundError:
        print("Model file not found. Please run 'train_model.py' first.")
        return

    model_disease = model_data['model_disease']
    model_risk = model_data['model_risk']
    le_s1 = model_data['le_s1']
    le_s2 = model_data['le_s2']
    le_s3 = model_data['le_s3']
    le_disease = model_data['le_disease']
    le_risk = model_data['le_risk']

    # 2. Preprocess Input Symptoms
    # IMPORTANT: We use the same LabelEncoders used during training.
    # If a symptom is new (unseen during training), we handle it gracefully or use a generic "Unknown" label if possible.
    # Here, we assume the user enters known symptoms for simplicity.
    
    try:
        s1_encoded = le_s1.transform([symptom1])[0]
    except ValueError:
        print(f"Warning: Symptom '{symptom1}' not recognized in Symptom 1 list. Using mode.")
        s1_encoded = le_s1.transform([le_s1.classes_[0]])[0] # Default to first class if unknown
        
    try:
        s2_encoded = le_s2.transform([symptom2])[0]
    except ValueError:
        print(f"Warning: Symptom '{symptom2}' not recognized in Symptom 2 list. Using mode.")
        s2_encoded = le_s2.transform([le_s2.classes_[0]])[0]

    try:
        s3_encoded = le_s3.transform([symptom3])[0]
    except ValueError:
        print(f"Warning: Symptom '{symptom3}' not recognized in Symptom 3 list. Using mode.")
        s3_encoded = le_s3.transform([le_s3.classes_[0]])[0]

    input_data = [[s1_encoded, s2_encoded, s3_encoded]]

    # 3. Predict Disease and Risk Level
    predicted_disease_encoded = model_disease.predict(input_data)
    predicted_risk_encoded = model_risk.predict(input_data)

    predicted_disease = le_disease.inverse_transform(predicted_disease_encoded)[0]
    predicted_risk = le_risk.inverse_transform(predicted_risk_encoded)[0]

    print(f"\n--- Prediction Results ---")
    print(f"Symptoms: {symptom1}, {symptom2}, {symptom3}")
    print(f"Predicted Disease: {predicted_disease}")
    print(f"Risk Level: {predicted_risk}")

def main():
    print("Welcome to the Symptom Checker AI")
    print("Enter 3 symptoms from the list (e.g., Fever, Cough, Headache, Fatigue, etc.)")
    
    s1 = input("Enter Symptom 1: ")
    s2 = input("Enter Symptom 2: ")
    s3 = input("Enter Symptom 3: ")

    if not s1 or not s2 or not s3:
        print("Using default values for demonstration...")
        s1 = "Fever"
        s2 = "Cough"
        s3 = "Fatigue"

    predict_disease(s1, s2, s3)

if __name__ == "__main__":
    main()
