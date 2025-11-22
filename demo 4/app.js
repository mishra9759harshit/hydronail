// System configuration and data
const stagesConfig = [
  {
    id: 'stage1',
    name: 'Primary Treatment',
    processes: ['Screening', 'Aeration', 'Coagulation', 'Flocculation', 'Sedimentation'],
    sensors: [
      { id: 'tss', label: 'TSS', min: 150, max: 350, optimal: 200, unit: 'mg/L' },
      { id: 'turbidity', label: 'Turbidity', min: 80, max: 200, optimal: 100, unit: 'NTU' },
      { id: 'flowRate', label: 'Flow Rate', min: 1000, max: 1500, optimal: 1250, unit: 'L/h' },
      { id: 'pH', label: 'pH', min: 6.5, max: 8.5, optimal: 7.2, unit: '' },
      { id: 'temperature', label: 'Temperature', min: 20, max: 30, optimal: 25, unit: '°C' }
    ]
  },
  {
    id: 'stage2',
    name: 'Secondary Treatment',
    processes: ['Filtration', 'Biological Treatment'],
    sensors: [
      { id: 'bod', label: 'BOD', min: 15, max: 45, optimal: 20, unit: 'mg/L' },
      { id: 'cod', label: 'COD', min: 30, max: 90, optimal: 40, unit: 'mg/L' },
      { id: 'do', label: 'DO', min: 4, max: 8, optimal: 6.5, unit: 'mg/L' },
      { id: 'mlss', label: 'MLSS', min: 2000, max: 4000, optimal: 3000, unit: 'mg/L' },
      { id: 'orp', label: 'ORP', min: 150, max: 350, optimal: 250, unit: 'mV' }
    ]
  },
  {
    id: 'stage3',
    name: 'Tertiary Treatment',
    processes: ['Disinfection', 'pH Adjustment'],
    sensors: [
      { id: 'ammonia', label: 'NH3-N', min: 0.5, max: 5, optimal: 1.5, unit: 'mg/L' },
      { id: 'phosphate', label: 'PO4', min: 0.3, max: 2, optimal: 0.8, unit: 'mg/L' },
      { id: 'nitrate', label: 'NO3', min: 5, max: 20, optimal: 10, unit: 'mg/L' },
      { id: 'tds', label: 'TDS', min: 200, max: 500, optimal: 300, unit: 'mg/L' },
      { id: 'chlorine', label: 'Cl2', min: 0.5, max: 2, optimal: 1.2, unit: 'mg/L' }
    ]
  },
  {
    id: 'stage4',
    name: 'Quality Assessment',
    processes: ['Storage', 'Distribution'],
    sensors: [
      { id: 'finalPH', label: 'Final pH', min: 6.5, max: 8.5, optimal: 7.5, unit: '' },
      { id: 'finalTurbidity', label: 'Turbidity', min: 0.5, max: 2, optimal: 1, unit: 'NTU' },
      { id: 'coliform', label: 'Coliform', min: 0, max: 10, optimal: 0, unit: 'MPN' },
      { id: 'conductivity', label: 'Conductivity', min: 200, max: 800, optimal: 400, unit: 'μS/cm' }
    ]
  }
];

const machinesConfig = [
  { id: 'intakePump', name: 'Raw Water Intake Pump', stage: 1, process: 'Screening', defaultSpeed: 75 },
  { id: 'barScreen', name: 'Bar Screen System', stage: 1, process: 'Screening', defaultSpeed: 60 },
  { id: 'aerator1', name: 'Primary Aerator', stage: 1, process: 'Aeration', defaultSpeed: 85 },
  { id: 'coagulantPump', name: 'Coagulant Dosing Pump', stage: 1, process: 'Coagulation', defaultSpeed: 45 },
  { id: 'flocculatorMixer', name: 'Flocculation Mixer', stage: 1, process: 'Flocculation', defaultSpeed: 55 },
  { id: 'sedimentationTank', name: 'Sedimentation Tank Rake', stage: 1, process: 'Sedimentation', defaultSpeed: 30 },
  { id: 'sandFilter', name: 'Multi-Media Sand Filter', stage: 2, process: 'Filtration', defaultSpeed: 65 },
  { id: 'carbonFilter', name: 'Activated Carbon Filter', stage: 2, process: 'Filtration', defaultSpeed: 70 },
  { id: 'backwashPump', name: 'Filter Backwash Pump', stage: 2, process: 'Filtration', defaultSpeed: 80 },
  { id: 'uvDisinfection', name: 'UV Disinfection System', stage: 3, process: 'Disinfection', defaultSpeed: 90 },
  { id: 'chlorineDosing', name: 'Chlorine Dosing Unit', stage: 3, process: 'Disinfection', defaultSpeed: 40 },
  { id: 'phAdjuster', name: 'pH Adjustment Pump', stage: 3, process: 'pH Adjustment', defaultSpeed: 35 },
  { id: 'storagePump', name: 'Storage Tank Transfer Pump', stage: 4, process: 'Storage', defaultSpeed: 80 },
  { id: 'distributionPump', name: 'Distribution Pump', stage: 4, process: 'Distribution', defaultSpeed: 75 }
];

