import joblib
import pandas as pd
import json
import sys
import os

# Define relative path to models based on the overall project structure
MODEL_DIR = os.path.join("..", "..", "ai_diagnostics", "models")
MODEL_PATH = os.path.join(MODEL_DIR, "best_model.joblib")
SCALER_PATH = os.path.join(MODEL_DIR, "best_scaler.joblib")

def run():
    try:
        # Read from stdin
        input_json = sys.stdin.read()
        if not input_json.strip():
             return

        data = json.loads(input_json)
        
        # Load models
        if not os.path.exists(MODEL_PATH) or not os.path.exists(SCALER_PATH):
            print(json.dumps({"error": "Models not found"}))
            return

        model = joblib.load(MODEL_PATH)
        scaler = joblib.load(SCALER_PATH)

        # Feature columns
        columns = [
            "age", "sex", "cp", "trestbps", "chol", "fbs", "restecg", 
            "thalach", "exang", "oldpeak", "slope", "ca", "thal"
        ]
        
        # Create DataFrame
        input_data = [data.get(col) for col in columns]
        df = pd.DataFrame([input_data], columns=columns)
        
        # Scale & Predict
        input_scaled = scaler.transform(df)
        prediction = int(model.predict(input_scaled)[0])
        probabilities = model.predict_proba(input_scaled)[0]
        
        # Result mapping
        result = {
            "prediction": prediction,
            "label": "Heart Disease Detected" if prediction == 1 else "No Heart Disease Detected",
            "probability": float(probabilities[1]),
            "confidence": float(probabilities[prediction]) * 100
        }
        
        print(json.dumps(result))
        
    except Exception as e:
        print(json.dumps({"error": str(e)}))

if __name__ == "__main__":
    run()
