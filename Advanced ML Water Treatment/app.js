// MQTT Broker Configuration
const mqttConfig = {
    broker: 'mqtt.watertreatment.local',
    port: 1883,
    protocol: 'MQTT 3.1.1'
};

// ESP32 Devices
const esp32Devices = [
    { id: 'ESP32_PRIMARY_001', stage: 'primary', location: 'Primary Settling Tank' },
    { id: 'ESP32_SECONDARY_002', stage: 'secondary', location: 'Aeration Basin' },
    { id: 'ESP32_TERTIARY_003', stage: 'tertiary', location: 'Disinfection Unit' }
];

// Equipment Database
const equipmentDB = {
    primary: [
        { name: 'Primary Pump', icon: '🔄', power_kw: 15, control: 'variable_speed' },
        { name: 'Coagulation Mixer', icon: '🌀', power_kw: 8, control: 'variable_speed' },
        { name: 'Flocculation Mixer', icon: '〰️', power_kw: 5, control: 'fixed_speed' },
        { name: 'Settler Scraper', icon: '🧹', power_kw: 3, control: 'fixed_speed' }
    ],
    secondary: [
        { name: 'Aeration Blowers', icon: '💨', power_kw: 150, control: 'variable_speed' },
        { name: 'Secondary Mixers', icon: '🌊', power_kw: 12, control: 'variable_speed' },
        { name: 'RAS Pump', icon: '↩️', power_kw: 20, control: 'variable_speed' },
        { name: 'WAS Pump', icon: '⏏️', power_kw: 10, control: 'variable_speed' }
    ],
    tertiary: [
        { name: 'Chlorination Pump', icon: '💧', power_kw: 2, control: 'metering' },
        { name: 'UV Disinfection', icon: '☀️', power_kw: 25, control: 'variable_intensity' },
        { name: 'Membrane Filtration', icon: '🔍', power_kw: 35, control: 'variable_pressure' },
        { name: 'Backwash System', icon: '🔄', power_kw: 18, control: 'scheduled' }
    ]
};

// Water Reuse Standards
const reuseStandards = {
    grade_a: { name: 'Industrial Process Water', nitrogen_max: 5, phosphorus_max: 1, pathogens_max: 2, turbidity_max: 2, value: 15, color: '#10b981' },
    grade_b: { name: 'Irrigation Water', nitrogen_max: 8, phosphorus_max: 1.5, pathogens_max: 5, turbidity_max: 5, value: 10, color: '#3b82f6' },
    grade_c: { name: 'Industrial Cooling', nitrogen_max: 10, phosphorus_max: 2, pathogens_max: 10, turbidity_max: 8, value: 5, color: '#f59e0b' },
    grade_d: { name: 'Restricted Use', nitrogen_max: 15, phosphorus_max: 3, pathogens_max: 20, turbidity_max: 15, value: 2, color: '#ef4444' }
};

// Current MQTT Data (simulated)
let currentMQTTData = {
    primary: {},
    secondary: {},
    tertiary: {}
};

// ML Optimization Results
let mlResults = {
    primary: {},
    secondary: {},
    tertiary: {},
    overall: {}
};

// Equipment Data (legacy)
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

// Generate Simulated MQTT Data
function generateMQTTData() {
    // Primary Stage Sensors
    currentMQTTData.primary = {
        turbidity_in: (150 + Math.random() * 100).toFixed(1),
        turbidity_out: (8 + Math.random() * 8).toFixed(1),
        tss_in: (200 + Math.random() * 150).toFixed(1),
        flow_rate: (300 + Math.random() * 150).toFixed(0),
        ph: (6.8 + Math.random() * 0.8).toFixed(2),
        temperature: (20 + Math.random() * 8).toFixed(1)
    };

    // Secondary Stage Sensors
    currentMQTTData.secondary = {
        bod_in: (180 + Math.random() * 80).toFixed(1),
        bod_out: (15 + Math.random() * 15).toFixed(1),
        cod_in: (350 + Math.random() * 150).toFixed(1),
        cod_out: (35 + Math.random() * 25).toFixed(1),
        dissolved_oxygen: (3.5 + Math.random() * 4).toFixed(2),
        ph: (6.5 + Math.random() * 1.2).toFixed(2),
        temperature: (22 + Math.random() * 6).toFixed(1),
        mlss: (2500 + Math.random() * 2000).toFixed(0)
    };

    // Tertiary Stage Sensors
    currentMQTTData.tertiary = {
        nitrogen_in: (25 + Math.random() * 15).toFixed(1),
        nitrogen_out: (3 + Math.random() * 5).toFixed(1),
        phosphorus_in: (5 + Math.random() * 3).toFixed(1),
        phosphorus_out: (0.5 + Math.random() * 1.5).toFixed(2),
        turbidity: (1 + Math.random() * 4).toFixed(1),
        pathogens: Math.floor(Math.random() * 20),
        ph: (7.0 + Math.random() * 0.8).toFixed(2)
    };

    updateSensorDisplays();
    runMLOptimization();
    updateLastTimestamp();
}

