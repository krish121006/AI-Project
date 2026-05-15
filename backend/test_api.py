
import urllib.request
import json

url = 'http://localhost:5000/api/predict'
data = {
    "symptom1": "Fever",
    "symptom2": "Cough", 
    "symptom3": "Fatigue"
}

req = urllib.request.Request(url, 
    data=json.dumps(data).encode('utf-8'),
    headers={'Content-Type': 'application/json'},
    method='POST'
)

try:
    with urllib.request.urlopen(req) as response:
        print("Status Code:", response.status)
        content = response.read().decode('utf-8')
        print("Response:", json.loads(content))
except Exception as e:
    print(f"Error: {e}")
