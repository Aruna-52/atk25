import os
import joblib
import numpy as np
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from model_train import train_model

# Initialize FastAPI app
app = FastAPI(title="Iris Flower Classification API")

# Enable CORS for all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define request body schema
class IrisInput(BaseModel):
    sepal_length: float
    sepal_width: float
    petal_length: float
    petal_width: float

# Global variables for model and class names
model = None
class_names = None

@app.on_event("startup")
def startup_event():
    global model, class_names
    # Check if model exists, if not, train it automatically
    if not os.path.exists("model.pkl"):
        print("Model not found. Training model...")
        train_model()
    
    # Load the model and classes
    model = joblib.load("model.pkl")
    class_names = joblib.load("classes.pkl")
    print("Model and class names loaded successfully.")

@app.get("/")
def read_root():
    return {"message": "Welcome to the Iris Prediction API. Use /predict to get predictions."}

@app.post("/predict")
async def predict(data: IrisInput):
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded.")
    
    try:
        # Prepare input data for prediction
        input_data = np.array([[
            data.sepal_length,
            data.sepal_width,
            data.petal_length,
            data.petal_width
        ]])
        
        # Get prediction and probabilities
        prediction = model.predict(input_data)[0]
        probabilities = model.predict_proba(input_data)[0]
        
        predicted_class = class_names[prediction]
        confidence = float(np.max(probabilities))
        
        return {
            "prediction": predicted_class,
            "confidence": confidence
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    # In local development, port can be 8000
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