// Update Sensor Displays
function updateSensorDisplays() {
    // Primary
    document.getElementById('p_turbidity_in').textContent = currentMQTTData.primary.turbidity_in;
    document.getElementById('p_turbidity_out').textContent = currentMQTTData.primary.turbidity_out;
    document.getElementById('p_tss_in').textContent = currentMQTTData.primary.tss_in;
    document.getElementById('p_flow_rate').textContent = currentMQTTData.primary.flow_rate;
    document.getElementById('p_ph').textContent = currentMQTTData.primary.ph;
    document.getElementById('p_temp').textContent = currentMQTTData.primary.temperature;

    // Secondary
    document.getElementById('s_bod_in').textContent = currentMQTTData.secondary.bod_in;
    document.getElementById('s_bod_out').textContent = currentMQTTData.secondary.bod_out;
    document.getElementById('s_cod_in').textContent = currentMQTTData.secondary.cod_in;
    document.getElementById('s_do').textContent = currentMQTTData.secondary.dissolved_oxygen;
    document.getElementById('s_mlss').textContent = currentMQTTData.secondary.mlss;
    document.getElementById('s_ph').textContent = currentMQTTData.secondary.ph;

    // Tertiary
    document.getElementById('t_nitrogen_in').textContent = currentMQTTData.tertiary.nitrogen_in;
    document.getElementById('t_nitrogen_out').textContent = currentMQTTData.tertiary.nitrogen_out;
    document.getElementById('t_phosphorus_in').textContent = currentMQTTData.tertiary.phosphorus_in;
    document.getElementById('t_turbidity').textContent = currentMQTTData.tertiary.turbidity;
    document.getElementById('t_pathogens').textContent = currentMQTTData.tertiary.pathogens;
    document.getElementById('t_ph').textContent = currentMQTTData.tertiary.ph;
}

// Update Last Timestamp
function updateLastTimestamp() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    document.getElementById('lastUpdate').textContent = `Last Update: ${timeStr}`;
}

// XGBoost ML Optimization (Simulated)
function runMLOptimization() {
    optimizePrimaryStage();
    optimizeSecondaryStage();
    optimizeTertiaryStage();
    calculateOverallMetrics();
    displayAllResults();
}