// State management
let sensorData = {};
let machineStates = {};
let alertHistory = [];
let currentAlert = null;
let currentStageTab = 1;

// Initialize default sensor data
function initializeDefaultData() {
  stagesConfig.forEach(stage => {
    sensorData[stage.id] = {};
    stage.sensors.forEach(sensor => {
      // Generate random value within range, closer to optimal
      const range = sensor.max - sensor.min;
      const deviation = (Math.random() - 0.5) * range * 0.3;
      sensorData[stage.id][sensor.id] = Math.max(sensor.min, Math.min(sensor.max, sensor.optimal + deviation));
    });
  });
}

// Initialize machine states
function initializeMachines() {
  machinesConfig.forEach(machine => {
    machineStates[machine.id] = {
      speed: machine.defaultSpeed,
      running: true
    };
  });
}

// Generate AI recommendations
function generateAIRecommendations() {
  const recommendations = [
    {
      title: 'Chemical Dosing Optimization',
      description: 'Reduce coagulant dosing by 15% based on current turbidity levels',
      priority: 'high',
      impact: 85,
      confidence: 92,
      category: 'chemical'
    },
    {
      title: 'Machine Speed Adjustment',
      description: 'Increase filtration rate to match current flow demand',
      priority: 'medium',
      impact: 65,
      confidence: 88,
      category: 'machine'
    },
    {
      title: 'Process Time Reduction',
      description: 'Optimize sedimentation time to improve throughput by 12%',
      priority: 'medium',
      impact: 70,
      confidence: 85,
      category: 'time'
    },
    {
      title: 'Energy Optimization',
      description: 'Reduce pump speeds during low-demand hours to save 20% energy',
      priority: 'low',
      impact: 55,
      confidence: 90,
      category: 'energy'
    }
  ];

  return recommendations;
}

// Render AI recommendations
function renderAIRecommendations() {
  const container = document.getElementById('recommendationsGrid');
  const recommendations = generateAIRecommendations();

  container.innerHTML = recommendations.map(rec => `
    <div class="recommendation-card">
      <div class="recommendation-header">
        <h3 class="recommendation-title">${rec.title}</h3>
        <span class="priority-badge priority-${rec.priority}">${rec.priority}</span>
      </div>
      <p class="recommendation-description">${rec.description}</p>
      <div class="impact-section">
        <div class="impact-label">
          <span>Impact Score</span>
          <span>${rec.impact}%</span>
        </div>
        <div class="impact-bar">
          <div class="impact-fill" style="width: ${rec.impact}%"></div>
        </div>
      </div>
      <div class="confidence-score">
        <span>AI Confidence:</span>
        <span class="confidence-value">${rec.confidence}%</span>
      </div>
    </div>
  `).join('');
}

// Check for critical conditions
function checkCriticalConditions() {
  let criticalIssues = [];

  stagesConfig.forEach(stage => {
    stage.sensors.forEach(sensor => {
      const value = sensorData[stage.id][sensor.id];
      const deviation = Math.abs(value - sensor.optimal) / (sensor.max - sensor.min);

      if (deviation > 0.4) {
        criticalIssues.push({
          stage: stage.name,
          sensor: sensor.label,
          value: value.toFixed(2),
          unit: sensor.unit,
          optimal: sensor.optimal,
          severity: deviation > 0.6 ? 'critical' : 'warning'
        });
      }
    });
  });

  // Update alert count
  document.getElementById('alertCount').textContent = criticalIssues.length;

  // Show modal if critical issues exist
  if (criticalIssues.length > 0 && !currentAlert) {
    showCriticalAlert(criticalIssues[0]);
  }
}

