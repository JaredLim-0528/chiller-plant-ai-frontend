import type { CoolingLoadDataPoint, ChillerData, CoolingTowerData, PumpData } from '../types';

// Generate mock cooling load data for today
export const generateCoolingLoadData = (): CoolingLoadDataPoint[] => {
  const data: CoolingLoadDataPoint[] = [];
  const now = new Date();
  const currentHour = now.getHours();
  
  // Generate data for 24 hours
  for (let hour = 0; hour < 24; hour++) {
    const time = `${hour.toString().padStart(2, '0')}:00`;
    
    // Simulate typical cooling load pattern
    let baseLoad = 1000; // Base load in TR
    
    // Peak during afternoon hours (12-18)
    if (hour >= 12 && hour <= 18) {
      baseLoad += 800 * Math.sin((hour - 12) * Math.PI / 6);
    }
    
    // Add some variability
    const variation = Math.random() * 200 - 100;
    
    // Always show forecast for the entire day
    const forecastValue = Math.max(500, baseLoad + variation * 0.5);
    
    if (hour <= currentHour) {
      // Actual data (with some noise) + forecast
      data.push({
        time,
        actual: Math.max(500, baseLoad + variation),
        forecast: forecastValue,
      });
    } else {
      // Only forecast data for future hours
      data.push({
        time,
        forecast: forecastValue,
      });
    }
  }
  
  return data;
};

export const mockChillers: ChillerData[] = [
  {
    id: 'CH01',
    name: 'Chiller 01',
    capacity: 1200,
    currentLoad: 780,
    efficiency: 0.52,
    powerConsumption: 1500,
    status: 'online',
    recommendation: 'Operating at optimal efficiency',
    avgCOP30Days: 5.8,
    currentCOP: 6.2,
    runningHours: 480,
    availability: 95.2
  },
  {
    id: 'CH02',
    name: 'Chiller 02',
    capacity: 1200,
    currentLoad: 920,
    efficiency: 0.48,
    powerConsumption: 1917,
    status: 'online',
    recommendation: 'Consider reducing load for better efficiency',
    avgCOP30Days: 5.2,
    currentCOP: 4.8,
    runningHours: 620,
    availability: 88.7
  },
  {
    id: 'CH03',
    name: 'Chiller 03',
    capacity: 1000,
    currentLoad: 0,
    efficiency: 0,
    powerConsumption: 0,
    status: 'offline',
    recommendation: 'Ready for staging if load increases',
    avgCOP30Days: 6.1,
    currentCOP: 0,
    runningHours: 280,
    availability: 92.3
  },
  {
    id: 'CH04',
    name: 'Chiller 04',
    capacity: 1000,
    currentLoad: 0,
    efficiency: 0,
    powerConsumption: 0,
    status: 'maintenance',
    recommendation: 'Scheduled maintenance until tomorrow',
    avgCOP30Days: 5.5,
    currentCOP: 0,
    runningHours: 720,
    availability: 76.8
  }
];

export const mockCoolingTowers: CoolingTowerData[] = [
  {
    id: 'CT01',
    name: 'Cooling Tower 01',
    fanSpeed: 75,
    waterFlow: 3200,
    inletTemp: 95,
    outletTemp: 85,
    efficiency: 82,
    powerConsumption: 45,
    status: 'online',
    recommendation: 'Optimal operation'
  },
  {
    id: 'CT02',
    name: 'Cooling Tower 02',
    fanSpeed: 68,
    waterFlow: 2800,
    inletTemp: 94,
    outletTemp: 84,
    efficiency: 85,
    powerConsumption: 38,
    status: 'online',
    recommendation: 'Excellent efficiency'
  },
  {
    id: 'CT03',
    name: 'Cooling Tower 03',
    fanSpeed: 0,
    waterFlow: 0,
    inletTemp: 0,
    outletTemp: 0,
    efficiency: 0,
    powerConsumption: 0,
    status: 'offline',
    recommendation: 'Standby - ready for activation'
  }
];

export const mockPumps: PumpData[] = [
  {
    id: 'PP01',
    name: 'Primary Pump 01',
    type: 'primary',
    flow: 3200,
    pressure: 45,
    speed: 85,
    powerConsumption: 125,
    efficiency: 78,
    status: 'online',
    recommendation: 'Operating efficiently'
  },
  {
    id: 'PP02',
    name: 'Primary Pump 02',
    type: 'primary',
    flow: 2800,
    pressure: 42,
    speed: 80,
    powerConsumption: 110,
    efficiency: 82,
    status: 'online',
    recommendation: 'Good efficiency'
  },
  {
    id: 'SP01',
    name: 'Secondary Pump 01',
    type: 'secondary',
    flow: 2500,
    pressure: 35,
    speed: 72,
    powerConsumption: 95,
    efficiency: 75,
    status: 'online',
    recommendation: 'Consider VFD optimization'
  },
  {
    id: 'CP01',
    name: 'Condenser Pump 01',
    type: 'condenser',
    flow: 4000,
    pressure: 28,
    speed: 90,
    powerConsumption: 140,
    efficiency: 80,
    status: 'online',
    recommendation: 'Operating within parameters'
  }
]; 