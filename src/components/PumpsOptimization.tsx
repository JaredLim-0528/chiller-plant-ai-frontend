import React, { useState } from 'react';
import { Settings, CheckCircle, XCircle, AlertTriangle, Target } from 'lucide-react';
import type { PumpData } from '../types';

interface PumpsOptimizationProps {
  pumps: PumpData[];
}

export const PumpsOptimization: React.FC<PumpsOptimizationProps> = ({ pumps }) => {
  // Setpoint state management
  const [setpoints, setSetpoints] = useState({
    primaryPumpSpeed: 85,
    secondaryPumpSpeed: 80,
    pressureSetpoint: 45,
    controlMode: 'auto' as 'auto' | 'manual'
  });

  // Command feedback state
  const [strategyCommandSent, setStrategyCommandSent] = useState(false);
  const [setpointsCommandSent, setSetpointsCommandSent] = useState(false);

  // Strategy control mode
  const [strategyControlMode, setStrategyControlMode] = useState<'auto' | 'manual'>('auto');
  const [appliedStrategyControlMode, setAppliedStrategyControlMode] = useState<'auto' | 'manual'>('auto');
  const [appliedSetpointControlMode, setAppliedSetpointControlMode] = useState<'auto' | 'manual'>('auto');

  const getSimpleStatus = (status: PumpData['status']) => {
    return status === 'online' ? 'ON' : 'OFF';
  };

  const getStatusColor = (status: string) => {
    return status === 'ON' ? 'text-emerald-400' : 'text-gray-400';
  };

  const getAIRecommendation = (pump: PumpData) => {
    if (pump.efficiency < 75) return 'TURN OFF'; // Low efficiency pumps
    if (pump.status === 'online') return 'KEEP SAME';
    return 'KEEP SAME';
  };

  const getRecommendationColor = (action: string) => {
    switch (action) {
      case 'KEEP SAME': return 'text-blue-400';
      case 'TURN ON': return 'text-emerald-400';
      case 'TURN OFF': return 'text-amber-400';
      default: return 'text-gray-400';
    }
  };

  // Handle apply strategy
  const handleApplyStrategy = () => {
    setAppliedStrategyControlMode(strategyControlMode);
    setStrategyCommandSent(true);
    setTimeout(() => setStrategyCommandSent(false), 3000);
  };

  // Handle apply setpoints
  const handleApplySetpoints = () => {
    setAppliedSetpointControlMode(setpoints.controlMode);
    setSetpointsCommandSent(true);
    setTimeout(() => setSetpointsCommandSent(false), 3000);
  };

  return (
    <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Settings className="w-6 h-6 text-indigo-400 mr-3" />
          <h2 className="text-xl font-semibold text-white">Pumps Optimization</h2>
        </div>
      </div>

      {/* Main Layout: Strategy on top, Setpoint on bottom */}
      <div className="space-y-6">
        {/* Top - Pump Strategy */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-600">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Settings className="w-6 h-6 text-indigo-400 mr-3" />
              <h3 className="text-xl font-semibold text-white">Pump Strategy Optimization</h3>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              appliedStrategyControlMode === 'auto' 
                ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-700/30' 
                : 'bg-gray-900/30 text-gray-400 border border-gray-700/30'
            }`}>
              {appliedStrategyControlMode === 'auto' ? 'Auto' : 'Manual'}
            </div>
          </div>

          {/* Pumps List */}
          <div className="mb-6">
            {/* Column Headers */}
            <div className="grid grid-cols-3 gap-4 py-3 border-b border-gray-500 mb-4">
              <h4 className="text-sm font-semibold text-gray-300">Pump Name</h4>
              <h4 className="text-sm font-semibold text-gray-300 text-center">Current Status</h4>
              <h4 className="text-sm font-semibold text-gray-300 text-center">AI Recommendation</h4>
            </div>

            {/* Pump Rows */}
            <div className="space-y-2">
              {pumps.map((pump) => (
                <div key={pump.id} className="grid grid-cols-3 gap-4 items-center py-3 border-b border-gray-600 last:border-b-0">
                  <h4 className="text-lg font-medium text-white">{pump.name}</h4>
                  <div className="text-center">
                    <span className={`text-lg font-bold ${getStatusColor(getSimpleStatus(pump.status))}`}>
                      {getSimpleStatus(pump.status)}
                    </span>
                  </div>
                  <div className="text-center">
                    <span className={`text-lg font-bold ${getRecommendationColor(getAIRecommendation(pump))}`}>
                      {getAIRecommendation(pump)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Control Mode */}
          <div className="mb-4">
            <h4 className="text-lg font-medium text-white flex items-center mb-3">
              <Settings className="w-5 h-5 text-emerald-400 mr-2" />
              Control Mode
            </h4>
            <div className="flex gap-6">
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={strategyControlMode === 'auto'}
                  onChange={() => setStrategyControlMode('auto')}
                  className="mr-2"
                />
                <span className="text-gray-300">Auto Optimization</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={strategyControlMode === 'manual'}
                  onChange={() => setStrategyControlMode('manual')}
                  className="mr-2"
                />
                <span className="text-gray-300">Manual Control</span>
              </label>
            </div>
          </div>

          {/* Command Sent Feedback */}
          {strategyCommandSent && (
            <div className="bg-gradient-to-br from-emerald-900/30 to-emerald-800/20 rounded-lg p-3 border border-emerald-700/30 mb-4">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-emerald-400 mr-2" />
                <span className="text-emerald-300 font-medium">Command Sent</span>
              </div>
              <p className="text-xs text-emerald-400 mt-1">Pump strategy has been transmitted to the system</p>
            </div>
          )}

          {/* Apply Strategy Button */}
          <button 
            onClick={handleApplyStrategy}
            className="w-full py-2 px-4 rounded-lg transition-colors flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            <Settings className="w-4 h-4 mr-2" />
            Apply Strategy
          </button>
        </div>

        {/* Bottom - Setpoint Optimization */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-600">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Target className="w-6 h-6 text-purple-400 mr-3" />
              <h3 className="text-xl font-semibold text-white">Setpoint Optimization</h3>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              appliedSetpointControlMode === 'auto' 
                ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-700/30' 
                : 'bg-gray-900/30 text-gray-400 border border-gray-700/30'
            }`}>
              {appliedSetpointControlMode === 'auto' ? 'Auto' : 'Manual'}
            </div>
          </div>

          {/* Current Setpoints */}
          <div className="space-y-4 mb-6">
            <h4 className="text-lg font-medium text-white flex items-center">
              <Settings className="w-5 h-5 text-indigo-400 mr-2" />
              Pump Setpoints
            </h4>
            
            <div className="space-y-4">
              {/* Primary Pump Speed */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Primary Pump Speed</span>
                <div className="flex items-center">
                  <input
                    type="number"
                    value={setpoints.primaryPumpSpeed}
                    onChange={(e) => setSetpoints(prev => ({
                      ...prev,
                      primaryPumpSpeed: parseFloat(e.target.value)
                    }))}
                    className="w-20 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-lg font-bold"
                    step="1"
                    min="0"
                    max="100"
                  />
                  <span className="text-indigo-300 ml-2 text-sm">%</span>
                </div>
              </div>

              {/* Secondary Pump Speed */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Secondary Pump Speed</span>
                <div className="flex items-center">
                  <input
                    type="number"
                    value={setpoints.secondaryPumpSpeed}
                    onChange={(e) => setSetpoints(prev => ({
                      ...prev,
                      secondaryPumpSpeed: parseFloat(e.target.value)
                    }))}
                    className="w-20 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-lg font-bold"
                    step="1"
                    min="0"
                    max="100"
                  />
                  <span className="text-indigo-300 ml-2 text-sm">%</span>
                </div>
              </div>

              {/* Pressure Setpoint */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Pressure Setpoint</span>
                <div className="flex items-center">
                  <input
                    type="number"
                    value={setpoints.pressureSetpoint}
                    onChange={(e) => setSetpoints(prev => ({
                      ...prev,
                      pressureSetpoint: parseFloat(e.target.value)
                    }))}
                    className="w-20 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-lg font-bold"
                    step="1"
                  />
                  <span className="text-indigo-300 ml-2 text-sm">psi</span>
                </div>
              </div>
            </div>
          </div>

          {/* Control Mode */}
          <div className="mb-6">
            <h4 className="text-lg font-medium text-white flex items-center mb-3">
              <Settings className="w-5 h-5 text-emerald-400 mr-2" />
              Control Mode
            </h4>
            <div className="flex gap-6">
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={setpoints.controlMode === 'auto'}
                  onChange={() => setSetpoints(prev => ({ ...prev, controlMode: 'auto' }))}
                  className="mr-2"
                />
                <span className="text-gray-300">Auto Optimization</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={setpoints.controlMode === 'manual'}
                  onChange={() => setSetpoints(prev => ({ ...prev, controlMode: 'manual' }))}
                  className="mr-2"
                />
                <span className="text-gray-300">Manual Control</span>
              </label>
            </div>
          </div>

          {/* Command Sent Feedback for Setpoints */}
          {setpointsCommandSent && (
            <div className="bg-gradient-to-br from-emerald-900/30 to-emerald-800/20 rounded-lg p-3 border border-emerald-700/30 mb-4">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-emerald-400 mr-2" />
                <span className="text-emerald-300 font-medium">Command Sent</span>
              </div>
              <p className="text-xs text-emerald-400 mt-1">Pump setpoints have been transmitted to the system</p>
            </div>
          )}

          {/* Apply Button */}
          <button 
            onClick={handleApplySetpoints}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
          >
            <Target className="w-4 h-4 mr-2" />
            Apply Setpoints
          </button>
        </div>
      </div>
    </div>
  );
}; 