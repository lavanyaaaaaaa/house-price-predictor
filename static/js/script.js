// Global variables
let predictionHistory = [];
let currentPrediction = null;
let charts = {};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeCharts();
    loadHistory();
    setupEventListeners();
    showSection('predict'); // Show predict section by default
});

// Initialize all charts
function initializeCharts() {
    // Feature Impact Chart
    const featureImpactCtx = document.getElementById('featureImpactChart').getContext('2d');
    charts.featureImpact = new Chart(featureImpactCtx, {
        type: 'bar',
        data: {
            labels: ['Bedrooms', 'Bathrooms', 'Square Feet', 'Location', 'Age'],
            datasets: [{
                label: 'Impact on Price',
                data: [0, 0, 0, 0, 0],
                backgroundColor: [
                    'rgba(78, 115, 223, 0.6)',
                    'rgba(28, 200, 138, 0.6)',
                    'rgba(54, 185, 204, 0.6)',
                    'rgba(246, 194, 62, 0.6)',
                    'rgba(231, 74, 59, 0.6)'
                ],
                borderColor: [
                    'rgba(78, 115, 223, 1)',
                    'rgba(28, 200, 138, 1)',
                    'rgba(54, 185, 204, 1)',
                    'rgba(246, 194, 62, 1)',
                    'rgba(231, 74, 59, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: getChartOptions('Feature Impact', '$')
    });

    // Price Trend Chart
    const priceTrendCtx = document.getElementById('priceTrendChart').getContext('2d');
    charts.priceTrend = new Chart(priceTrendCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Price Trend',
                data: [],
                borderColor: 'rgba(78, 115, 223, 1)',
                backgroundColor: 'rgba(78, 115, 223, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: getChartOptions('Price Over Time', '$')
    });

    // Feature Correlation Chart
    const featureCorrelationCtx = document.getElementById('featureCorrelationChart').getContext('2d');
    charts.featureCorrelation = new Chart(featureCorrelationCtx, {
        type: 'radar',
        data: {
            labels: ['Bedrooms', 'Bathrooms', 'Square Feet', 'Location', 'Age'],
            datasets: [{
                label: 'Feature Correlation',
                data: [0, 0, 0, 0, 0],
                backgroundColor: 'rgba(28, 200, 138, 0.2)',
                borderColor: 'rgba(28, 200, 138, 1)',
                pointBackgroundColor: 'rgba(28, 200, 138, 1)'
            }]
        },
        options: getChartOptions('Feature Correlation', '', { max: 1 })
    });

    // Location Impact Chart
    const locationImpactCtx = document.getElementById('locationImpactChart').getContext('2d');
    charts.locationImpact = new Chart(locationImpactCtx, {
        type: 'bar',
        data: {
            labels: ['Rural', 'Suburban', 'Urban'],
            datasets: [{
                label: 'Average Price',
                data: [0, 0, 0],
                backgroundColor: [
                    'rgba(231, 74, 59, 0.6)',
                    'rgba(246, 194, 62, 0.6)',
                    'rgba(28, 200, 138, 0.6)'
                ]
            }]
        },
        options: getChartOptions('Location Impact', '$')
    });
}

// Helper function for chart options
function getChartOptions(title, prefix = '', scales = {}) {
    return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: title,
                font: {
                    size: 16
                }
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return `${prefix}${context.raw.toLocaleString()}`;
                    }
                }
            }
        },
        scales: scales
    };
}

// Set up event listeners
function setupEventListeners() {
    // Form submission
    document.getElementById('predictionForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        await makePrediction();
    });
    
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            showSection(section);
            setActiveNav(this);
        });
    });
}

// Show specific section
function showSection(section) {
    document.querySelectorAll('section').forEach(sec => {
        sec.style.display = 'none';
    });
    document.getElementById(section).style.display = 'block';
    
    // Update charts when analytics section is shown
    if (section === 'analytics') {
        updateAnalyticsCharts();
    }
    // Update history when history section is shown
    else if (section === 'history') {
        updateHistoryTable();
    }
}

// Set active navigation item
function setActiveNav(activeItem) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    activeItem.classList.add('active');
}

// Make prediction
async function makePrediction() {
    const form = document.getElementById('predictionForm');
    const resultDiv = document.getElementById('resultContent');
    const noResultDiv = document.getElementById('noResult');
    const loadingDiv = document.getElementById('loading');
    
    // Show loading, hide other states
    loadingDiv.style.display = 'block';
    resultDiv.style.display = 'none';
    noResultDiv.style.display = 'none';
    
    // Get form values
    const formData = {
        bedrooms: parseInt(document.getElementById('bedrooms').value),
        bathrooms: parseFloat(document.getElementById('bathrooms').value),
        sqft: parseInt(document.getElementById('sqft').value),
        location: parseInt(document.getElementById('location').value),
        age: parseInt(document.getElementById('age').value),
        model_type: document.getElementById('modelType').value
    };
    
    try {
        // Simulate API call (replace with actual fetch in production)
        const data = await simulatePrediction(formData);
        currentPrediction = {
            ...formData,
            ...data,
            timestamp: new Date().toISOString()
        };
        
        // Update UI with results
        displayResults(data);
        
        // Save prediction automatically
        savePrediction();
        
    } catch (error) {
        console.error('Prediction error:', error);
        alert('Error making prediction: ' + error.message);
        loadingDiv.style.display = 'none';
        noResultDiv.style.display = 'block';
    }
}

