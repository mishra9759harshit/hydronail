
# SMART WATER RECOVERY & REUSE - ML INTEGRATION GUIDE
=====================================================

## Overview
This guide explains how to integrate the 5 AI/ML models into your water treatment dashboard.

## Model Summary

### Model 1: Treatment Efficiency Predictor
- **Purpose**: Predict treatment efficiency for all three stages
- **Inputs**: 10 parameters (influent quality, chemical dosing, environmental)
- **Outputs**: Primary, secondary, tertiary, and overall efficiency percentages
- **Accuracy**: R² = 0.35-0.60, MAE = 0.8-1.6%
- **Use Case**: Real-time efficiency monitoring, predictive maintenance

### Model 2: Anomaly Detection System
- **Purpose**: Detect abnormal operating conditions
- **Algorithm**: Isolation Forest
- **Inputs**: 8 real-time parameters
- **Outputs**: Anomaly flag, severity, affected parameters
- **Accuracy**: 5% detection rate (configurable)
- **Use Case**: Early warning system, quality assurance

### Model 3: Chemical Dosing Optimizer
- **Purpose**: Optimize chemical usage and reduce costs
- **Inputs**: 4 water quality parameters
- **Outputs**: Optimal coagulant and chlorine dosages
- **Accuracy**: R² = 0.92 (coagulant), MAE = 1.5 mg/L
- **Use Case**: Cost reduction, process optimization

### Model 4: Resource Recovery Maximizer
- **Purpose**: Maximize biogas and nutrient recovery
- **Inputs**: 6 sludge and digester parameters
- **Outputs**: Predicted biogas, nitrogen, phosphorus, economic value
- **Accuracy**: R² = 0.87-0.99, high reliability
- **Use Case**: Circular economy optimization, revenue maximization

### Model 5: Energy Consumption Optimizer
- **Purpose**: Minimize energy costs while maintaining performance
- **Inputs**: 5 operational parameters
- **Outputs**: Current vs optimized consumption, cost savings
- **Accuracy**: R² = 0.94, MAE = 68 kWh/day
- **Use Case**: Energy management, cost control

## Integration Steps

### Step 1: Install Dependencies
```bash
pip install numpy pandas scikit-learn
```

### Step 2: Import ML API
```python
from water_treatment_ml_api import WaterTreatmentMLAPI

# Initialize API
ml_api = WaterTreatmentMLAPI()
```

### Step 3: Call Models

#### A. Treatment Efficiency Prediction
```python
efficiency = ml_api.predict_treatment_efficiency(
    influent_turbidity=155,
    influent_bod=245,
    influent_cod=460,
    influent_tss=185,
    flow_rate=360,
    chemical_dose_coagulant=42,
    chemical_dose_chlorine=3.4,
    temperature=26,
    ph_level=7.1,
    do_level=6.7
)

print(f"Primary: {efficiency['primary_efficiency']:.1f}%")
print(f"Secondary: {efficiency['secondary_efficiency']:.1f}%")
print(f"Tertiary: {efficiency['tertiary_efficiency']:.1f}%")
```

#### B. Anomaly Detection
```python
anomalies = ml_api.detect_anomalies(
    turbidity=12.5,
    bod=22,
    cod=48,
    tss_removal=89,
    do_level=4.2,  # Low DO
    flow_rate=355,
    ph_level=7.2,
    temperature=25
)

if anomalies['is_anomaly']:
    for anomaly in anomalies['anomalies']:
        print(f"⚠️ {anomaly['parameter']}: {anomaly['value']} - {anomaly['severity']}")
```

#### C. Chemical Dosing Optimization
```python
dosing = ml_api.optimize_chemical_dosing(
    influent_turbidity=175,
    influent_tss=195,
    temperature=27,
    ph_level=6.9
)

print(f"Coagulant: {dosing['optimal_coagulant_mg_per_l']} mg/L")
print(f"Chlorine: {dosing['optimal_chlorine_mg_per_l']} mg/L")
print(f"Daily savings: ₹{dosing['daily_cost_savings_rupees']}")
```

#### D. Resource Recovery Prediction
```python
recovery = ml_api.predict_resource_recovery(
    sludge_volume=520,
    organic_content=67,
    temperature_digester=36,
    retention_time=21,
    nutrient_n=4.6,
    nutrient_p=2.3
)

print(f"Biogas: {recovery['biogas_production_m3_per_day']} m³/day")
print(f"Economic value: ₹{recovery['total_daily_value_rupees']}/day")
```

#### E. Energy Optimization
```python
energy = ml_api.optimize_energy_consumption(
    water_volume=8200,
    pump_flow_rate=345,
    aeration_time=17,
    mixing_intensity=68,
    electricity_price=7.5
)

print(f"Current: {energy['current_energy_kwh_per_day']} kWh/day")
print(f"Optimized: {energy['optimized_energy_kwh_per_day']} kWh/day")
print(f"Savings: ₹{energy['cost_savings_rupees_per_day']}/day")
```

### Step 4: Add to Dashboard

#### JavaScript Integration (for web dashboard)