// Primary Stage Optimization
function optimizePrimaryStage() {
    const data = currentMQTTData.primary;
    const turbIn = parseFloat(data.turbidity_in);
    const turbOut = parseFloat(data.turbidity_out);
    const flowRate = parseFloat(data.flow_rate);
    const ph = parseFloat(data.ph);

    // ML Model: Calculate optimal coagulant dose
    const baseCoagulant = 5.0;
    const turbidityFactor = (turbIn / 200) * 3;
    const flowFactor = (flowRate / 350) * 1.5;
    const optimalCoagulant = (baseCoagulant + turbidityFactor + flowFactor).toFixed(2);
    const currentCoagulant = (baseCoagulant + Math.random() * 2).toFixed(2);

    // Polymer dose
    const optimalPolymer = (flowRate / 350 * 1.2).toFixed(2);
    const currentPolymer = (1.0 + Math.random() * 0.5).toFixed(2);

    // Equipment optimization
    const pumpSpeed = Math.min(100, Math.max(40, (flowRate / 450 * 100))).toFixed(0);
    const mixerSpeed = turbIn > 180 ? 85 : 65;

    // Efficiency calculation
    const efficiency = ((1 - turbOut / turbIn) * 100).toFixed(1);

    // Cost calculation
    const coagulantCost = parseFloat(optimalCoagulant) * 45;
    const polymerCost = parseFloat(optimalPolymer) * 200;
    const energyCost = (15 * pumpSpeed / 100 + 8 * mixerSpeed / 100) * 8;
    const totalCost = (coagulantCost + polymerCost + energyCost).toFixed(0);

    const savings = Math.abs(parseFloat(currentCoagulant) - parseFloat(optimalCoagulant)) * 45 +
                    Math.abs(parseFloat(currentPolymer) - parseFloat(optimalPolymer)) * 200;

    mlResults.primary = {
        efficiency,
        chemicals: [
            {
                name: 'Coagulant (Alum)',
                current: currentCoagulant,
                optimal: optimalCoagulant,
                unit: 'kg/h',
                cost: coagulantCost.toFixed(0)
            },
            {
                name: 'Polymer',
                current: currentPolymer,
                optimal: optimalPolymer,
                unit: 'L/h',
                cost: polymerCost.toFixed(0)
            }
        ],
        equipment: [
            { name: 'Primary Pump', icon: '🔄', current: 75, optimal: pumpSpeed, status: 'ON' },
            { name: 'Coagulation Mixer', icon: '🌀', current: 60, optimal: mixerSpeed, status: 'ON' },
            { name: 'Flocculation Mixer', icon: '〰️', current: 70, optimal: 70, status: 'ON' },
            { name: 'Settler Scraper', icon: '🧹', current: 50, optimal: 50, status: 'ON' }
        ],
        cost: totalCost,
        savings: savings.toFixed(0),
        actions: generatePrimaryActions(data, optimalCoagulant, currentCoagulant, pumpSpeed)
    };
}

// Secondary Stage Optimization
function optimizeSecondaryStage() {
    const data = currentMQTTData.secondary;
    const bodIn = parseFloat(data.bod_in);
    const bodOut = parseFloat(data.bod_out);
    const DO = parseFloat(data.dissolved_oxygen);
    const mlss = parseFloat(data.mlss);

    // ML Model: Aeration optimization
    let optimalAeration = 75;
    if (DO < 4.0) optimalAeration = 100;
    else if (DO < 5.5) optimalAeration = 85;
    else if (DO > 7.0) optimalAeration = 50;

    const currentAeration = (60 + Math.random() * 30).toFixed(0);

    // SRT calculation
    const srt = (mlss / bodIn * 0.015).toFixed(1);

    // Equipment optimization
    const rasSpeed = Math.min(100, (mlss / 3500 * 80)).toFixed(0);
    const wasSpeed = mlss > 4000 ? 30 : 15;

    // Efficiency
    const efficiency = ((1 - bodOut / bodIn) * 100).toFixed(1);

    // Energy cost
    const aerationCost = 150 * optimalAeration / 100 * 8;
    const pumpCost = (20 * rasSpeed / 100 + 10 * wasSpeed / 100) * 8;
    const totalCost = (aerationCost + pumpCost).toFixed(0);

    const savings = Math.abs(parseFloat(currentAeration) - optimalAeration) / 100 * 150 * 8;

    mlResults.secondary = {
        efficiency,
        optimization: [
            {
                name: 'Aeration Rate',
                current: currentAeration,
                optimal: optimalAeration,
                unit: '%'
            },
            {
                name: 'SRT',
                current: srt,
                optimal: srt,
                unit: 'days'
            }
        ],
        equipment: [
            { name: 'Aeration Blowers', icon: '💨', current: parseFloat(currentAeration), optimal: optimalAeration, status: 'ON' },
            { name: 'Secondary Mixers', icon: '🌊', current: 70, optimal: 75, status: 'ON' },
            { name: 'RAS Pump', icon: '↩️', current: 65, optimal: rasSpeed, status: 'ON' },
            { name: 'WAS Pump', icon: '⏏️', current: 20, optimal: wasSpeed, status: 'ON' }
        ],
        cost: totalCost,
        savings: savings.toFixed(0),
        actions: generateSecondaryActions(data, optimalAeration, currentAeration, DO)
    };
}

