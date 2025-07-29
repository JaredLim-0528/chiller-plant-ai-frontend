import React, { useState } from 'react';
import { Wind, Thermometer, CheckCircle, XCircle, AlertTriangle, Target, Settings } from 'lucide-react';
import type { CoolingTowerData } from '../types';

interface CoolingTowersOptimizationProps {
  coolingTowers: CoolingTowerData[];
}

export const CoolingTowersOptimization: React.FC<CoolingTowersOptimizationProps> = ({ coolingTowers }) => {
  // Setpoint state management
  const [setpoints, setSetpoints] = useState({
    currentApproachingTemp: 8.2,     // Display-only current status
    targetApproachingTemp: 7.5,      // User input
    aiRecommendedApproachingTemp: 7.0, // AI recommendation
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
    
    // If Auto Optimization is selected, force user selection to match AI recommendation
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
    
    // If Auto Optimization is selected, force target to match AI recommendation
    if (setpoints.controlMode === 'auto') {
      setSetpoints(prev => ({
        ...prev,
        targetApproachingTemp: prev.aiRecommendedApproachingTemp
      }));
    }
    
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
              {appliedStrategyControlMode === 'auto' ? 'Auto' : 'Manual'}
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
                    <span className="bg-gray-700 border border-gray-600 px-4 py-2 text-white text-lg font-bold rounded min-w-[60px] text-center">
                      {strategy.currentTowersRunning}
                    </span>
                  </div>
                </div>
              </div>

              {/* Target Configuration with AI Recommendation */}
              <div className="bg-gradient-to-br from-cyan-900/30 to-cyan-800/20 rounded-lg p-4 border border-cyan-700/30">
                
                {/* User Input Row */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-300">Number of Towers to Run</span>
                  <div className="flex items-center">
                    <button 
                      onClick={() => setStrategy(prev => ({ ...prev, userSelectedTowers: Math.max(0, prev.userSelectedTowers - 1) }))}
                      className="bg-gray-700 hover:bg-gray-600 text-white w-8 h-8 rounded-l border border-gray-600 flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="bg-gray-700 border-t border-b border-gray-600 px-4 py-2 text-white text-lg font-bold min-w-[60px] text-center">
                      {strategy.userSelectedTowers}
                    </span>
                    <button 
                      onClick={() => setStrategy(prev => ({ ...prev, userSelectedTowers: Math.min(coolingTowers.length, prev.userSelectedTowers + 1) }))}
                      className="bg-gray-700 hover:bg-gray-600 text-white w-8 h-8 rounded-r border border-gray-600 flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* AI Recommendation Row */}
                <div className="flex items-center justify-between pt-3 border-t border-cyan-700/30">
                  <span className="text-gray-300">AI Recommended Number of Towers</span>
                  <div className="flex items-center">
                    <span className="bg-emerald-900 border border-emerald-700 px-4 py-2 text-emerald-300 text-lg font-bold rounded">
                      {strategy.aiRecommendedTowers}
                    </span>
                    <div className="ml-3">
                      {strategy.userSelectedTowers === strategy.aiRecommendedTowers ? (
                        <span className="text-emerald-400 text-sm flex items-center">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Optimal
                        </span>
                      ) : strategy.userSelectedTowers < strategy.aiRecommendedTowers ? (
                        <span className="text-amber-400 text-sm">↑ Add {strategy.aiRecommendedTowers - strategy.userSelectedTowers}</span>
                      ) : (
                        <span className="text-amber-400 text-sm">↓ Remove {strategy.userSelectedTowers - strategy.aiRecommendedTowers}</span>
                      )}
                    </div>
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
              {appliedSetpointControlMode === 'auto' ? 'Auto' : 'Manual'}
            </div>
          </div>

          {/* Current Setpoints */}
          <div className="space-y-4 mb-6">
            <h4 className="text-lg font-medium text-white flex items-center">
              <Thermometer className="w-5 h-5 text-cyan-400 mr-2" />
              Cooling Tower Setpoints
            </h4>
            
            <div className="space-y-4">
              {/* Current Approaching Temperature (Display Only) */}
              <div className="bg-gradient-to-br from-gray-900/30 to-gray-800/20 rounded-lg p-4 border border-gray-700/30">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm text-gray-300 font-medium">Current Approaching Temperature</span>
                    <p className="text-xs text-gray-400 mt-1">Current performance status</p>
                  </div>
                  <div className="flex items-center">
                    <span className="bg-gray-700 border border-gray-600 px-3 py-2 text-white text-lg font-bold rounded">
                      {setpoints.currentApproachingTemp.toFixed(1)}
                    </span>
                    <span className="text-gray-300 ml-2 text-sm">°C</span>
                  </div>
                </div>
              </div>

              {/* Target Approaching Temperature with AI Recommendation */}
              <div className="bg-gradient-to-br from-cyan-900/30 to-cyan-800/20 rounded-lg p-4 border border-cyan-700/30">
                
                {/* User Input Row */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-300">Target Approaching Temperature</span>
                  <div className="flex items-center">
                    <input
                      type="number"
                      value={setpoints.targetApproachingTemp}
                      onChange={(e) => setSetpoints(prev => ({
                        ...prev,
                        targetApproachingTemp: parseFloat(e.target.value)
                      }))}
                      className="w-20 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-lg font-bold"
                      step="0.1"
                      min="3.0"
                      max="15.0"
                    />
                    <span className="text-cyan-300 ml-2 text-sm">°C</span>
                  </div>
                </div>

                {/* AI Recommendation Row */}
                <div className="flex items-center justify-between pt-3 border-t border-cyan-700/30">
                  <span className="text-gray-300">AI Recommended Approaching Temp</span>
                  <div className="flex items-center">
                    <span className="bg-emerald-900 border border-emerald-700 px-3 py-2 text-emerald-300 text-lg font-bold rounded">
                      {setpoints.aiRecommendedApproachingTemp.toFixed(1)}
                    </span>
                    <span className="text-emerald-300 ml-2 text-sm">°C</span>
                    <div className="ml-3">
                      {setpoints.targetApproachingTemp === setpoints.aiRecommendedApproachingTemp ? (
                        <span className="text-emerald-400 text-sm flex items-center">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Optimal
                        </span>
                      ) : setpoints.targetApproachingTemp > setpoints.aiRecommendedApproachingTemp ? (
                        <span className="text-amber-400 text-sm">↓ Reduce by {(setpoints.targetApproachingTemp - setpoints.aiRecommendedApproachingTemp).toFixed(1)}°C</span>
                      ) : (
                        <span className="text-amber-400 text-sm">↑ Increase by {(setpoints.aiRecommendedApproachingTemp - setpoints.targetApproachingTemp).toFixed(1)}°C</span>
                      )}
                    </div>
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