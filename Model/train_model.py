import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
import pickle
import os

# 1. Expanded and Balanced Dataset
# We include 'None' to handle cases where users don't provide all 3 symptoms
data = {
    'Symptom_1': [
        'Fever', 'Cough', 'Headache', 'Fever', 'Cough', 'Fatigue', 'Chest Pain', 'Fever', 'Nausea', 'Skin rash',
        'Acidity', 'Indigestion', 'Vomiting', 'Muscle pain', 'Joint pain', 'Dizziness', 'Chills', 'Sore throat',
        'Runny nose', 'Watery eyes', 'Sneezing', 'Weakness', 'Loss of appetite', 'Body ache', 'Sweating',
        'Vomiting', 'Fever', 'Cough', 'Fatigue', 'Headache', 'Chest Pain', 'None', 'None'
    ],
    'Symptom_2': [
        'Cough', 'Headache', 'Nausea', 'Fatigue', 'Sore throat', 'Body ache', 'Shortness of breath', 'Vomiting', 'Stomach pain', 'Itching',
        'Stomach pain', 'Vomiting', 'Diarrhea', 'Weakness', 'Fatigue', 'Nausea', 'Shivering', 'Cough',
        'Sneezing', 'Redness', 'Headache', 'Dizziness', 'Nausea', 'Fever', 'Breathlessness',
        'Nausea', 'Chills', 'Sore throat', 'Weakness', 'Dizziness', 'Shortness of breath', 'None', 'None'
    ],
    'Symptom_3': [
        'Fatigue', 'Sore throat', 'Dizziness', 'Headache', 'Fever', 'Weakness', 'Sweating', 'Diarrhea', 'Vomiting', 'Redness',
        'Vomiting', 'Stomach pain', 'Dehydration', 'Stiffness', 'Swelling', 'Headache', 'Fever', 'Hoarseness',
        'Throat irritation', 'Itching', 'Runny nose', 'Fainting', 'Weight loss', 'Chills', 'Chest Pain',
        'Stomach pain', 'Sweating', 'Hoarseness', 'Body ache', 'Dizziness', 'Sweating', 'None', 'None'
    ],
    'Disease': [
        'Flu', 'Common Cold', 'Migraine', 'Typhoid', 'Flu', 'Viral Fever', 'Heart Attack', 'Malaria', 'Food Poisoning', 'Allergy',
        'GERD', 'Gastritis', 'Gastroenteritis', 'Myositis', 'Arthritis', 'Vertigo', 'Malaria', 'Tonsillitis',
        'Allergy', 'Conjunctivitis', 'Sinusitis', 'Anemia', 'Jaundice', 'Dengue', 'Panic Attack',
        'Food Poisoning', 'Dengue', 'Tonsillitis', 'Anemia', 'Migraine', 'Heart Attack', 'Healthy', 'Healthy'
    ]
}

# Add more specific disease patterns to reduce Dengue/Flu bias
extra_patterns = [
    ['Fever', 'Vomiting', 'Fatigue', 'Typhoid'],
    ['Cough', 'Shortness of breath', 'Chest Pain', 'Pneumonia'],
    ['Itching', 'Skin rash', 'Redness', 'Fungal infection'],
    ['Sneezing', 'Runny nose', 'Watery eyes', 'Allergy'],
    ['Headache', 'Nausea', 'Vomiting', 'Migraine'],
    ['Joint pain', 'Stiffness', 'Swelling', 'Arthritis'],
    ['Stomach pain', 'Diarrhea', 'Vomiting', 'Food Poisoning'],
    ['Sore throat', 'Fever', 'Hoarseness', 'Tonsillitis'],
    ['Fever', 'Chills', 'Sweating', 'Malaria'],
    ['Cough', 'Fever', 'Breathlessness', 'Pneumonia'],
    ['Fever', 'Headache', 'Body ache', 'Flu'],
    ['None', 'None', 'None', 'Healthy']
]

for p in extra_patterns:
    data['Symptom_1'].append(p[0])
    data['Symptom_2'].append(p[1])
    data['Symptom_3'].append(p[2])
    data['Disease'].append(p[3])

# Create DataFrame
df = pd.DataFrame(data)

# Normalize string case
df['Symptom_1'] = df['Symptom_1'].str.title()
df['Symptom_2'] = df['Symptom_2'].str.title()
df['Symptom_3'] = df['Symptom_3'].str.title()

# Collect all unique symptoms
all_unique_symptoms = sorted(list(set(df['Symptom_1'].tolist() + df['Symptom_2'].tolist() + df['Symptom_3'].tolist() + ['None'])))

# 2. Preprocessing with consistent Label Encoding
le = LabelEncoder()
le.fit(all_unique_symptoms)

le_disease = LabelEncoder()
df['Disease_Enc'] = le_disease.fit_transform(df['Disease'])

# Transform symptoms using the same encoder
df['S1_Enc'] = le.transform(df['Symptom_1'])
df['S2_Enc'] = le.transform(df['Symptom_2'])
df['S3_Enc'] = le.transform(df['Symptom_3'])

X = df[['S1_Enc', 'S2_Enc', 'S3_Enc']]
y = df['Disease_Enc']

# 3. Train Model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X, y)

print(f"Model trained on {len(df)} samples with {len(le_disease.classes_)} diseases.")

# 4. Save Final Model and Encoders
model_data = {
    "model_disease": model,
    "le_s1": le, 
    "le_s2": le,
    "le_s3": le,
    "le_disease": le_disease,
}

model_file = 'disease_prediction_model.pkl'
with open(model_file, 'wb') as f:
    pickle.dump(model_data, f)

print(f"Model saved as '{model_file}'")