// Show critical alert modal
function showCriticalAlert(issue) {
  currentAlert = issue;
  const modal = document.getElementById('alertModal');
  const icon = document.getElementById('alertIcon');
  const stage = document.getElementById('alertStage');
  const message = document.getElementById('alertMessage');
  const value = document.getElementById('alertValue');
  const action = document.getElementById('alertAction');

  // Set icon based on severity
  icon.textContent = issue.severity === 'critical' ? '🚨' : '⚠️';

  // Set content
  stage.textContent = `${issue.stage} - ${issue.sensor}`;
  message.textContent = `${issue.severity.toUpperCase()}: Parameter out of optimal range`;
  value.textContent = `Current: ${issue.value}${issue.unit} | Optimal: ${issue.optimal}${issue.unit}`;
  action.textContent = 'Recommended: Adjust process parameters to return to optimal range';

  // Add to history
  addToAlertHistory(issue);

  // Show modal
  modal.classList.remove('hidden');
}

// Close alert modal
function closeAlertModal() {
  const modal = document.getElementById('alertModal');
  modal.classList.add('hidden');
  currentAlert = null;
}

// Acknowledge alert
function acknowledgeAlert() {
  if (currentAlert) {
    console.log('Alert acknowledged:', currentAlert);
    closeAlertModal();
  }
}

// Auto-fix issue
function autoFixIssue() {
  if (currentAlert) {
    // Find the sensor and adjust to optimal
    stagesConfig.forEach(stage => {
      if (stage.name === currentAlert.stage) {
        stage.sensors.forEach(sensor => {
          if (sensor.label === currentAlert.sensor) {
            sensorData[stage.id][sensor.id] = sensor.optimal;
          }
        });
      }
    });

    showFeedback('Auto-fix applied successfully!', 'success');
    renderSensorDashboard();
    closeAlertModal();
    checkCriticalConditions();
  }
}

// Add to alert history
function addToAlertHistory(issue) {
  const timestamp = new Date().toLocaleTimeString();
  alertHistory.unshift({ ...issue, timestamp });
  if (alertHistory.length > 10) alertHistory.pop();

  const historyContainer = document.getElementById('alertHistoryList');
  historyContainer.innerHTML = alertHistory.map(alert => `
    <div class="alert-history-item">
      <div><strong>${alert.stage}</strong> - ${alert.sensor}</div>
      <div>${alert.value}${alert.unit}</div>
      <div class="alert-history-time">${alert.timestamp}</div>
    </div>
  `).join('');
}

// Render sensor dashboard
function renderSensorDashboard() {
  const container = document.getElementById('stagesContainer');

  container.innerHTML = stagesConfig.map(stage => {
    return `
      <div class="stage-card">
        <div class="stage-header">
          <h3 class="stage-name">${stage.name}</h3>
          <p class="stage-processes">${stage.processes.join(' → ')}</p>
        </div>
        <div class="sensors-grid">
          ${stage.sensors.map(sensor => {
            const value = sensorData[stage.id][sensor.id];
            const status = getSensorStatus(value, sensor);
            const percentage = ((value - sensor.min) / (sensor.max - sensor.min)) * 100;
            
            return `
              <div class="sensor-item">
                <div class="sensor-label-row">
                  <span class="sensor-name">${sensor.label}</span>
                  <span class="sensor-status status-${status}">${status.toUpperCase()}</span>
                </div>
                <div class="sensor-value">${value.toFixed(2)}${sensor.unit}</div>
                <div class="sensor-bar">
                  <div class="sensor-bar-fill" style="width: ${percentage}%; background: ${getStatusColor(status)}"></div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }).join('');
}

// Get sensor status
function getSensorStatus(value, sensor) {
  const tolerance = (sensor.max - sensor.min) * 0.2;
  if (Math.abs(value - sensor.optimal) <= tolerance) return 'optimal';
  if (Math.abs(value - sensor.optimal) <= tolerance * 2) return 'warning';
  return 'critical';
}

// Get status color
function getStatusColor(status) {
  const colors = {
    optimal: 'var(--color-success)',
    warning: 'var(--color-warning)',
    critical: 'var(--color-error)'
  };
  return colors[status];
}

// Switch input tab
function switchInputTab(tab) {
  const tabs = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.input-panel');

  tabs.forEach(t => t.classList.remove('active'));
  panels.forEach(p => p.classList.add('hidden'));

  if (tab === 'json') {
    tabs[0].classList.add('active');
    document.getElementById('jsonInputPanel').classList.remove('hidden');
  } else {
    tabs[1].classList.add('active');
    document.getElementById('formInputPanel').classList.remove('hidden');
  }
}