// Tertiary Stage Optimization
function optimizeTertiaryStage() {
    const data = currentMQTTData.tertiary;
    const nitrogen = parseFloat(data.nitrogen_out);
    const phosphorus = parseFloat(data.phosphorus_out);
    const turbidity = parseFloat(data.turbidity);
    const pathogens = parseInt(data.pathogens);

    // Chlorine optimization
    const optimalChlorine = (pathogens > 10 ? 3.5 : pathogens > 5 ? 2.8 : 2.2).toFixed(1);
    const currentChlorine = (2.0 + Math.random() * 1.5).toFixed(1);

    // UV intensity
    const uvIntensity = pathogens > 8 ? 100 : 75;

    // Membrane pressure
    const membranePressure = turbidity > 3 ? 85 : 70;

    // Efficiency
    const efficiency = (nitrogen < 8 && phosphorus < 2 && pathogens < 5 ? 95 : nitrogen < 10 && phosphorus < 2.5 ? 88 : 80).toFixed(1);

    // Water reuse classification
    let grade = 'grade_d';
    if (nitrogen <= 5 && phosphorus <= 1 && pathogens <= 2 && turbidity <= 2) grade = 'grade_a';
    else if (nitrogen <= 8 && phosphorus <= 1.5 && pathogens <= 5 && turbidity <= 5) grade = 'grade_b';
    else if (nitrogen <= 10 && phosphorus <= 2 && pathogens <= 10 && turbidity <= 8) grade = 'grade_c';

    const reuseClass = reuseStandards[grade];

    // Cost
    const chlorineCost = parseFloat(optimalChlorine) * 150;
    const uvCost = 25 * uvIntensity / 100 * 8;
    const membraneCost = 35 * membranePressure / 100 * 8;
    const totalCost = (chlorineCost + uvCost + membraneCost).toFixed(0);

    const savings = Math.abs(parseFloat(currentChlorine) - parseFloat(optimalChlorine)) * 150;

    mlResults.tertiary = {
        efficiency,
        chemicals: [
            {
                name: 'Chlorine',
                current: currentChlorine,
                optimal: optimalChlorine,
                unit: 'kg/h',
                cost: chlorineCost.toFixed(0)
            }
        ],
        equipment: [
            { name: 'Chlorination Pump', icon: '💧', current: parseFloat(currentChlorine) / optimalChlorine * 100, optimal: 100, status: 'ON' },
            { name: 'UV Disinfection', icon: '☀️', current: 75, optimal: uvIntensity, status: 'ON' },
            { name: 'Membrane Filtration', icon: '🔍', current: 70, optimal: membranePressure, status: 'ON' },
            { name: 'Backwash System', icon: '🔄', current: 0, optimal: 0, status: 'SCHEDULED' }
        ],
        reuse: reuseClass,
        reuseGrade: grade,
        cost: totalCost,
        savings: savings.toFixed(0),
        actions: generateTertiaryActions(data, optimalChlorine, currentChlorine, uvIntensity, grade)
    };
}

// Generate Primary Actions
function generatePrimaryActions(data, optimalCoag, currentCoag, pumpSpeed) {
    const actions = [];
    
    if (Math.abs(parseFloat(optimalCoag) - parseFloat(currentCoag)) > 0.5) {
        actions.push({
            priority: parseFloat(data.turbidity_in) > 200 ? 'CRITICAL' : 'HIGH',
            stage: 'Primary',
            action: `Adjust Coagulant to ${optimalCoag} kg/h`,
            current: `${currentCoag} kg/h`,
            target: `${optimalCoag} kg/h`,
            reason: 'Optimize solid removal efficiency',
            time: '5 min'
        });
    }

    if (parseFloat(data.ph) < 6.5 || parseFloat(data.ph) > 8.5) {
        actions.push({
            priority: 'CRITICAL',
            stage: 'Primary',
            action: 'Adjust pH levels',
            current: data.ph,
            target: '7.0-7.5',
            reason: 'pH outside safe operating range',
            time: '10 min'
        });
    }

    return actions;
}

