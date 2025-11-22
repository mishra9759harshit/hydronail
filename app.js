// Equipment Data
const equipment = [
    { name: 'Primary Settling Pump', id: 'pump_primary', icon: '🔄', currentStatus: true, currentPower: 75 },
    { name: 'Aeration System', id: 'aerator', icon: '💨', currentStatus: true, currentPower: 100 },
    { name: 'Mixing Unit', id: 'mixer', icon: '🌀', currentStatus: true, currentPower: 60 },
    { name: 'Secondary Pump', id: 'pump_secondary', icon: '⚙️', currentStatus: true, currentPower: 80 },
    { name: 'Chlorination Unit', id: 'chlorinator', icon: '💧', currentStatus: true, currentPower: 50 },
    { name: 'Filtration System', id: 'filter', icon: '🔍', currentStatus: true, currentPower: 70 }
];

// Chemical Data
const chemicals = [
    { name: 'Coagulant (Alum)', unit: 'kg/h', cost: 45, icon: '⚗️' },
    { name: 'Chlorine', unit: 'kg/h', cost: 150, icon: '🧪' },
    { name: 'pH Adjuster (Lime)', unit: 'kg/h', cost: 30, icon: '📊' },
    { name: 'Polymer', unit: 'L/h', cost: 200, icon: '💉' }
];

// Parameter Ranges
const paramRanges = {
    ph: { min: 6.5, max: 8.5, optimal: 7.2 },
    do: { min: 4.0, max: 8.0, optimal: 6.5 },
    turbidity: { min: 0, max: 20, optimal: 10 },
    bod: { min: 0, max: 30, optimal: 20 },
    cod: { min: 0, max: 60, optimal: 45 },
    tss: { min: 0, max: 100, optimal: 85 },
    temperature: { min: 15, max: 35, optimal: 25 },
    flowRate: { min: 200, max: 500, optimal: 350 }
};

// Action Log Storage (in-memory)
let actionLog = [];

// Get Input Values
function getInputValues() {
    return {
        ph: parseFloat(document.getElementById('ph').value),
        do: parseFloat(document.getElementById('do').value),
        turbidity: parseFloat(document.getElementById('turbidity').value),
        bod: parseFloat(document.getElementById('bod').value),
        cod: parseFloat(document.getElementById('cod').value),
        tss: parseFloat(document.getElementById('tss').value),
        temperature: parseFloat(document.getElementById('temperature').value),
        flowRate: parseFloat(document.getElementById('flowRate').value),
        currentCoagulant: parseFloat(document.getElementById('currentCoagulant').value),
        currentChlorine: parseFloat(document.getElementById('currentChlorine').value)
    };
}