// Show sample JSON
function showSampleJSON() {
  const sample = {
    stage1: { tss: 220, turbidity: 95, flowRate: 1250, pH: 7.2, temperature: 25 },
    stage2: { bod: 22, cod: 42, do: 6.5, mlss: 3000, orp: 250 },
    stage3: { ammonia: 1.5, phosphate: 0.8, nitrate: 10, tds: 300, chlorine: 1.2 },
    stage4: { finalPH: 7.5, finalTurbidity: 1.0, coliform: 0, conductivity: 400 }
  };

  document.getElementById('jsonInput').value = JSON.stringify(sample, null, 2);
}

// Load JSON data
function loadJSONData() {
  const input = document.getElementById('jsonInput').value;

  try {
    const data = JSON.parse(input);
    let valid = true;

    // Validate structure
    stagesConfig.forEach(stage => {
      if (!data[stage.id]) {
        valid = false;
        throw new Error(`Missing data for ${stage.id}`);
      }

      stage.sensors.forEach(sensor => {
        if (data[stage.id][sensor.id] === undefined) {
          valid = false;
          throw new Error(`Missing sensor ${sensor.id} in ${stage.id}`);
        }

        const value = parseFloat(data[stage.id][sensor.id]);
        if (isNaN(value)) {
          valid = false;
          throw new Error(`Invalid value for ${sensor.id}`);
        }

        sensorData[stage.id][sensor.id] = value;
      });
    });

    showFeedback('Sensor data loaded successfully!', 'success');
    renderSensorDashboard();
    checkCriticalConditions();
    updateLastUpdateTime();

  } catch (error) {
    showFeedback(`Error: ${error.message}`, 'error');
  }
}

