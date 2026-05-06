import joblib
import numpy as np
from sklearn import datasets
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score

def train_model():
    # 1. Load the Iris dataset (classic ML dataset)
    print("Loading Iris dataset...")
    iris = datasets.load_iris()
    X = iris.data
    y = iris.target

    # 2. Split data into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # 3. Initialize and train a Random Forest classifier
    print("Training Random Forest model...")
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)

    # 4. Evaluate the model
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Model trained. Accuracy: {accuracy * 100:.2f}%")

    # 5. Save the trained model to disk
    joblib.dump(model, 'model.pkl')
    print("Model saved as model.pkl")

    # Save class names for the API
    joblib.dump(iris.target_names, 'classes.pkl')

if __name__ == "__main__":
    train_model()