// Analyze Parameters and Generate Recommendations
function analyzeParameters() {
    const params = getInputValues();
    const recommendations = {
        chemicals: [],
        equipment: [],
        priorities: [],
        predictions: {},
        alerts: []
    };

    // pH Analysis
    if (params.ph < paramRanges.ph.min) {
        const adjustment = ((paramRanges.ph.optimal - params.ph) * 2).toFixed(2);
        recommendations.chemicals.push({
            name: 'pH Adjuster (Lime)',
            icon: '📊',
            current: 0,
            recommended: parseFloat(adjustment),
            adjustment: `+${adjustment}`,
            unit: 'kg/h',
            status: 'critical',
            reason: `pH is critically low at ${params.ph}. Add lime to raise pH to optimal range.`
        });
        recommendations.alerts.push({
            type: 'critical',
            message: `⚠️ Critical: pH level (${params.ph}) is below safe range. Immediate action required!`
        });
        recommendations.priorities.push({
            priority: 'high',
            action: `Add ${adjustment} kg/h of pH Adjuster (Lime)`,
            description: 'pH is critically low and must be corrected immediately to prevent equipment damage.',
            time: '5-10 minutes'
        });
    } else if (params.ph > paramRanges.ph.max) {
        recommendations.alerts.push({
            type: 'warning',
            message: `⚠️ Warning: pH level (${params.ph}) is above optimal range. Monitor closely.`
        });
        recommendations.priorities.push({
            priority: 'medium',
            action: 'Reduce alkaline additives',
            description: 'pH is slightly elevated. Adjust chemical feed rates.',
            time: '10-15 minutes'
        });
    } else if (Math.abs(params.ph - paramRanges.ph.optimal) > 0.3) {
        const adjustment = ((paramRanges.ph.optimal - params.ph) * 1.5).toFixed(2);
        recommendations.chemicals.push({
            name: 'pH Adjuster (Lime)',
            icon: '📊',
            current: 0,
            recommended: Math.abs(parseFloat(adjustment)),
            adjustment: params.ph < paramRanges.ph.optimal ? `+${Math.abs(adjustment)}` : `${adjustment}`,
            unit: 'kg/h',
            status: 'adjust',
            reason: `pH is ${params.ph < paramRanges.ph.optimal ? 'below' : 'above'} optimal. Adjust to ${paramRanges.ph.optimal}.`
        });
    }

    // DO Analysis
    if (params.do < 5.0) {
        recommendations.equipment.push({
            ...equipment.find(e => e.id === 'aerator'),
            recommendedStatus: true,
            recommendedPower: 100,
            action: 'Turn ON at 100% capacity',
            reason: `DO level is low at ${params.do} mg/L. Increase aeration immediately.`
        });
        recommendations.priorities.push({
            priority: 'high',
            action: 'Activate Aeration System at 100%',
            description: `Dissolved oxygen is critically low (${params.do} mg/L). Aerobic bacteria need at least 5 mg/L.`,
            time: '2-5 minutes'
        });
        recommendations.alerts.push({
            type: 'warning',
            message: `⚠️ Low DO Alert: Dissolved oxygen (${params.do} mg/L) is below optimal. Activating aerators.`
        });
    } else if (params.do > 8.0) {
        recommendations.equipment.push({
            ...equipment.find(e => e.id === 'aerator'),
            recommendedStatus: true,
            recommendedPower: 40,
            action: 'Reduce to 40% capacity',
            reason: `DO level is high at ${params.do} mg/L. Reduce aeration to save energy.`
        });
        recommendations.priorities.push({
            priority: 'low',
            action: 'Reduce Aeration System to 40%',
            description: 'DO is above optimal. Reduce aeration to optimize energy consumption.',
            time: '5-10 minutes'
        });
    } else {
        recommendations.equipment.push({
            ...equipment.find(e => e.id === 'aerator'),
            recommendedStatus: true,
            recommendedPower: 75,
            action: 'Maintain at 75% capacity',
            reason: `DO level is optimal at ${params.do} mg/L.`
        });
    }

    // Turbidity Analysis
    if (params.turbidity > 15) {
        const coagulantIncrease = ((params.turbidity - 10) * 0.5).toFixed(2);
        const newDose = (params.currentCoagulant + parseFloat(coagulantIncrease)).toFixed(2);
        recommendations.chemicals.push({
            name: 'Coagulant (Alum)',
            icon: '⚗️',
            current: params.currentCoagulant,
            recommended: parseFloat(newDose),
            adjustment: `+${coagulantIncrease}`,
            unit: 'kg/h',
            status: 'critical',
            reason: `High turbidity at ${params.turbidity} NTU. Increase coagulant dose to improve settling.`
        });
        recommendations.priorities.push({
            priority: 'high',
            action: `Increase Coagulant dose by ${coagulantIncrease} kg/h`,
            description: `Turbidity (${params.turbidity} NTU) exceeds acceptable range. Enhanced coagulation needed.`,
            time: '5-8 minutes'
        });
        recommendations.alerts.push({
            type: 'critical',
            message: `⚠️ High Turbidity: ${params.turbidity} NTU detected. Increasing coagulant dosage.`
        });
    } else if (params.turbidity < 5) {
        const coagulantDecrease = ((10 - params.turbidity) * 0.3).toFixed(2);
        const newDose = Math.max(0, params.currentCoagulant - parseFloat(coagulantDecrease)).toFixed(2);
        recommendations.chemicals.push({
            name: 'Coagulant (Alum)',
            icon: '⚗️',
            current: params.currentCoagulant,
            recommended: parseFloat(newDose),
            adjustment: `-${coagulantDecrease}`,
            unit: 'kg/h',
            status: 'adjust',
            reason: `Low turbidity at ${params.turbidity} NTU. Reduce coagulant to optimize costs.`
        });
    } else {
        recommendations.chemicals.push({
            name: 'Coagulant (Alum)',
            icon: '⚗️',
            current: params.currentCoagulant,
            recommended: params.currentCoagulant,
            adjustment: '0',
            unit: 'kg/h',
            status: 'optimal',
            reason: `Turbidity is optimal at ${params.turbidity} NTU. Maintain current dosage.`
        });
    }

    // Chlorine Management
    const chlorineAdjustment = (params.flowRate / 350 * 2.5).toFixed(2);
    if (Math.abs(params.currentChlorine - chlorineAdjustment) > 0.5) {
        recommendations.chemicals.push({
            name: 'Chlorine',
            icon: '🧪',
            current: params.currentChlorine,
            recommended: parseFloat(chlorineAdjustment),
            adjustment: (chlorineAdjustment - params.currentChlorine).toFixed(2),
            unit: 'kg/h',
            status: 'adjust',
            reason: `Adjust chlorine based on flow rate (${params.flowRate} m³/h) for optimal disinfection.`
        });
    } else {
        recommendations.chemicals.push({
            name: 'Chlorine',
            icon: '🧪',
            current: params.currentChlorine,
            recommended: params.currentChlorine,
            adjustment: '0',
            unit: 'kg/h',
            status: 'optimal',
            reason: 'Chlorine dosage is appropriate for current flow rate.'
        });
    }

    // Flow Rate Equipment Adjustments
    if (params.flowRate > 400) {
        recommendations.equipment.push({
            ...equipment.find(e => e.id === 'pump_primary'),
            recommendedStatus: true,
            recommendedPower: 90,
            action: 'Increase to 90% capacity',
            reason: `High flow rate (${params.flowRate} m³/h) requires increased pumping capacity.`
        });
        recommendations.equipment.push({
            ...equipment.find(e => e.id === 'pump_secondary'),
            recommendedStatus: true,
            recommendedPower: 95,
            action: 'Increase to 95% capacity',
            reason: 'Match secondary pump to handle increased flow.'
        });
    } else if (params.flowRate < 250) {
        recommendations.equipment.push({
            ...equipment.find(e => e.id === 'pump_primary'),
            recommendedStatus: true,
            recommendedPower: 50,
            action: 'Reduce to 50% capacity',
            reason: `Low flow rate (${params.flowRate} m³/h) allows energy savings.`
        });
        recommendations.equipment.push({
            ...equipment.find(e => e.id === 'pump_secondary'),
            recommendedStatus: true,
            recommendedPower: 55,
            action: 'Reduce to 55% capacity',
            reason: 'Optimize energy usage with reduced flow.'
        });
    } else {
        recommendations.equipment.push({
            ...equipment.find(e => e.id === 'pump_primary'),
            recommendedStatus: true,
            recommendedPower: 75,
            action: 'Maintain at 75% capacity',
            reason: 'Flow rate is within optimal range.'
        });
        recommendations.equipment.push({
            ...equipment.find(e => e.id === 'pump_secondary'),
            recommendedStatus: true,
            recommendedPower: 80,
            action: 'Maintain at 80% capacity',
            reason: 'Flow rate is within optimal range.'
        });
    }

    // Mixer Control
    if (params.turbidity > 12) {
        recommendations.equipment.push({
            ...equipment.find(e => e.id === 'mixer'),
            recommendedStatus: true,
            recommendedPower: 85,
            action: 'Increase to 85% capacity',
            reason: 'Enhanced mixing needed for better coagulation with high turbidity.'
        });
    } else {
        recommendations.equipment.push({
            ...equipment.find(e => e.id === 'mixer'),
            recommendedStatus: true,
            recommendedPower: 60,
            action: 'Maintain at 60% capacity',
            reason: 'Standard mixing is sufficient.'
        });
    }

    // Chlorination Unit
    recommendations.equipment.push({
        ...equipment.find(e => e.id === 'chlorinator'),
        recommendedStatus: true,
        recommendedPower: 50,
        action: 'Keep ON at 50%',
        reason: 'Continuous disinfection required.'
    });

    // Filtration System
    recommendations.equipment.push({
        ...equipment.find(e => e.id === 'filter'),
        recommendedStatus: true,
        recommendedPower: 70,
        action: 'Maintain at 70% capacity',
        reason: 'Standard filtration operation.'
    });

    // BOD/COD Analysis
    if (params.bod > 25 || params.cod > 55) {
        recommendations.priorities.push({
            priority: 'medium',
            action: 'Monitor biological treatment efficiency',
            description: `BOD (${params.bod} mg/L) or COD (${params.cod} mg/L) is elevated. Consider increasing aeration time.`,
            time: '30-60 minutes'
        });
    }

    // Temperature Effects
    if (params.temperature < 18) {
        recommendations.priorities.push({
            priority: 'low',
            action: 'Adjust chemical doses for low temperature',
            description: `Temperature is ${params.temperature}°C. Cold water may require longer detention times.`,
            time: '15-20 minutes'
        });
    } else if (params.temperature > 30) {
        recommendations.priorities.push({
            priority: 'medium',
            action: 'Monitor for temperature effects',
            description: `High temperature (${params.temperature}°C) may increase bacterial activity. Monitor chlorine demand.`,
            time: '10-15 minutes'
        });
    }

    // Calculate Predictions
    let treatmentEfficiency = 85;
    let costSavings = 0;
    
    // Efficiency factors
    if (Math.abs(params.ph - paramRanges.ph.optimal) < 0.3) treatmentEfficiency += 5;
    if (params.do >= 5 && params.do <= 7) treatmentEfficiency += 5;
    if (params.turbidity <= 12) treatmentEfficiency += 3;
    if (params.tss >= 80) treatmentEfficiency += 2;
    
    // Cost savings from optimization
    if (params.do > 8) costSavings += 150; // Energy savings from reduced aeration
    if (params.turbidity < 5) costSavings += 100; // Chemical savings
    if (params.flowRate >= 300 && params.flowRate <= 400) costSavings += 80; // Optimal flow
    
    recommendations.predictions = {
        efficiency: Math.min(100, treatmentEfficiency),
        costSavings: costSavings,
        environmentalImpact: treatmentEfficiency > 90 ? 'Excellent' : treatmentEfficiency > 85 ? 'Good' : 'Fair',
        timeToOptimal: recommendations.priorities.length > 0 ? '15-30 minutes' : 'Already optimal'
    };

    // Add success alert if everything is optimal
    if (recommendations.alerts.length === 0) {
        recommendations.alerts.push({
            type: 'success',
            message: '✅ All parameters within optimal range. System operating efficiently!'
        });
    }

    return recommendations;
}