// Simulate prediction (replace with actual API call)
function simulatePrediction(formData) {
    return new Promise((resolve) => {
        // Simulate API delay
        setTimeout(() => {
            // Calculate mock price
            const price = (
                formData.bedrooms * 5000 + 
                formData.bathrooms * 10000 + 
                formData.sqft * 100 + 
                (3 - formData.location) * 20000 + 
                (30 - Math.min(formData.age, 30)) * 1000 + 
                Math.random() * 50000
            );
            
            resolve({
                price: price,
                feature_importance: {
                    bedrooms: formData.bedrooms * 5000,
                    bathrooms: formData.bathrooms * 10000,
                    sqft: formData.sqft * 100,
                    location: (3 - formData.location) * 20000,
                    age: (30 - Math.min(formData.age, 30)) * 1000
                }
            });
        }, 1000);
    });
}

// Display prediction results
function displayResults(data) {
    const loadingDiv = document.getElementById('loading');
    const resultDiv = document.getElementById('resultContent');
    const priceElement = document.getElementById('priceResult');
    
    // Format price with animation
    priceElement.textContent = formatCurrency(data.price);
    priceElement.classList.add('price-update');
    setTimeout(() => {
        priceElement.classList.remove('price-update');
    }, 500);
    
    // Update feature impact chart
    if (data.feature_importance) {
        charts.featureImpact.data.datasets[0].data = [
            data.feature_importance.bedrooms || 0,
            data.feature_importance.bathrooms || 0,
            data.feature_importance.sqft || 0,
            data.feature_importance.location || 0,
            data.feature_importance.age || 0
        ];
        charts.featureImpact.update();
    }
    
    // Show results
    loadingDiv.style.display = 'none';
    resultDiv.style.display = 'block';
}

