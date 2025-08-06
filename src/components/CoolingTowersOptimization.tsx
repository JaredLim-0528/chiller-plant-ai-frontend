import React, { useState } from 'react';
import { Wind, Thermometer, CheckCircle, XCircle, AlertTriangle, Target, Settings } from 'lucide-react';
import type { CoolingTowerData } from '../types';

interface CoolingTowersOptimizationProps {
  coolingTowers: CoolingTowerData[];
}

export const CoolingTowersOptimization: React.FC<CoolingTowersOptimizationProps> = ({ coolingTowers }) => {
  // Setpoint state management
  const [setpoints, setSetpoints] = useState({
    currentCondensingWaterReturnTemp: 28.2,     // Display-only current status
    aiRecommendedCondensingWaterReturnTemp: 27.0, // AI recommendation
    controlMode: 'auto' as 'auto' | 'manual'
  });

  // Strategy state management
  const [strategy, setStrategy] = useState({
    currentTowersRunning: 2, // Display-only current status
    userSelectedTowers: 2,   // User input via +/- buttons
    aiRecommendedTowers: 3   // AI recommendation
  });

  // Command feedback state
  const [strategyCommandSent, setStrategyCommandSent] = useState(false);
  const [setpointsCommandSent, setSetpointsCommandSent] = useState(false);

  // Strategy control mode
  const [strategyControlMode, setStrategyControlMode] = useState<'auto' | 'manual'>('auto');
  const [appliedStrategyControlMode, setAppliedStrategyControlMode] = useState<'auto' | 'manual'>('auto');
  const [appliedSetpointControlMode, setAppliedSetpointControlMode] = useState<'auto' | 'manual'>('auto');

  // Handle apply strategy
  const handleApplyStrategy = () => {
    setAppliedStrategyControlMode(strategyControlMode);
    
    // If AI Control is selected, force user selection to match AI recommendation
    if (strategyControlMode === 'auto') {
      setStrategy(prev => ({
        ...prev,
        userSelectedTowers: prev.aiRecommendedTowers
      }));
    }
    
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
          <Wind className="w-6 h-6 text-cyan-400 mr-3" />
          <h2 className="text-xl font-semibold text-white">Cooling Towers Optimization</h2>
        </div>
      </div>

      {/* Main Layout: Strategy on top, Setpoint on bottom */}
      <div className="space-y-6">
        {/* Top - Cooling Tower Strategy */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-600">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Wind className="w-6 h-6 text-cyan-400 mr-3" />
              <h3 className="text-xl font-semibold text-white">Tower Strategy Optimization</h3>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              appliedStrategyControlMode === 'auto' 
                ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-700/30' 
                : 'bg-gray-900/30 text-gray-400 border border-gray-700/30'
            }`}>
              {appliedStrategyControlMode === 'auto' ? 'AI Mode' : 'BMS Mode'}
            </div>
          </div>

          {/* Tower Count Control */}
          <div className="mb-6">
            <div className="space-y-6">
              {/* Current Tower Status (Display Only) */}
              <div className="bg-gradient-to-br from-gray-900/30 to-gray-800/20 rounded-lg p-4 border border-gray-700/30">
                <h4 className="text-lg font-medium text-gray-300 mb-3">Current Status</h4>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Number of Towers Running</span>
                  <div className="flex items-center">
                    <span className="text-white text-lg font-bold">
                      {strategy.currentTowersRunning}
                    </span>
                  </div>
                </div>
              </div>

              {/* Target Configuration with AI Recommendation */}
              <div className="bg-gradient-to-br from-cyan-900/30 to-cyan-800/20 rounded-lg p-4 border border-cyan-700/30">

                {/* AI Recommendation Row */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">AI Recommended Number of Towers</span>
                  <div className="flex items-center">
                    <span className="bg-emerald-900 border border-emerald-700 px-4 py-2 text-emerald-300 text-lg font-bold rounded">
                      {strategy.aiRecommendedTowers}
                    </span>
                  </div>
                </div>
              </div>
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
                <span className="text-gray-300">AI Control</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={strategyControlMode === 'manual'}
                  onChange={() => setStrategyControlMode('manual')}
                  className="mr-2"
                />
                <span className="text-gray-300">BMS Control</span>
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
              <p className="text-xs text-emerald-400 mt-1">Tower strategy has been transmitted to the system</p>
            </div>
          )}

          {/* Apply Strategy Button */}
          <button 
            onClick={handleApplyStrategy}
            className="w-full py-2 px-4 rounded-lg transition-colors flex items-center justify-center bg-cyan-600 hover:bg-cyan-700 text-white"
          >
            <Wind className="w-4 h-4 mr-2" />
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
              {appliedSetpointControlMode === 'auto' ? 'AI Mode' : 'BMS Mode'}
            </div>
          </div>

          {/* Current Setpoints */}
          <div className="space-y-4 mb-6">
            <h4 className="text-lg font-medium text-white flex items-center">
              <Thermometer className="w-5 h-5 text-cyan-400 mr-2" />
              Cooling Tower Setpoints
            </h4>
            
            <div className="space-y-6">
              {/* Current Condensing Water Return Temp Status (Display Only) */}
              <div className="bg-gradient-to-br from-gray-900/30 to-gray-800/20 rounded-lg p-4 border border-gray-700/30">
                <h4 className="text-lg font-medium text-gray-300 mb-3">Current Status</h4>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Current Condensing Water Return Temp</span>
                  <div className="flex items-center">
                    <span className="text-white text-lg font-bold">
                      {setpoints.currentCondensingWaterReturnTemp.toFixed(1)}
                    </span>
                    <span className="text-gray-300 ml-2 text-sm">°C</span>
                  </div>
                </div>
              </div>

              {/* AI Recommendation */}
              <div className="bg-gradient-to-br from-cyan-900/30 to-cyan-800/20 rounded-lg p-4 border border-cyan-700/30">
                {/* AI Recommendation Row */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">AI Recommended Condensing Water Return Temp</span>
                  <div className="flex items-center">
                    <span className="bg-emerald-900 border border-emerald-700 px-4 py-2 text-emerald-300 text-lg font-bold rounded">
                      {setpoints.aiRecommendedCondensingWaterReturnTemp.toFixed(1)}
                    </span>
                    <span className="text-emerald-300 ml-2 text-sm">°C</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Control Mode */}
          <div className="mb-6">
            <h4 className="text-lg font-medium text-white flex items-center mb-3">
              <Wind className="w-5 h-5 text-emerald-400 mr-2" />
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
                <span className="text-gray-300">AI Control</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={setpoints.controlMode === 'manual'}
                  onChange={() => setSetpoints(prev => ({ ...prev, controlMode: 'manual' }))}
                  className="mr-2"
                />
                <span className="text-gray-300">BMS Control</span>
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
              <p className="text-xs text-emerald-400 mt-1">Tower setpoints have been transmitted to the system</p>
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