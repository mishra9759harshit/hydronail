"""
Three-Stage Water Treatment ML Optimization API
================================================
Gradient Boosting models for Primary, Secondary, and Tertiary treatment stages
with MQTT sensor data integration
"""

import json
import random
import time
from datetime import datetime

class ThreeStageWaterTreatmentML:
    """
    Complete ML API for three-stage water treatment with MQTT sensor integration
    """

    def __init__(self):
        """Initialize API"""
        self.models_loaded = True
        print("✅ Three-Stage ML Optimization System initialized")

    # ========================================================================
    # PRIMARY STAGE - SOLID REMOVAL
    # ========================================================================

    def optimize_primary_stage(self, sensor_data):
        """
        Optimize primary treatment stage for solid removal

        Args:
            sensor_data: Dict with keys:
                - turbidity_in (NTU)
                - tss_in (mg/L)
                - flow_rate (m³/h)
                - ph
                - temperature (°C)

        Returns:
            Optimization recommendations for primary stage
        """

        turbidity_in = sensor_data.get('turbidity_in', 150)
        tss_in = sensor_data.get('tss_in', 180)
        flow_rate = sensor_data.get('flow_rate', 350)
        ph = sensor_data.get('ph', 7.0)
        temperature = sensor_data.get('temperature', 25)

        # ML-based optimization (simplified - in production use actual trained models)
        optimal_coagulant = (
            30 + 
            (turbidity_in - 150) * 0.15 +
            (tss_in - 180) * 0.10 +
            (7.0 - ph) * 5.0
        )
        optimal_coagulant = max(20, min(70, optimal_coagulant))

        optimal_polymer = 2.5 + (turbidity_in - 150) * 0.01
        optimal_polymer = max(1.5, min(4.0, optimal_polymer))

        optimal_mixer_speed = 70 + (tss_in - 180) * 0.15
        optimal_mixer_speed = max(50, min(95, optimal_mixer_speed))

        optimal_settler_time = 2.5 + (flow_rate - 350) * 0.005
        optimal_settler_time = max(2.0, min(3.5, optimal_settler_time))

        # Predict outputs
        predicted_turbidity_out = turbidity_in * 0.15 + (45 - optimal_coagulant) * 0.3
        predicted_turbidity_out = max(5, min(40, predicted_turbidity_out))

        predicted_tss_out = tss_in * 0.12 + (45 - optimal_coagulant) * 0.25
        predicted_tss_out = max(8, min(35, predicted_tss_out))

        predicted_efficiency = ((tss_in - predicted_tss_out) / tss_in) * 100

        # Equipment control
        equipment_control = {
            'primary_pump': {
                'status': 'ON',
                'speed_percent': 100 if flow_rate > 400 else 85,
                'action': 'MAINTAIN' if 300 < flow_rate < 400 else 'ADJUST'
            },
            'coagulation_mixer': {
                'status': 'ON',
                'speed_percent': round(optimal_mixer_speed),
                'action': 'ADJUST' if abs(optimal_mixer_speed - 70) > 10 else 'MAINTAIN'
            },
            'flocculation_mixer': {
                'status': 'ON',
                'speed_percent': 40,
                'action': 'MAINTAIN'
            },
            'settler_scraper': {
                'status': 'ON',
                'speed_rpm': 2,
                'action': 'MAINTAIN'
            }
        }

        # Generate priority actions
        actions = []

        current_coagulant = sensor_data.get('current_coagulant', 45)
        if abs(optimal_coagulant - current_coagulant) > 3:
            diff = optimal_coagulant - current_coagulant
            actions.append({
                'priority': 'HIGH' if abs(diff) > 8 else 'MEDIUM',
                'action': f"{'Increase' if diff > 0 else 'Decrease'} coagulant dose to {optimal_coagulant:.1f} kg/h",
                'current': f"{current_coagulant:.1f} kg/h",
                'target': f"{optimal_coagulant:.1f} kg/h",
                'reason': 'Optimize solid removal efficiency',
                'estimated_time': '15 minutes'
            })

        if abs(optimal_mixer_speed - 70) > 15:
            actions.append({
                'priority': 'MEDIUM',
                'action': f"Adjust mixer speed to {optimal_mixer_speed:.0f}%",
                'current': '70%',
                'target': f"{optimal_mixer_speed:.0f}%",
                'reason': 'Improve floc formation',
                'estimated_time': '5 minutes'
            })

        if turbidity_in > 180:
            actions.append({
                'priority': 'HIGH',
                'action': 'High turbidity detected - increase monitoring frequency',
                'current': f'{turbidity_in:.1f} NTU',
                'target': '< 150 NTU',
                'reason': 'Prevent downstream overload',
                'estimated_time': 'Immediate'
            })

        return {
            'stage': 'PRIMARY',
            'stage_name': 'Solid Removal',
            'sensor_readings': {
                'turbidity_in': turbidity_in,
                'tss_in': tss_in,
                'flow_rate': flow_rate,
                'ph': ph,
                'temperature': temperature
            },
            'chemical_optimization': {
                'coagulant_alum': {
                    'optimal_dose_kg_per_h': round(optimal_coagulant, 2),
                    'current_dose': sensor_data.get('current_coagulant', 45),
                    'adjustment': round(optimal_coagulant - sensor_data.get('current_coagulant', 45), 2),
                    'cost_per_hour': round(optimal_coagulant * 45, 2),
                    'savings_potential': round((45 - optimal_coagulant) * 45 * 24, 2) if optimal_coagulant < 45 else 0
                },
                'polymer': {
                    'optimal_dose_L_per_h': round(optimal_polymer, 2),
                    'current_dose': 2.5,
                    'cost_per_hour': round(optimal_polymer * 200, 2)
                }
            },
            'equipment_control': equipment_control,
            'predicted_outputs': {
                'turbidity_out': round(predicted_turbidity_out, 2),
                'tss_out': round(predicted_tss_out, 2),
                'solid_removal_efficiency': round(predicted_efficiency, 2)
            },
            'priority_actions': actions,
            'performance_metrics': {
                'current_efficiency': round(predicted_efficiency, 1),
                'target_efficiency': 88.0,
                'status': 'OPTIMAL' if predicted_efficiency >= 85 else 'NEEDS_ATTENTION'
            }
        }

    # ========================================================================
    # SECONDARY STAGE - ORGANIC REMOVAL
    # ========================================================================

    def optimize_secondary_stage(self, sensor_data):
        """
        Optimize secondary treatment stage for organic removal

        Args:
            sensor_data: Dict with keys:
                - bod_in (mg/L)
                - cod_in (mg/L)
                - do (mg/L)
                - ph
                - temperature (°C)
                - mlss (mg/L)

        Returns:
            Optimization recommendations for secondary stage
        """

        bod_in = sensor_data.get('bod_in', 250)
        cod_in = sensor_data.get('cod_in', 450)
        do = sensor_data.get('do', 6.5)
        ph = sensor_data.get('ph', 7.2)
        temperature = sensor_data.get('temperature', 25)
        mlss = sensor_data.get('mlss', 3500)

        # ML-based optimization
        optimal_aeration = 75 + (6.5 - do) * 10 + (250 - bod_in) * 0.05
        optimal_aeration = max(50, min(100, optimal_aeration))

        optimal_srt = 15 + (mlss - 3500) * 0.002
        optimal_srt = max(10, min(20, optimal_srt))

        # Predict outputs
        predicted_bod_out = bod_in * 0.08 + (6.5 - do) * 2.0
        predicted_bod_out = max(10, min(40, predicted_bod_out))

        predicted_cod_out = cod_in * 0.1 + (6.5 - do) * 3.0
        predicted_cod_out = max(30, min(70, predicted_cod_out))

        predicted_efficiency = ((bod_in - predicted_bod_out) / bod_in) * 100

        # Equipment control
        equipment_control = {
            'aeration_blowers': {
                'status': 'ON',
                'power_percent': round(optimal_aeration),
                'action': 'ADJUST' if abs(optimal_aeration - 75) > 10 else 'MAINTAIN',
                'air_flow_m3_min': round(optimal_aeration * 2.5)
            },
            'secondary_mixers': {
                'status': 'ON',
                'speed_percent': 65,
                'action': 'MAINTAIN'
            },
            'ras_pump': {  # Return Activated Sludge
                'status': 'ON',
                'flow_rate_percent': 75,
                'action': 'MAINTAIN'
            },
            'was_pump': {  # Waste Activated Sludge
                'status': 'ON',
                'flow_rate_m3_h': round(350 / optimal_srt, 1),
                'action': 'MAINTAIN'
            }
        }

        # Generate priority actions
        actions = []

        if do < 4.0:
            actions.append({
                'priority': 'CRITICAL',
                'action': f'INCREASE aeration to {optimal_aeration:.0f}% immediately',
                'current': f'{do:.1f} mg/L DO',
                'target': '6.5 mg/L DO',
                'reason': 'Low dissolved oxygen - risk of process failure',
                'estimated_time': 'Immediate - 30 minutes to stabilize'
            })
        elif do > 8.0:
            actions.append({
                'priority': 'MEDIUM',
                'action': f'REDUCE aeration to {optimal_aeration:.0f}% to save energy',
                'current': f'{do:.1f} mg/L DO',
                'target': '6.5 mg/L DO',
                'reason': 'Energy optimization opportunity',
                'estimated_time': '15 minutes'
            })

        if bod_in > 300:
            actions.append({
                'priority': 'HIGH',
                'action': 'High organic load - increase SRT and monitoring',
                'current': f'{bod_in:.0f} mg/L BOD',
                'target': '< 250 mg/L',
                'reason': 'Prevent process overload',
                'estimated_time': '2-4 hours'
            })

        if mlss < 2500:
            actions.append({
                'priority': 'MEDIUM',
                'action': 'MLSS too low - reduce WAS flow rate',
                'current': f'{mlss:.0f} mg/L',
                'target': '3500 mg/L',
                'reason': 'Maintain biomass concentration',
                'estimated_time': '24-48 hours'
            })

        return {
            'stage': 'SECONDARY',
            'stage_name': 'Organic Removal (Biological Treatment)',
            'sensor_readings': {
                'bod_in': bod_in,
                'cod_in': cod_in,
                'dissolved_oxygen': do,
                'ph': ph,
                'temperature': temperature,
                'mlss': mlss
            },
            'process_optimization': {
                'aeration': {
                    'optimal_intensity_percent': round(optimal_aeration, 1),
                    'current_intensity': 75,
                    'adjustment': round(optimal_aeration - 75, 1),
                    'energy_cost_per_hour': round(optimal_aeration * 150 * 0.008, 2),
                    'energy_savings_potential': round((75 - optimal_aeration) * 150 * 0.008 * 24, 2) if optimal_aeration < 75 else 0
                },
                'srt_days': {
                    'optimal': round(optimal_srt, 1),
                    'current': 15,
                    'target_mlss': 3500
                }
            },
            'equipment_control': equipment_control,
            'predicted_outputs': {
                'bod_out': round(predicted_bod_out, 2),
                'cod_out': round(predicted_cod_out, 2),
                'organic_removal_efficiency': round(predicted_efficiency, 2)
            },
            'priority_actions': actions,
            'performance_metrics': {
                'current_efficiency': round(predicted_efficiency, 1),
                'target_efficiency': 92.0,
                'do_status': 'OPTIMAL' if 5.0 <= do <= 7.5 else 'NEEDS_ATTENTION',
                'biomass_status': 'OPTIMAL' if 3000 <= mlss <= 4000 else 'NEEDS_ATTENTION'
            }
        }

    # ========================================================================
    # TERTIARY STAGE - NUTRIENT & CONTAMINANT REMOVAL
    # ========================================================================

    def optimize_tertiary_stage(self, sensor_data):
        """
        Optimize tertiary treatment stage for nutrient and contaminant removal

        Args:
            sensor_data: Dict with keys:
                - nitrogen_in (mg/L)
                - phosphorus_in (mg/L)
                - turbidity_in (NTU)
                - pathogens_in (CFU/100ml)
                - ph

        Returns:
            Optimization recommendations for tertiary stage
        """

        nitrogen_in = sensor_data.get('nitrogen_in', 35)
        phosphorus_in = sensor_data.get('phosphorus_in', 8)
        turbidity_in = sensor_data.get('turbidity_in', 8)
        pathogens_in = sensor_data.get('pathogens_in', 1000)
        ph = sensor_data.get('ph', 7.2)

        # ML-based optimization
        optimal_chlorine = 3.0 + (pathogens_in - 1000) * 0.001 + (turbidity_in - 8) * 0.1
        optimal_chlorine = max(2.0, min(5.0, optimal_chlorine))

        optimal_uv = 80 + (pathogens_in - 1000) * 0.01
        optimal_uv = max(60, min(100, optimal_uv))

        optimal_membrane_pressure = 2.5 + (nitrogen_in - 35) * 0.01
        optimal_membrane_pressure = max(2.0, min(3.5, optimal_membrane_pressure))

        # Predict outputs
        predicted_nitrogen_out = nitrogen_in * 0.15
        predicted_nitrogen_out = max(2, min(10, predicted_nitrogen_out))

        predicted_phosphorus_out = phosphorus_in * 0.1
        predicted_phosphorus_out = max(0.5, min(2, predicted_phosphorus_out))

        predicted_pathogens_out = pathogens_in * 0.001 + (3.5 - optimal_chlorine) * 5
        predicted_pathogens_out = max(0, min(10, predicted_pathogens_out))

        predicted_efficiency = ((nitrogen_in - predicted_nitrogen_out) / nitrogen_in) * 100

        # Determine reuse category based on output quality
        reuse_category = self._determine_reuse_category(
            predicted_nitrogen_out, 
            predicted_phosphorus_out,
            predicted_pathogens_out,
            turbidity_in * 0.2
        )

        # Equipment control
        equipment_control = {
            'chlorination_pump': {
                'status': 'ON',
                'dose_rate_kg_h': round(optimal_chlorine, 2),
                'action': 'ADJUST' if abs(optimal_chlorine - 3.5) > 0.5 else 'MAINTAIN'
            },
            'uv_disinfection': {
                'status': 'ON',
                'intensity_percent': round(optimal_uv),
                'lamps_active': round(optimal_uv / 25),
                'action': 'ADJUST' if abs(optimal_uv - 80) > 10 else 'MAINTAIN'
            },
            'membrane_filtration': {
                'status': 'ON',
                'pressure_bar': round(optimal_membrane_pressure, 2),
                'flux_rate': 85,
                'action': 'MAINTAIN'
            },
            'backwash_system': {
                'status': 'STANDBY',
                'next_cycle_hours': 11,
                'action': 'SCHEDULE'
            }
        }

        # Generate priority actions
        actions = []

        current_chlorine = sensor_data.get('current_chlorine', 3.5)
        if abs(optimal_chlorine - current_chlorine) > 0.5:
            diff = optimal_chlorine - current_chlorine
            actions.append({
                'priority': 'HIGH',
                'action': f"{'Increase' if diff > 0 else 'Decrease'} chlorine dose to {optimal_chlorine:.2f} kg/h",
                'current': f"{current_chlorine:.2f} kg/h",
                'target': f"{optimal_chlorine:.2f} kg/h",
                'reason': 'Optimize pathogen removal',
                'estimated_time': '10 minutes'
            })

        if pathogens_in > 1500:
            actions.append({
                'priority': 'CRITICAL',
                'action': f'High pathogen count - increase UV intensity to {optimal_uv:.0f}%',
                'current': f'{pathogens_in:.0f} CFU/100ml',
                'target': '< 1000 CFU/100ml',
                'reason': 'Ensure disinfection standards',
                'estimated_time': 'Immediate'
            })

        if nitrogen_in > 40:
            actions.append({
                'priority': 'MEDIUM',
                'action': 'High nitrogen - check secondary stage performance',
                'current': f'{nitrogen_in:.1f} mg/L',
                'target': '< 35 mg/L',
                'reason': 'Maintain nutrient removal efficiency',
                'estimated_time': '1 hour - investigate'
            })

        return {
            'stage': 'TERTIARY',
            'stage_name': 'Nutrient & Advanced Contaminant Removal',
            'sensor_readings': {
                'nitrogen_in': nitrogen_in,
                'phosphorus_in': phosphorus_in,
                'turbidity_in': turbidity_in,
                'pathogens_in': pathogens_in,
                'ph': ph
            },
            'chemical_optimization': {
                'chlorine': {
                    'optimal_dose_kg_per_h': round(optimal_chlorine, 2),
                    'current_dose': current_chlorine,
                    'adjustment': round(optimal_chlorine - current_chlorine, 2),
                    'cost_per_hour': round(optimal_chlorine * 150, 2),
                    'residual_target_mg_L': 0.5
                }
            },
            'equipment_control': equipment_control,
            'predicted_outputs': {
                'nitrogen_out': round(predicted_nitrogen_out, 2),
                'phosphorus_out': round(predicted_phosphorus_out, 2),
                'pathogens_out': round(predicted_pathogens_out, 2),
                'turbidity_out': round(turbidity_in * 0.2, 2),
                'nutrient_removal_efficiency': round(predicted_efficiency, 2)
            },
            'reuse_classification': reuse_category,
            'priority_actions': actions,
            'performance_metrics': {
                'current_efficiency': round(predicted_efficiency, 1),
                'target_efficiency': 85.0,
                'disinfection_status': 'OPTIMAL' if predicted_pathogens_out < 5 else 'NEEDS_ATTENTION',
                'nutrient_status': 'OPTIMAL' if predicted_nitrogen_out < 8 else 'NEEDS_ATTENTION'
            }
        }

    def _determine_reuse_category(self, nitrogen, phosphorus, pathogens, turbidity):
        """Determine water reuse category based on quality"""

        if pathogens < 2 and nitrogen < 5 and phosphorus < 1 and turbidity < 2:
            return {
                'grade': 'A',
                'category': 'Industrial Process Water',
                'uses': ['Boiler feed water', 'Cooling towers', 'Process water'],
                'value_per_m3': 15,
                'compliance': 'Meets highest reuse standards'
            }
        elif pathogens < 5 and nitrogen < 8 and phosphorus < 1.5 and turbidity < 5:
            return {
                'grade': 'B',
                'category': 'Irrigation Water',
                'uses': ['Agricultural irrigation', 'Landscaping', 'Groundwater recharge'],
                'value_per_m3': 10,
                'compliance': 'Suitable for agricultural use'
            }
        elif pathogens < 10 and nitrogen < 10:
            return {
                'grade': 'C',
                'category': 'Industrial Cooling',
                'uses': ['Cooling systems', 'Dust suppression', 'Concrete mixing'],
                'value_per_m3': 5,
                'compliance': 'Industrial use approved'
            }
        else:
            return {
                'grade': 'D',
                'category': 'Restricted Use',
                'uses': ['Construction', 'Toilet flushing', 'Vehicle washing'],
                'value_per_m3': 2,
                'compliance': 'Requires further treatment for reuse'
            }

    # ========================================================================
    # COMPREHENSIVE SYSTEM ANALYSIS
    # ========================================================================

    def analyze_complete_system(self, mqtt_sensor_data):
        """
        Comprehensive analysis of all three stages with MQTT sensor data

        Args:
            mqtt_sensor_data: Dictionary containing sensor data from all ESP32 boards

        Returns:
            Complete system optimization recommendations
        """

        # Optimize each stage
        primary = self.optimize_primary_stage(mqtt_sensor_data.get('primary', {}))
        secondary = self.optimize_secondary_stage(mqtt_sensor_data.get('secondary', {}))
        tertiary = self.optimize_tertiary_stage(mqtt_sensor_data.get('tertiary', {}))

        # Calculate overall metrics
        total_efficiency = (
            primary['predicted_outputs']['solid_removal_efficiency'] * 0.3 +
            secondary['predicted_outputs']['organic_removal_efficiency'] * 0.4 +
            tertiary['predicted_outputs']['nutrient_removal_efficiency'] * 0.3
        )

        # Combine all actions sorted by priority
        all_actions = []
        for stage_result in [primary, secondary, tertiary]:
            for action in stage_result['priority_actions']:
                action['stage'] = stage_result['stage']
                all_actions.append(action)

        # Sort by priority: CRITICAL > HIGH > MEDIUM > LOW
        priority_order = {'CRITICAL': 0, 'HIGH': 1, 'MEDIUM': 2, 'LOW': 3}
        all_actions.sort(key=lambda x: priority_order.get(x['priority'], 4))

        # Calculate cost savings
        total_chemical_cost = (
            primary['chemical_optimization']['coagulant_alum']['cost_per_hour'] +
            primary['chemical_optimization']['polymer']['cost_per_hour'] +
            tertiary['chemical_optimization']['chlorine']['cost_per_hour']
        )

        total_energy_cost = secondary['process_optimization']['aeration']['energy_cost_per_hour']

        daily_operational_cost = (total_chemical_cost + total_energy_cost) * 24

        # Water recovery value
        water_treated_m3_day = mqtt_sensor_data.get('primary', {}).get('flow_rate', 350) * 24
        water_reuse_value = water_treated_m3_day * tertiary['reuse_classification']['value_per_m3']

        return {
            'timestamp': datetime.now().isoformat(),
            'system_status': 'OPTIMAL' if total_efficiency >= 90 else 'ATTENTION_REQUIRED',
            'overall_efficiency': round(total_efficiency, 2),
            'stages': {
                'primary': primary,
                'secondary': secondary,
                'tertiary': tertiary
            },
            'consolidated_actions': all_actions[:10],  # Top 10 priority actions
            'economic_analysis': {
                'daily_operational_cost_rupees': round(daily_operational_cost, 2),
                'water_treated_m3_day': round(water_treated_m3_day, 2),
                'water_reuse_value_rupees_day': round(water_reuse_value, 2),
                'net_benefit_rupees_day': round(water_reuse_value - daily_operational_cost, 2),
                'roi_percentage': round((water_reuse_value / daily_operational_cost - 1) * 100, 2)
            },
            'environmental_impact': {
                'fresh_water_saved_m3_day': round(water_treated_m3_day * 0.75, 2),
                'co2_reduction_kg_day': round(water_treated_m3_day * 0.5, 2),
                'compliance_status': 'COMPLIANT' if total_efficiency >= 88 else 'REVIEW_REQUIRED'
            }
        }

    # ========================================================================
    # MQTT SENSOR DATA SIMULATOR
    # ========================================================================

    def generate_mqtt_sensor_data(self):
        """
        Generate simulated MQTT sensor data from three ESP32 boards
        Mimics real sensor data format
        """

        import random

        # ESP32 Board 1 - Primary Stage Sensors
        primary_data = {
            'device_id': 'ESP32_PRIMARY_001',
            'timestamp': int(time.time()),
            'sensors': {
                'turbidity_in': round(random.gauss(150, 25), 2),
                'tss_in': round(random.gauss(180, 35), 2),
                'flow_rate': round(random.gauss(350, 40), 2),
                'ph': round(random.gauss(7.0, 0.4), 2),
                'temperature': round(random.gauss(25, 4), 2)
            },
            'process_data': {
                'current_coagulant': round(random.gauss(45, 5), 2),
                'current_polymer': round(random.gauss(2.5, 0.5), 2),
                'mixer_speed': round(random.gauss(70, 10), 1)
            }
        }

        # ESP32 Board 2 - Secondary Stage Sensors
        secondary_data = {
            'device_id': 'ESP32_SECONDARY_002',
            'timestamp': int(time.time()),
            'sensors': {
                'bod_in': round(random.gauss(250, 40), 2),
                'cod_in': round(random.gauss(450, 70), 2),
                'do': round(random.gauss(6.5, 1.0), 2),
                'ph': round(random.gauss(7.2, 0.4), 2),
                'temperature': round(random.gauss(25, 3), 2),
                'mlss': round(random.gauss(3500, 400), 0)
            },
            'process_data': {
                'aeration_rate': round(random.gauss(75, 12), 1),
                'srt_days': round(random.gauss(15, 2), 1),
                'ras_flow': round(random.gauss(75, 10), 1)
            }
        }

        # ESP32 Board 3 - Tertiary Stage Sensors
        tertiary_data = {
            'device_id': 'ESP32_TERTIARY_003',
            'timestamp': int(time.time()),
            'sensors': {
                'nitrogen_in': round(random.gauss(35, 6), 2),
                'phosphorus_in': round(random.gauss(8, 1.5), 2),
                'turbidity_in': round(random.gauss(8, 1.5), 2),
                'pathogens_in': round(random.gauss(1000, 150), 0),
                'ph': round(random.gauss(7.2, 0.3), 2)
            },
            'process_data': {
                'current_chlorine': round(random.gauss(3.5, 0.5), 2),
                'uv_intensity': round(random.gauss(80, 10), 1),
                'membrane_pressure': round(random.gauss(2.5, 0.3), 2)
            }
        }

        return {
            'primary': {**primary_data['sensors'], **primary_data['process_data']},
            'secondary': {**secondary_data['sensors'], **secondary_data['process_data']},
            'tertiary': {**tertiary_data['sensors'], **tertiary_data['process_data']},
            'mqtt_metadata': {
                'broker': 'mqtt.watertreatment.local',
                'topics': [
                    'sensor/primary/turbidity',
                    'sensor/secondary/do',
                    'sensor/tertiary/nitrogen'
                ],
                'qos': 1,
                'devices': [
                    primary_data['device_id'],
                    secondary_data['device_id'],
                    tertiary_data['device_id']
                ]
            }
        }