// Format currency
function formatCurrency(amount) {
    return '$' + amount.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

// Save prediction to history
function savePrediction() {
    if (!currentPrediction) return;
    
    predictionHistory.push(currentPrediction);
    localStorage.setItem('predictionHistory', JSON.stringify(predictionHistory));
    updateHistoryTable();
    updateAnalyticsCharts();
}

// Load history from localStorage
function loadHistory() {
    const savedHistory = localStorage.getItem('predictionHistory');
    if (savedHistory) {
        predictionHistory = JSON.parse(savedHistory);
        updateHistoryTable();
        updateAnalyticsCharts();
    }
}

// Update history table
function updateHistoryTable() {
    const tableBody = document.querySelector('#historyTable tbody');
    tableBody.innerHTML = '';
    
    if (predictionHistory.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="9" class="text-center text-muted">No prediction history yet</td></tr>';
        return;
    }
    
    // Show most recent first
    predictionHistory.slice().reverse().forEach((pred, index) => {
        const row = document.createElement('tr');
        
        // Format date
        const date = new Date(pred.timestamp);
        const dateStr = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
        
        // Format location
        const locationMap = {0: 'Rural', 1: 'Suburban', 2: 'Urban'};
        const location = locationMap[pred.location] || pred.location;
        
        // Format model name
        const modelName = pred.model_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
        
        row.innerHTML = `
            <td>${dateStr}</td>
            <td>${formatCurrency(pred.price)}</td>
            <td>${pred.bedrooms}</td>
            <td>${pred.bathrooms}</td>
            <td>${pred.sqft.toLocaleString()}</td>
            <td>${location}</td>
            <td>${pred.age}</td>
            <td>${modelName}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary" onclick="viewPrediction(${predictionHistory.length - 1 - index})">
                    <i class="bi bi-eye"></i> View
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Update analytics charts
function updateAnalyticsCharts() {
    if (predictionHistory.length === 0) {
        // Reset charts if no data
        charts.priceTrend.data.labels = [];
        charts.priceTrend.data.datasets[0].data = [];
        charts.featureCorrelation.data.datasets[0].data = [0, 0, 0, 0, 0];
        charts.locationImpact.data.datasets[0].data = [0, 0, 0];
        
        charts.priceTrend.update();
        charts.featureCorrelation.update();
        charts.locationImpact.update();
        return;
    }
    
    // Update Price Trend Chart
    const sortedByDate = [...predictionHistory].sort((a, b) => 
        new Date(a.timestamp) - new Date(b.timestamp)
    );
    
    charts.priceTrend.data.labels = sortedByDate.map(pred => 
        new Date(pred.timestamp).toLocaleDateString()
    );
    charts.priceTrend.data.datasets[0].data = sortedByDate.map(pred => pred.price);
    charts.priceTrend.update();
    
    // Update Feature Correlation Chart
    if (predictionHistory.length > 1) {
        const features = ['bedrooms', 'bathrooms', 'sqft', 'location', 'age'];
        const correlations = features.map(feature => {
            const values = predictionHistory.map(p => p[feature]);
            const prices = predictionHistory.map(p => p.price);
            return calculateCorrelation(values, prices);
        });
        
        charts.featureCorrelation.data.datasets[0].data = correlations;
        charts.featureCorrelation.update();
    }
    
    // Update Location Impact Chart
    const locationAverages = {
        '0': { sum: 0, count: 0 }, // Rural
        '1': { sum: 0, count: 0 }, // Suburban
        '2': { sum: 0, count: 0 }  // Urban
    };
    
    predictionHistory.forEach(pred => {
        const loc = pred.location.toString();
        if (locationAverages[loc]) {
            locationAverages[loc].sum += pred.price;
            locationAverages[loc].count++;
        }
    });
    
    charts.locationImpact.data.datasets[0].data = Object.values(locationAverages).map(
        loc => loc.count > 0 ? loc.sum / loc.count : 0
    );
    charts.locationImpact.update();
}

// Calculate correlation coefficient
function calculateCorrelation(x, y) {
    if (x.length !== y.length || x.length < 2) return 0;
    
    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((a, val, i) => a + val * y[i], 0);
    const sumX2 = x.reduce((a, b) => a + b * b, 0);
    const sumY2 = y.reduce((a, b) => a + b * b, 0);
    
    const numerator = sumXY - (sumX * sumY / n);
    const denominator = Math.sqrt(
        (sumX2 - sumX * sumX / n) * 
        (sumY2 - sumY * sumY / n)
    );
    
    return denominator === 0 ? 0 : numerator / denominator;
}

// View previous prediction
function viewPrediction(index) {
    if (index >= 0 && index < predictionHistory.length) {
        currentPrediction = predictionHistory[index];
        
        // Update form values
        document.getElementById('bedrooms').value = currentPrediction.bedrooms;
        document.getElementById('bathrooms').value = currentPrediction.bathrooms;
        document.getElementById('sqft').value = currentPrediction.sqft;
        document.getElementById('location').value = currentPrediction.location;
        document.getElementById('age').value = currentPrediction.age;
        document.getElementById('modelType').value = currentPrediction.model_type;
        
        // Display results
        displayResults({
            price: currentPrediction.price,
            feature_importance: {
                bedrooms: currentPrediction.bedrooms * 5000,
                bathrooms: currentPrediction.bathrooms * 10000,
                sqft: currentPrediction.sqft * 100,
                location: (3 - currentPrediction.location) * 20000,
                age: (30 - Math.min(currentPrediction.age, 30)) * 1000
            }
        });
        
        // Switch to prediction view
        showSection('predict');
        setActiveNav(document.querySelector('[data-section="predict"]'));
        window.scrollTo(0, 0);
    }
}

// Clear all history
function clearHistory() {
    if (confirm('Are you sure you want to clear all prediction history?')) {
        predictionHistory = [];
        localStorage.removeItem('predictionHistory');
        updateHistoryTable();
        updateAnalyticsCharts();
    }
}

// Export single prediction
function exportPrediction(format) {
    if (!currentPrediction) return;
    
    let content, mimeType, extension;
    
    if (format === 'csv') {
        // Convert to CSV
        const headers = Object.keys(currentPrediction).join(',');
        const values = Object.values(currentPrediction).map(v => 
            typeof v === 'object' ? JSON.stringify(v) : v
        ).join(',');
        content = `${headers}\n${values}`;
        mimeType = 'text/csv';
        extension = 'csv';
    } else {
        // Default to JSON
        content = JSON.stringify(currentPrediction, null, 2);
        mimeType = 'application/json';
        extension = 'json';
    }
    
    // Create download link
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `house_prediction_${new Date().toISOString().slice(0,10)}.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Export all history
function exportAllHistory() {
    if (predictionHistory.length === 0) {
        alert('No history to export');
        return;
    }
    
    // Convert to CSV
    const headers = ['Date', 'Price', 'Bedrooms', 'Bathrooms', 'Square Feet', 'Location', 'Age', 'Model'];
    const rows = predictionHistory.map(pred => [
        new Date(pred.timestamp).toLocaleString(),
        pred.price,
        pred.bedrooms,
        pred.bathrooms,
        pred.sqft,
        ['Rural', 'Suburban', 'Urban'][pred.location] || pred.location,
        pred.age,
        pred.model_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
    ]);
    
    let csvContent = headers.join(',') + '\n';
    rows.forEach(row => {
        csvContent += row.map(field => 
            `"${field.toString().replace(/"/g, '""')}"`
        ).join(',') + '\n';
    });
    
    // Create download
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `house_price_history_${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}