// Generate Secondary Actions
function generateSecondaryActions(data, optimalAer, currentAer, DO) {
    const actions = [];
    
    if (DO < 4.0) {
        actions.push({
            priority: 'CRITICAL',
            stage: 'Secondary',
            action: `Increase Aeration to ${optimalAer}%`,
            current: `${currentAer}%`,
            target: `${optimalAer}%`,
            reason: 'DO critically low - bacteria require >4 mg/L',
            time: '3 min'
        });
    } else if (Math.abs(parseFloat(optimalAer) - parseFloat(currentAer)) > 15) {
        actions.push({
            priority: DO < 5.5 ? 'HIGH' : 'MEDIUM',
            stage: 'Secondary',
            action: `Adjust Aeration to ${optimalAer}%`,
            current: `${currentAer}%`,
            target: `${optimalAer}%`,
            reason: 'Optimize energy consumption',
            time: '5 min'
        });
    }

    if (parseFloat(data.mlss) > 4500) {
        actions.push({
            priority: 'MEDIUM',
            stage: 'Secondary',
            action: 'Increase WAS pump rate',
            current: '15%',
            target: '30%',
            reason: 'MLSS too high - prevent settling issues',
            time: '8 min'
        });
    }

    return actions;
}

// Generate Tertiary Actions
function generateTertiaryActions(data, optimalCl, currentCl, uvIntensity, grade) {
    const actions = [];
    
    if (Math.abs(parseFloat(optimalCl) - parseFloat(currentCl)) > 0.5) {
        actions.push({
            priority: parseInt(data.pathogens) > 10 ? 'HIGH' : 'MEDIUM',
            stage: 'Tertiary',
            action: `Adjust Chlorine to ${optimalCl} kg/h`,
            current: `${currentCl} kg/h`,
            target: `${optimalCl} kg/h`,
            reason: 'Optimize pathogen removal',
            time: '5 min'
        });
    }

    if (grade === 'grade_c' || grade === 'grade_d') {
        actions.push({
            priority: 'MEDIUM',
            stage: 'Tertiary',
            action: 'Improve treatment for higher grade water',
            current: reuseStandards[grade].name,
            target: 'Grade A/B',
            reason: 'Increase reuse value potential',
            time: '20 min'
        });
    }

    return actions;
}

// Calculate Overall Metrics
function calculateOverallMetrics() {
    const primaryEff = parseFloat(mlResults.primary.efficiency);
    const secondaryEff = parseFloat(mlResults.secondary.efficiency);
    const tertiaryEff = parseFloat(mlResults.tertiary.efficiency);
    
    const overallEff = ((primaryEff + secondaryEff + tertiaryEff) / 3).toFixed(1);
    
    const totalCost = parseFloat(mlResults.primary.cost) + parseFloat(mlResults.secondary.cost) + parseFloat(mlResults.tertiary.cost);
    const totalSavings = parseFloat(mlResults.primary.savings) + parseFloat(mlResults.secondary.savings) + parseFloat(mlResults.tertiary.savings);
    
    const flowRate = parseFloat(currentMQTTData.primary.flow_rate);
    const dailyVolume = (flowRate * 24).toFixed(0);
    const reuseValue = dailyVolume * mlResults.tertiary.reuse.value;
    const netBenefit = (reuseValue - totalCost * 24).toFixed(0);
    const roi = (netBenefit / (totalCost * 24) * 100).toFixed(1);
    
    mlResults.overall = {
        efficiency: overallEff,
        primaryEff,
        secondaryEff,
        tertiaryEff,
        totalCost: totalCost.toFixed(0),
        totalSavings: totalSavings.toFixed(0),
        dailyVolume,
        reuseValue: reuseValue.toFixed(0),
        netBenefit,
        roi,
        freshWaterSaved: dailyVolume,
        co2Reduction: (dailyVolume * 0.3).toFixed(0)
    };
}