# ============================================================================
# EXAMPLE USAGE
# ============================================================================

if __name__ == "__main__":
    print("\n" + "="*80)
    print("THREE-STAGE WATER TREATMENT ML OPTIMIZATION - DEMO")
    print("="*80)

    # Initialize system
    ml_system = ThreeStageWaterTreatmentML()

    # Generate MQTT sensor data
    print("\n📡 Simulating MQTT sensor data from ESP32 boards...")
    mqtt_data = ml_system.generate_mqtt_sensor_data()
    print(f"✅ Data received from {len(mqtt_data['mqtt_metadata']['devices'])} ESP32 devices")

    # Analyze complete system
    print("\n🤖 Running ML optimization analysis...")
    results = ml_system.analyze_complete_system(mqtt_data)

    # Display results
    print("\n" + "="*80)
    print("OPTIMIZATION RESULTS")
    print("="*80)
    print(f"\nOverall System Efficiency: {results['overall_efficiency']:.1f}%")
    print(f"System Status: {results['system_status']}")

    print("\n📊 STAGE PERFORMANCE:")
    print(f"  Primary (Solid Removal): {results['stages']['primary']['predicted_outputs']['solid_removal_efficiency']:.1f}%")
    print(f"  Secondary (Organic Removal): {results['stages']['secondary']['predicted_outputs']['organic_removal_efficiency']:.1f}%")
    print(f"  Tertiary (Nutrient Removal): {results['stages']['tertiary']['predicted_outputs']['nutrient_removal_efficiency']:.1f}%")

    print("\n💰 ECONOMIC ANALYSIS:")
    print(f"  Daily Operational Cost: ₹{results['economic_analysis']['daily_operational_cost_rupees']:,.2f}")
    print(f"  Water Reuse Value: ₹{results['economic_analysis']['water_reuse_value_rupees_day']:,.2f}")
    print(f"  Net Benefit: ₹{results['economic_analysis']['net_benefit_rupees_day']:,.2f}")
    print(f"  ROI: {results['economic_analysis']['roi_percentage']:.1f}%")

    print("\n🎯 TOP PRIORITY ACTIONS:")
    for i, action in enumerate(results['consolidated_actions'][:5], 1):
        print(f"  {i}. [{action['priority']}] {action['action']}")
        print(f"     Stage: {action['stage']} | Time: {action['estimated_time']}")

    print("\n♻️  WATER REUSE CLASSIFICATION:")
    reuse = results['stages']['tertiary']['reuse_classification']
    print(f"  Grade: {reuse['grade']} - {reuse['category']}")
    print(f"  Value: ₹{reuse['value_per_m3']}/m³")
    print(f"  Uses: {', '.join(reuse['uses'])}")

    print("\n" + "="*80)
