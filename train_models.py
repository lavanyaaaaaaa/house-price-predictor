import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
import pickle
import os

# Create realistic sample data
def generate_sample_data(num_samples=1000):
    np.random.seed(42)
    
    data = {
        'bedrooms': np.random.randint(1, 6, num_samples),
        'bathrooms': np.random.choice([1, 1.5, 2, 2.5, 3], num_samples),
        'sqft': np.abs(np.random.normal(1500, 500, num_samples)).astype(int),
        'location': np.random.choice([0, 1, 2], num_samples, p=[0.2, 0.5, 0.3]),
        'age': np.random.randint(0, 50, num_samples)
    }
    
    df = pd.DataFrame(data)
    
    # Create realistic price formula
    df['price'] = (
        df['bedrooms'] * 5000 + 
        df['bathrooms'] * 10000 + 
        df['sqft'] * 100 + 
        (3 - df['location']) * 20000 + 
        (30 - np.minimum(df['age'], 30)) * 1000 + 
        np.random.normal(0, 20000, num_samples)
    )
    
    return df

# Train and save models
def train_and_save_models():
    # Generate data
    df = generate_sample_data()
    X = df[['bedrooms', 'bathrooms', 'sqft', 'location', 'age']]
    y = df['price']
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Train models
    model_configs = {
        'random_forest': RandomForestRegressor(n_estimators=100, random_state=42),
        'linear_regression': LinearRegression(),
        'gradient_boosting': GradientBoostingRegressor(n_estimators=100, random_state=42)
    }
    
    # Ensure models directory exists
    os.makedirs('models', exist_ok=True)
    
    # Train and save each model
    for name, model in model_configs.items():
        print(f"Training {name}...")
        model.fit(X_train, y_train)
        
        # Evaluate
        score = model.score(X_test, y_test)
        print(f"{name} R² score: {score:.3f}")
        
        # Save model
        with open(f'models/{name}.pkl', 'wb') as f:
            pickle.dump(model, f)
        print(f"Saved {name} model to models/{name}.pkl\n")

if __name__ == '__main__':
    train_and_save_models()