// Display All Results
function displayAllResults() {
    displayOverview();
    displayPrimaryStage();
    displaySecondaryStage();
    displayTertiaryStage();
    displayPriorityActions();
    displayEconomicAnalysis();
    displayEnvironmentalImpact();
}

// Display Overview
function displayOverview() {
    document.getElementById('overallEfficiency').textContent = mlResults.overall.efficiency + '%';
    document.getElementById('primaryEff').textContent = mlResults.overall.primaryEff + '%';
    document.getElementById('secondaryEff').textContent = mlResults.overall.secondaryEff + '%';
    document.getElementById('tertiaryEff').textContent = mlResults.overall.tertiaryEff + '%';
    
    const status = mlResults.overall.efficiency > 90 ? '✅ Excellent' : mlResults.overall.efficiency > 85 ? '✓ Good' : '⚠ Needs Attention';
    document.getElementById('systemStatus').textContent = status;
}

// Display Primary Stage
function displayPrimaryStage() {
    const chemHTML = mlResults.primary.chemicals.map(c => `
        <div class="opt-card">
            <div class="opt-row">
                <span class="opt-label">${c.name}</span>
                <span class="opt-badge ${Math.abs(c.current - c.optimal) > 0.3 ? 'opt-badge-warning' : 'opt-badge-success'}">
                    ${Math.abs(c.current - c.optimal) > 0.3 ? 'Adjust' : 'Optimal'}
                </span>
            </div>
            <div class="opt-row">
                <div>
                    <div class="opt-sublabel">Current</div>
                    <div class="opt-value">${c.current} ${c.unit}</div>
                </div>
                <div>
                    <div class="opt-sublabel">Optimal</div>
                    <div class="opt-value" style="color: var(--color-primary);">${c.optimal} ${c.unit}</div>
                </div>
            </div>
            <div class="opt-footer">Cost: ₹${c.cost}/hr</div>
        </div>
    `).join('');
    document.getElementById('primaryChemicals').innerHTML = chemHTML;

    const equipHTML = mlResults.primary.equipment.map(e => `
        <div class="equip-card">
            <div class="equip-header">
                <span class="equip-icon">${e.icon}</span>
                <div>
                    <div class="equip-name">${e.name}</div>
                    <div class="equip-status">
                        <span class="status-dot status-dot-${e.status === 'ON' ? 'on' : 'off'}"></span>
                        ${e.status}
                    </div>
                </div>
            </div>
            <div class="equip-controls">
                <div class="equip-control-item">
                    <span>Current: ${e.current}%</span>
                    <span class="equip-arrow">→</span>
                    <span style="color: var(--color-primary); font-weight: 600;">Target: ${e.optimal}%</span>
                </div>
            </div>
        </div>
    `).join('');
    document.getElementById('primaryEquipment').innerHTML = equipHTML;
}

// Display Secondary Stage
function displaySecondaryStage() {
    const optHTML = mlResults.secondary.optimization.map(o => `
        <div class="opt-card">
            <div class="opt-row">
                <span class="opt-label">${o.name}</span>
                <span class="opt-badge ${Math.abs(o.current - o.optimal) > 10 ? 'opt-badge-warning' : 'opt-badge-success'}">
                    ${Math.abs(o.current - o.optimal) > 10 ? 'Adjust' : 'Optimal'}
                </span>
            </div>
            <div class="opt-row">
                <div>
                    <div class="opt-sublabel">Current</div>
                    <div class="opt-value">${o.current} ${o.unit}</div>
                </div>
                <div>
                    <div class="opt-sublabel">Optimal</div>
                    <div class="opt-value" style="color: var(--color-primary);">${o.optimal} ${o.unit}</div>
                </div>
            </div>
        </div>
    `).join('');
    document.getElementById('secondaryOptimization').innerHTML = optHTML;

    const equipHTML = mlResults.secondary.equipment.map(e => `
        <div class="equip-card">
            <div class="equip-header">
                <span class="equip-icon">${e.icon}</span>
                <div>
                    <div class="equip-name">${e.name}</div>
                    <div class="equip-status">
                        <span class="status-dot status-dot-${e.status === 'ON' ? 'on' : 'off'}"></span>
                        ${e.status}
                    </div>
                </div>
            </div>
            <div class="equip-controls">
                <div class="equip-control-item">
                    <span>Current: ${e.current}%</span>
                    <span class="equip-arrow">→</span>
                    <span style="color: var(--color-primary); font-weight: 600;">Target: ${e.optimal}%</span>
                </div>
            </div>
        </div>
    `).join('');
    document.getElementById('secondaryEquipment').innerHTML = equipHTML;
}