```javascript
// Call backend API that wraps Python ML models
async function getMLPredictions() {
    try {
        // Get current sensor data
        const sensorData = {
            influent_turbidity: parseFloat(document.getElementById('turbidity').value),
            influent_bod: parseFloat(document.getElementById('bod').value),
            // ... other parameters
        };

        // Call backend API
        const response = await fetch('/api/ml/predict-efficiency', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(sensorData)
        });

        const predictions = await response.json();

        // Update dashboard
        document.getElementById('predicted-efficiency').textContent = 
            predictions.overall_efficiency.toFixed(1) + '%';

    } catch (error) {
        console.error('ML prediction error:', error);
    }
}

// Update predictions every 30 seconds
setInterval(getMLPredictions, 30000);
```

#### Backend API Endpoint (Flask example)

```python
from flask import Flask, request, jsonify
from water_treatment_ml_api import WaterTreatmentMLAPI

app = Flask(__name__)
ml_api = WaterTreatmentMLAPI()

@app.route('/api/ml/predict-efficiency', methods=['POST'])
def predict_efficiency():
    data = request.json

    try:
        efficiency = ml_api.predict_treatment_efficiency(**data)
        return jsonify(efficiency)
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/ml/detect-anomalies', methods=['POST'])
def detect_anomalies():
    data = request.json

    try:
        anomalies = ml_api.detect_anomalies(**data)
        return jsonify(anomalies)
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/ml/optimize-dosing', methods=['POST'])
def optimize_dosing():
    data = request.json

    try:
        dosing = ml_api.optimize_chemical_dosing(**data)
        return jsonify(dosing)
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)
```

## Real-time Integration Architecture

```
[Sensors/Simulated Data]
         ↓
[Data Collection Layer]
         ↓
[Backend Server (Flask/FastAPI)]
         ↓
[ML API (water_treatment_ml_api.py)]
         ↓
[5 Trained Models]
         ↓
[Predictions & Insights]
         ↓
[WebSocket/REST API]
         ↓
[Frontend Dashboard]
```

## Performance Optimization

1. **Caching**: Cache model predictions for 1-5 minutes
2. **Batch Processing**: Process multiple predictions together
3. **Async Calls**: Use async/await for non-blocking predictions
4. **Model Loading**: Load models once at startup, not per request

## Alert Thresholds

Configure these in your system:

```python
ALERT_THRESHOLDS = {
    'efficiency': {
        'primary': 85,      # Alert if below 85%
        'secondary': 88,    # Alert if below 88%
        'tertiary': 93      # Alert if below 93%
    },
    'anomaly_confidence': 0.7,  # Alert if >70% confidence
    'cost_savings': 1000,       # Alert if savings >₹1000/day available
    'energy_savings': 10        # Alert if >10% energy savings possible
}
```

## Monitoring & Logging

```python
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def log_prediction(model_name, inputs, outputs):
    logger.info(f"Model: {model_name}")
    logger.info(f"Inputs: {inputs}")
    logger.info(f"Outputs: {outputs}")

    # Store in database for analysis
    # db.store_prediction(model_name, inputs, outputs, timestamp)
```

## Testing

```python
def test_ml_models():
    api = WaterTreatmentMLAPI()

    # Test 1: Efficiency prediction
    efficiency = api.predict_treatment_efficiency(
        influent_turbidity=150, influent_bod=250, influent_cod=450,
        influent_tss=180, flow_rate=350, chemical_dose_coagulant=45,
        chemical_dose_chlorine=3.5, temperature=25, ph_level=7.2, do_level=6.5
    )
    assert 75 <= efficiency['primary_efficiency'] <= 95
    assert 82 <= efficiency['secondary_efficiency'] <= 97
    assert 92 <= efficiency['tertiary_efficiency'] <= 99

    # Test 2: Anomaly detection
    anomalies = api.detect_anomalies(
        turbidity=12, bod=20, cod=45, tss_removal=88,
        do_level=6.5, flow_rate=350, ph_level=7.2, temperature=25
    )
    assert anomalies['is_anomaly'] == False  # Normal conditions

    print("✅ All tests passed!")

test_ml_models()
```

## Deployment Checklist

- [ ] Python 3.8+ installed
- [ ] Dependencies installed (numpy, pandas, scikit-learn)
- [ ] ML API file (water_treatment_ml_api.py) deployed
- [ ] Backend API endpoints configured
- [ ] Frontend dashboard updated with ML integration
- [ ] Alert thresholds configured
- [ ] Logging and monitoring set up
- [ ] Performance testing completed
- [ ] Documentation reviewed with team

## Support & Troubleshooting

**Issue**: Model predictions seem inaccurate
**Solution**: Check input data ranges and units. Verify sensor calibration.

**Issue**: High latency in predictions
**Solution**: Implement caching, use batch predictions, check server resources.

**Issue**: Anomaly false positives
**Solution**: Adjust contamination parameter in IsolationForest (default 0.05).

## Next Steps

1. Integrate models into your dashboard
2. Set up backend API endpoints
3. Configure real-time data flow
4. Add visualization for ML insights
5. Set up alerting system
6. Train team on ML features
7. Collect feedback and refine

## Contact

For technical support or questions about ML models:
- Review the API documentation in water_treatment_ml_api.py
- Check example usage at the bottom of the API file
- Test with provided examples before integration
