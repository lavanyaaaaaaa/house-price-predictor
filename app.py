from flask import Flask, request, jsonify, render_template
import pickle
import numpy as np
import pandas as pd
import os
from datetime import datetime

app = Flask(__name__)

# Configuration
app.config['MODEL_FOLDER'] = 'models'
app.config['DATA_FOLDER'] = 'data'
os.makedirs(app.config['MODEL_FOLDER'], exist_ok=True)
os.makedirs(app.config['DATA_FOLDER'], exist_ok=True)

# Load models
models = {
    'random_forest': None,
    'linear_regression': None,
    'gradient_boosting': None
}

for model_name in models.keys():
    try:
        with open(f"{app.config['MODEL_FOLDER']}/{model_name}.pkl", 'rb') as f:
            models[model_name] = pickle.load(f)
        print(f"Loaded {model_name} model successfully")
    except Exception as e:
        print(f"Error loading {model_name} model: {str(e)}")
        models[model_name] = None

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        
        # Validate input
        required_fields = ['bedrooms', 'bathrooms', 'sqft', 'location', 'age', 'model_type']
        if not all(field in data for field in required_fields):
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Prepare features
        features = np.array([[
            int(data['bedrooms']),
            float(data['bathrooms']),
            int(data['sqft']),
            int(data['location']),
            int(data['age'])
        ]])
        
        # Get selected model
        model = models.get(data['model_type'])
        if not model:
            return jsonify({'error': 'Invalid model type'}), 400
        
        # Make prediction
        price = model.predict(features)[0]
        
        # Generate feature importance (example implementation)
        feature_importance = {
            'bedrooms': data['bedrooms'] * 5000,
            'bathrooms': data['bathrooms'] * 10000,
            'sqft': data['sqft'] * 100,
            'location': (3 - data['location']) * 20000,
            'age': (30 - min(data['age'], 30)) * 1000
        }
        
        return jsonify({
            'price': float(price),
            'feature_importance': feature_importance,
            'model_used': data['model_type'],
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)