// Display Tertiary Stage
function displayTertiaryStage() {
    const chemHTML = mlResults.tertiary.chemicals.map(c => `
        <div class="opt-card">
            <div class="opt-row">
                <span class="opt-label">${c.name}</span>
                <span class="opt-badge ${Math.abs(c.current - c.optimal) > 0.5 ? 'opt-badge-warning' : 'opt-badge-success'}">
                    ${Math.abs(c.current - c.optimal) > 0.5 ? 'Adjust' : 'Optimal'}
                </span>
            </div>
            <div class="opt-row">
                <div>
                    <div class="opt-sublabel">Current</div>
                    <div class="opt-value">${c.current} ${c.unit}</div>
                </div>
                <div>
                    <div class="opt-sublabel">Optimal</div>
                    <div class="opt-value" style="color: var(--color-primary);">${c.optimal} ${c.unit}</div>
                </div>
            </div>
            <div class="opt-footer">Cost: ₹${c.cost}/hr</div>
        </div>
    `).join('');
    document.getElementById('tertiaryChemicals').innerHTML = chemHTML;

    const equipHTML = mlResults.tertiary.equipment.map(e => `
        <div class="equip-card">
            <div class="equip-header">
                <span class="equip-icon">${e.icon}</span>
                <div>
                    <div class="equip-name">${e.name}</div>
                    <div class="equip-status">
                        <span class="status-dot status-dot-${e.status === 'ON' || e.status === 'SCHEDULED' ? 'on' : 'off'}"></span>
                        ${e.status}
                    </div>
                </div>
            </div>
            <div class="equip-controls">
                <div class="equip-control-item">
                    <span>Current: ${e.current}%</span>
                    <span class="equip-arrow">→</span>
                    <span style="color: var(--color-primary); font-weight: 600;">Target: ${e.optimal}%</span>
                </div>
            </div>
        </div>
    `).join('');
    document.getElementById('tertiaryEquipment').innerHTML = equipHTML;

    const reuse = mlResults.tertiary.reuse;
    const grade = mlResults.tertiary.reuseGrade.replace('grade_', '').toUpperCase();
    const reuseHTML = `
        <div class="reuse-card" style="border-left: 4px solid ${reuse.color};">
            <div class="reuse-grade" style="color: ${reuse.color};">Grade ${grade}</div>
            <div class="reuse-name">${reuse.name}</div>
            <div class="reuse-specs">
                <div class="reuse-spec">N ≤ ${reuse.nitrogen_max} mg/L</div>
                <div class="reuse-spec">P ≤ ${reuse.phosphorus_max} mg/L</div>
                <div class="reuse-spec">Pathogens ≤ ${reuse.pathogens_max} CFU</div>
            </div>
            <div class="reuse-value">Value: ₹${reuse.value}/m³</div>
            <div class="reuse-compliance" style="color: ${reuse.color};">✓ Compliant</div>
        </div>
    `;
    document.getElementById('reuseClassification').innerHTML = reuseHTML;
}