// Display Recommendations
function displayRecommendations(recommendations) {
    // Display Alerts
    const alertsContainer = document.getElementById('alertsContainer');
    alertsContainer.innerHTML = recommendations.alerts.map(alert => `
        <div class="alert-banner alert-${alert.type}">
            <div class="alert-icon">${alert.type === 'critical' ? '🚨' : alert.type === 'warning' ? '⚠️' : '✅'}</div>
            <div>${alert.message}</div>
        </div>
    `).join('');

    // Display Chemical Recommendations
    const chemicalContainer = document.getElementById('chemicalRecommendations');
    chemicalContainer.innerHTML = recommendations.chemicals.map(chem => `
        <div class="chemical-card">
            <div class="chemical-header">
                <div class="chemical-name">
                    <span style="font-size: 24px;">${chem.icon}</span>
                    <span>${chem.name}</span>
                </div>
                <span class="status-badge status-${chem.status}">
                    ${chem.status === 'optimal' ? '✓ Optimal' : chem.status === 'adjust' ? '⚠ Adjust' : '⚠ Critical'}
                </span>
            </div>
            <div class="dosage-info">
                <div class="dosage-item">
                    <div class="dosage-label">Current Dose</div>
                    <div class="dosage-value">${chem.current} ${chem.unit}</div>
                </div>
                <div class="dosage-item">
                    <div class="dosage-label">Recommended Dose</div>
                    <div class="dosage-value">${chem.recommended} ${chem.unit}</div>
                </div>
            </div>
            ${chem.adjustment !== '0' ? `
                <div class="adjustment-highlight">
                    <div class="adjustment-text">
                        ${chem.adjustment.startsWith('+') ? 'ADD' : 'REDUCE'}: ${Math.abs(parseFloat(chem.adjustment))} ${chem.unit}
                    </div>
                </div>
            ` : ''}
            <div class="reason-text">${chem.reason}</div>
        </div>
    `).join('');

    // Display Equipment Recommendations
    const equipmentContainer = document.getElementById('equipmentRecommendations');
    equipmentContainer.innerHTML = recommendations.equipment.map(eq => `
        <div class="equipment-card">
            <div class="equipment-info">
                <div class="equipment-icon">${eq.icon}</div>
                <div class="equipment-details">
                    <h4>${eq.name}</h4>
                    <div class="equipment-status">
                        <span class="status-dot ${eq.currentStatus ? 'status-dot-on' : 'status-dot-off'}"></span>
                        <span>Currently: ${eq.currentStatus ? 'ON' : 'OFF'} (${eq.currentPower}%)</span>
                    </div>
                    <div style="font-size: 12px; color: var(--color-text-secondary); margin-top: 4px;">
                        ${eq.reason}
                    </div>
                </div>
            </div>
            <div class="equipment-action">
                <div style="font-weight: 600; margin-bottom: 4px;">${eq.action}</div>
                <div style="font-size: 12px; color: var(--color-text-secondary);">
                    Target: ${eq.recommendedPower}%
                </div>
            </div>
        </div>
    `).join('');

    // Display Priority Actions
    const priorityContainer = document.getElementById('priorityActions');
    priorityContainer.innerHTML = recommendations.priorities.map((priority, index) => `
        <li class="priority-item">
            <div class="priority-number">${index + 1}</div>
            <div class="priority-content">
                <div class="priority-header">
                    <div class="priority-title">${priority.action}</div>
                    <span class="priority-badge priority-${priority.priority}">
                        ${priority.priority.toUpperCase()}
                    </span>
                </div>
                <div class="priority-description">${priority.description}</div>
                <div class="priority-time">⏱️ Estimated time: ${priority.time}</div>
            </div>
        </li>
    `).join('');

    if (recommendations.priorities.length === 0) {
        priorityContainer.innerHTML = '<div class="empty-state"><p>No priority actions required. All systems optimal.</p></div>';
    }

    // Display Predictions
    const predictionsContainer = document.getElementById('predictions');
    predictionsContainer.innerHTML = `
        <div class="prediction-item">
            <div class="prediction-label">Treatment Efficiency</div>
            <div class="prediction-value">${recommendations.predictions.efficiency}%</div>
            <div class="prediction-change">↑ Optimized performance</div>
        </div>
        <div class="prediction-item">
            <div class="prediction-label">Estimated Cost Savings</div>
            <div class="prediction-value">₹${recommendations.predictions.costSavings}</div>
            <div class="prediction-change">Per hour</div>
        </div>
        <div class="prediction-item">
            <div class="prediction-label">Environmental Impact</div>
            <div class="prediction-value">${recommendations.predictions.environmentalImpact}</div>
            <div class="prediction-change">Compliance status</div>
        </div>
        <div class="prediction-item">
            <div class="prediction-label">Time to Optimal</div>
            <div class="prediction-value">${recommendations.predictions.timeToOptimal}</div>
            <div class="prediction-change">Estimated duration</div>
        </div>
    `;

    // Show recommendations section
    document.getElementById('recommendationsSection').classList.remove('hidden');

    // Log action
    addToActionLog('Analysis completed and recommendations generated');
}

