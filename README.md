# House Price Predictor

A machine learning web application that predicts house prices based on property features.


## Features

- Multiple ML models (Random Forest, Linear Regression, Gradient Boosting)
- Interactive visualizations
- Prediction history tracking
- Analytics dashboard
- Export functionality (CSV/JSON)

## Technologies

- Python (Flask)
- JavaScript (Chart.js)
- Bootstrap 5
- Scikit-learn

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/house-price-predictor.git
   cd house-price-predictor
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Train models:
   ```bash
   python train_models.py
   ```

4. Run the application:
   ```bash
   python app.py
   ```

5. Open `http://localhost:5000` in your browser

## Requirements

Create a `requirements.txt` file with:

```
flask==2.1.0
scikit-learn==1.0.2
numpy==1.22.0
pandas==1.4.0
```

Then run:
```bash
pip install -r requirements.txt
```