// Display Priority Actions
function displayPriorityActions() {
    const allActions = [
        ...mlResults.primary.actions,
        ...mlResults.secondary.actions,
        ...mlResults.tertiary.actions
    ].sort((a, b) => {
        const priority = { 'CRITICAL': 0, 'HIGH': 1, 'MEDIUM': 2, 'LOW': 3 };
        return priority[a.priority] - priority[b.priority];
    });

    if (allActions.length === 0) {
        document.getElementById('allPriorityActions').innerHTML = '<div class="empty-state"><p>✅ All parameters optimal. No actions required.</p></div>';
        return;
    }

    const actionsHTML = allActions.map((action, idx) => `
        <div class="action-item">
            <div class="action-priority action-priority-${action.priority.toLowerCase()}">${action.priority}</div>
            <div class="action-content">
                <div class="action-header">
                    <span class="action-stage">${action.stage}</span>
                    <span class="action-title">${action.action}</span>
                </div>
                <div class="action-details">
                    <span>Current: <strong>${action.current}</strong></span>
                    <span class="equip-arrow">→</span>
                    <span>Target: <strong style="color: var(--color-primary);">${action.target}</strong></span>
                </div>
                <div class="action-reason">${action.reason}</div>
                <div class="action-footer">
                    <span>⏱ ${action.time}</span>
                    <button class="action-btn">Take Action</button>
                </div>
            </div>
        </div>
    `).join('');
    document.getElementById('allPriorityActions').innerHTML = actionsHTML;
}

// Display Economic Analysis
function displayEconomicAnalysis() {
    const data = mlResults.overall;
    const html = `
        <div class="analysis-grid">
            <div class="analysis-item">
                <div class="analysis-label">Daily Volume Treated</div>
                <div class="analysis-value">${data.dailyVolume} m³</div>
            </div>
            <div class="analysis-item">
                <div class="analysis-label">Operational Cost</div>
                <div class="analysis-value">₹${(parseFloat(data.totalCost) * 24).toFixed(0)}</div>
                <div class="analysis-subtitle">per day</div>
            </div>
            <div class="analysis-item">
                <div class="analysis-label">Water Reuse Value</div>
                <div class="analysis-value" style="color: var(--color-success);">₹${data.reuseValue}</div>
                <div class="analysis-subtitle">per day</div>
            </div>
            <div class="analysis-item">
                <div class="analysis-label">Net Benefit</div>
                <div class="analysis-value" style="color: ${parseFloat(data.netBenefit) > 0 ? 'var(--color-success)' : 'var(--color-error)'};">₹${data.netBenefit}</div>
                <div class="analysis-subtitle">per day</div>
            </div>
            <div class="analysis-item">
                <div class="analysis-label">ROI</div>
                <div class="analysis-value" style="color: var(--color-success);">${data.roi}%</div>
            </div>
            <div class="analysis-item">
                <div class="analysis-label">Potential Savings</div>
                <div class="analysis-value" style="color: var(--color-primary);">₹${(parseFloat(data.totalSavings) * 24).toFixed(0)}</div>
                <div class="analysis-subtitle">per day</div>
            </div>
        </div>
    `;
    document.getElementById('economicAnalysis').innerHTML = html;
}

// Display Environmental Impact
function displayEnvironmentalImpact() {
    const data = mlResults.overall;
    const html = `
        <div class="analysis-grid">
            <div class="analysis-item">
                <div class="analysis-label">Fresh Water Saved</div>
                <div class="analysis-value" style="color: var(--color-success);">${data.freshWaterSaved} m³</div>
                <div class="analysis-subtitle">per day</div>
            </div>
            <div class="analysis-item">
                <div class="analysis-label">CO₂ Reduction</div>
                <div class="analysis-value" style="color: var(--color-success);">${data.co2Reduction} kg</div>
                <div class="analysis-subtitle">per day</div>
            </div>
            <div class="analysis-item">
                <div class="analysis-label">Compliance Status</div>
                <div class="analysis-value" style="color: var(--color-success);">✓</div>
                <div class="analysis-subtitle">All standards met</div>
            </div>
            <div class="analysis-item">
                <div class="analysis-label">Environmental Score</div>
                <div class="analysis-value" style="color: var(--color-success);">${data.efficiency > 90 ? 'A+' : data.efficiency > 85 ? 'A' : 'B+'}</div>
                <div class="analysis-subtitle">Excellent</div>
            </div>
        </div>
    `;
    document.getElementById('environmentalImpact').innerHTML = html;
}

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

// Generate initial data
generateMQTTData();

// Auto-refresh every 5 seconds
setInterval(generateMQTTData, 5000);

// Generate Data Button
document.getElementById('generateDataBtn').addEventListener('click', function() {
    generateMQTTData();
    addToActionLog('Manual data refresh triggered');
});