// Add to Action Log
function addToActionLog(action) {
    const timestamp = new Date().toLocaleString('en-IN', { 
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    actionLog.unshift({ timestamp, action });
    
    // Keep only last 5 entries
    if (actionLog.length > 5) {
        actionLog = actionLog.slice(0, 5);
    }
    
    displayActionLog();
}

// Display Action Log
function displayActionLog() {
    const logContainer = document.getElementById('actionLog');
    
    if (actionLog.length === 0) {
        logContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📋</div>
                <p>No actions logged yet. Click "Analyze" to generate recommendations.</p>
            </div>
        `;
        return;
    }
    
    logContainer.innerHTML = actionLog.map(log => `
        <div class="log-entry">
            <div class="log-timestamp">⏰ ${log.timestamp}</div>
            <div class="log-action">${log.action}</div>
        </div>
    `).join('');
}

// Analyze Button Click Handler
document.getElementById('analyzeBtn').addEventListener('click', function() {
    const btn = this;
    const btnText = document.getElementById('analyzeText');
    
    // Show loading state
    btn.disabled = true;
    btnText.innerHTML = '<span class="loading-spinner"></span> Analyzing...';
    
    // Simulate analysis delay
    setTimeout(() => {
        const recommendations = analyzeParameters();
        displayRecommendations(recommendations);
        
        // Reset button
        btn.disabled = false;
        btnText.innerHTML = '🔍 Analyze &amp; Get Recommendations';
        
        // Scroll to recommendations
        document.getElementById('recommendationsSection').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }, 1500);
});

// Initialize
displayActionLog();