// Export sensor data
function exportSensorData() {
  const dataStr = JSON.stringify(sensorData, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'sensor-data-export.json';
  link.click();
  URL.revokeObjectURL(url);
}

// Reset to default
function resetToDefault() {
  initializeDefaultData();
  renderSensorDashboard();
  renderStageForms();
  checkCriticalConditions();
  showFeedback('Data reset to default values', 'success');
}

// Show feedback message
function showFeedback(message, type) {
  const feedback = document.getElementById('jsonFeedback');
  feedback.textContent = message;
  feedback.className = `feedback-message ${type}`;
  feedback.style.display = 'block';

  setTimeout(() => {
    feedback.style.display = 'none';
  }, 3000);
}

// Switch stage tab
function switchStageTab(stageNum) {
  currentStageTab = stageNum;
  const tabs = document.querySelectorAll('.stage-tab');
  const forms = document.querySelectorAll('.stage-form');

  tabs.forEach((tab, index) => {
    if (index + 1 === stageNum) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });

  forms.forEach((form, index) => {
    if (index + 1 === stageNum) {
      form.classList.add('active');
    } else {
      form.classList.remove('active');
    }
  });
}

// Render stage forms
function renderStageForms() {
  const container = document.getElementById('stageFormsContainer');

  container.innerHTML = stagesConfig.map((stage, index) => `
    <div class="stage-form ${index === 0 ? 'active' : ''}" id="form-${stage.id}">
      <div class="sensor-inputs-grid">
        ${stage.sensors.map(sensor => `
          <div class="sensor-input-group">
            <label class="sensor-input-label">${sensor.label}</label>
            <div class="sensor-input-wrapper">
              <input 
                type="number" 
                class="sensor-input" 
                id="input-${stage.id}-${sensor.id}"
                value="${sensorData[stage.id][sensor.id].toFixed(2)}"
                min="${sensor.min}"
                max="${sensor.max}"
                step="0.1"
                onchange="validateInput('${stage.id}', '${sensor.id}')"
              />
            </div>
            <span class="input-range-info">Range: ${sensor.min}-${sensor.max}${sensor.unit} | Optimal: ${sensor.optimal}${sensor.unit}</span>
          </div>
        `).join('')}
      </div>
      <button class="btn btn--primary" onclick="applyStageChanges('${stage.id}')">Apply Changes to ${stage.name}</button>
    </div>
  `).join('');
}

// Validate input
function validateInput(stageId, sensorId) {
  const input = document.getElementById(`input-${stageId}-${sensorId}`);
  const value = parseFloat(input.value);
  const min = parseFloat(input.min);
  const max = parseFloat(input.max);

  if (value < min || value > max) {
    input.classList.add('invalid');
  } else {
    input.classList.remove('invalid');
  }
}

// Apply stage changes
function applyStageChanges(stageId) {
  const stage = stagesConfig.find(s => s.id === stageId);
  let allValid = true;

  stage.sensors.forEach(sensor => {
    const input = document.getElementById(`input-${stageId}-${sensor.id}`);
    const value = parseFloat(input.value);

    if (value < sensor.min || value > sensor.max) {
      allValid = false;
      input.classList.add('invalid');
    } else {
      sensorData[stageId][sensor.id] = value;
      input.classList.remove('invalid');
    }
  });

  if (allValid) {
    showFeedback(`Changes applied to ${stage.name}`, 'success');
    renderSensorDashboard();
    checkCriticalConditions();
    updateLastUpdateTime();
  } else {
    showFeedback('Some values are out of range', 'error');
  }
}

// Render machine controls
function renderMachineControls() {
  const container = document.getElementById('machineGroups');
  const groupedMachines = {};

  machinesConfig.forEach(machine => {
    const key = `Stage ${machine.stage}`;
    if (!groupedMachines[key]) {
      groupedMachines[key] = [];
    }
    groupedMachines[key].push(machine);
  });

  container.innerHTML = Object.entries(groupedMachines).map(([groupName, machines]) => `
    <div class="machine-group">
      <h3 class="machine-group-title">${groupName}</h3>
      <div class="machine-controls">
        ${machines.map(machine => `
          <div class="machine-control">
            <div class="machine-header">
              <span class="machine-name">${machine.name}</span>
              <div class="machine-status">
                <span class="status-indicator ${machineStates[machine.id].running ? '' : 'stopped'}"></span>
                <span>${machineStates[machine.id].running ? 'Running' : 'Stopped'}</span>
              </div>
            </div>
            <div class="machine-slider-wrapper">
              <input 
                type="range" 
                class="machine-slider" 
                min="0" 
                max="100" 
                value="${machineStates[machine.id].speed}"
                oninput="updateMachineSpeed('${machine.id}', this.value)"
              />
              <span class="speed-value" id="speed-${machine.id}">${machineStates[machine.id].speed}%</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
}

// Update machine speed
function updateMachineSpeed(machineId, speed) {
  machineStates[machineId].speed = parseInt(speed);
  machineStates[machineId].running = speed > 0;
  document.getElementById(`speed-${machineId}`).textContent = `${speed}%`;
}

// Apply preset
function applyPreset(preset) {
  const presets = {
    optimal: 1.0,
    high: 1.2,
    medium: 0.8,
    low: 0.5
  };

  const multiplier = presets[preset] || 1.0;

  machinesConfig.forEach(machine => {
    const newSpeed = Math.min(100, Math.max(0, machine.defaultSpeed * multiplier));
    machineStates[machine.id].speed = Math.round(newSpeed);
    machineStates[machine.id].running = newSpeed > 0;
  });

  renderMachineControls();
  showFeedback(`${preset.charAt(0).toUpperCase() + preset.slice(1)} preset applied`, 'success');
}

// Start all machines
function startAllMachines() {
  machinesConfig.forEach(machine => {
    machineStates[machine.id].speed = machine.defaultSpeed;
    machineStates[machine.id].running = true;
  });
  renderMachineControls();
  showFeedback('All machines started', 'success');
}

// Stop all machines
function stopAllMachines() {
  machinesConfig.forEach(machine => {
    machineStates[machine.id].speed = 0;
    machineStates[machine.id].running = false;
  });
  renderMachineControls();
  showFeedback('All machines stopped', 'success');
}

// Update last update time
function updateLastUpdateTime() {
  const now = new Date();
  const timeStr = now.toLocaleTimeString();
  document.getElementById('lastUpdate').textContent = `Updated: ${timeStr}`;
}

// Initialize application
function initializeApp() {
  initializeDefaultData();
  initializeMachines();
  renderAIRecommendations();
  renderSensorDashboard();
  renderStageForms();
  renderMachineControls();
  checkCriticalConditions();
  updateLastUpdateTime();

  // Simulate live updates
  setInterval(() => {
    // Small random variations
    stagesConfig.forEach(stage => {
      stage.sensors.forEach(sensor => {
        const current = sensorData[stage.id][sensor.id];
        const variation = (Math.random() - 0.5) * (sensor.max - sensor.min) * 0.05;
        sensorData[stage.id][sensor.id] = Math.max(sensor.min, Math.min(sensor.max, current + variation));
      });
    });

    renderSensorDashboard();
    checkCriticalConditions();
    updateLastUpdateTime();
  }, 5000);
}

// Start the application
initializeApp();