
import pickle
import os
import json

MODEL_PATH = os.path.join(os.path.dirname(__file__), '../Model/disease_prediction_model.pkl')

try:
    with open(MODEL_PATH, 'rb') as f:
        model_data = pickle.load(f)
        
    s1_classes = model_data['le_s1'].classes_.tolist()
    s2_classes = model_data['le_s2'].classes_.tolist()
    s3_classes = model_data['le_s3'].classes_.tolist()
    
    # Combine unique symptoms
    all_symptoms = sorted(list(set(s1_classes + s2_classes + s3_classes)))
    
    print(json.dumps(all_symptoms))

except Exception as e:
    print(json.dumps({"error": str(e)}))
