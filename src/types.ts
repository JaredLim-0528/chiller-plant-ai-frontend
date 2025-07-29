export interface CoolingLoadDataPoint {
  time: string;
  actual?: number;
  forecast?: number;
}

export interface OptimizationMetrics {
  efficiency: number;
  powerConsumption: number;
  cost: number;
  status: 'optimal' | 'suboptimal' | 'critical';
}

export interface ChillerData {
  id: string;
  name: string;
  capacity: number;
  currentLoad: number;
  efficiency: number;
  powerConsumption: number;
  status: 'online' | 'offline' | 'maintenance';
  recommendation?: string;
  avgCOP30Days: number;
  currentCOP: number;
  runningHours: number;
  availability: number; // percentage
  priority?: number;
  priorityScore?: number;
  aiRecommendedStatus?: string;
}

export interface CoolingTowerData {
  id: string;
  name: string;
  fanSpeed: number;
  waterFlow: number;
  inletTemp: number;
  outletTemp: number;
  efficiency: number;
  powerConsumption: number;
  status: 'online' | 'offline' | 'maintenance';
  recommendation?: string;
}

export interface PumpData {
  id: string;
  name: string;
  type: 'primary' | 'secondary' | 'condenser';
  flow: number;
  pressure: number;
  speed: number;
  powerConsumption: number;
  efficiency: number;
  status: 'online' | 'offline' | 'maintenance';
  recommendation?: string;
} 