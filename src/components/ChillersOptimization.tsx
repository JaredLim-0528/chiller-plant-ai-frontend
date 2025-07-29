import React, { useState, useEffect } from 'react';
import { Snowflake, Zap, Gauge, AlertTriangle, CheckCircle, XCircle, Target, Thermometer, Settings, Trophy, Clock, ArrowRight } from 'lucide-react';
import type { ChillerData, OptimizationMetrics } from '../types';

interface ChillersOptimizationProps {
  chillers: ChillerData[];
}

export const ChillersOptimization: React.FC<ChillersOptimizationProps> = ({ chillers }) => {
  // Setpoint state management
  const [setpoints, setSetpoints] = useState({
    chilledWaterSupplySetpoint: 6.0,
    targetChilledWaterReturn: 12.0,
    chilledWaterSupplyControlMode: 'auto' as 'auto' | 'manual'
  });

  // Current temperature readings (mock data)
  const currentTemps = {
    chilledWaterSupplyCurrent: 6.2,
    chilledWaterReturnCurrent: 11.8
  };

  // Countdown timer state
  const [countdownActive, setCountdownActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(10 * 60); // 10 minutes in seconds

  // Command feedback state  
  const [setpointsCommandSent, setSetpointsCommandSent] = useState(false);
  const [strategyCommandSent, setStrategyCommandSent] = useState(false);

  // Strategy control mode
  const [strategyControlMode, setStrategyControlMode] = useState<'auto' | 'manual'>('auto');
  const [appliedStrategyControlMode, setAppliedStrategyControlMode] = useState<'auto' | 'manual'>('auto');
  const [appliedChilledWaterSupplyControlMode, setAppliedChilledWaterSupplyControlMode] = useState<'auto' | 'manual'>('auto');

  // Countdown timer effect
  useEffect(() => {
    let interval: number;
    if (countdownActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      setCountdownActive(false);
      setTimeRemaining(10 * 60); // Reset to 10 minutes
    }
    return () => clearInterval(interval);
  }, [countdownActive, timeRemaining]);

  const calculatePriorityRanking = (chillers: ChillerData[]) => {
    return chillers
      .map((chiller) => ({
        ...chiller,
        priorityScore: chiller.avgCOP30Days * 100 - (chiller.runningHours / 10)
      }))
      .sort((a, b) => b.priorityScore - a.priorityScore)
      .map((chiller, index) => ({
        ...chiller,
        priority: index + 1,
        aiRecommendedStatus: chiller.id === 'CH02' ? 'OFF' : // Special case for CH02 - poor efficiency
                            chiller.status === 'online' ? 'ON' :
                            (index + 1) <= 2 && chiller.status === 'offline' ? 'ON' : 'OFF'
      }));
  };

  const prioritizedChillers = calculatePriorityRanking(chillers);
  const sortedChillers = prioritizedChillers.slice().sort((a, b) => a.name.localeCompare(b.name));

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1: return 'bg-gradient-to-br from-emerald-900/30 to-emerald-800/20 border-emerald-700/30 text-emerald-300';
      case 2: return 'bg-gradient-to-br from-blue-900/30 to-blue-800/20 border-blue-700/30 text-blue-300';
      case 3: return 'bg-gradient-to-br from-amber-900/30 to-amber-800/20 border-amber-700/30 text-amber-300';
      case 4: return 'bg-gradient-to-br from-red-900/30 to-red-800/20 border-red-700/30 text-red-300';
      default: return 'bg-gradient-to-br from-gray-900/30 to-gray-800/20 border-gray-700/30 text-gray-300';
    }
  };

  const getSimpleStatus = (status: ChillerData['status']) => {
    return status === 'online' ? 'ON' : 'OFF';
  };

  const getStatusColor = (status: string) => {
    return status === 'ON' ? 'text-emerald-400' : 'text-gray-400';
  };

  const getAIRecommendationAction = (currentStatus: ChillerData['status'], aiRecommendedStatus: string) => {
    const current = currentStatus === 'online' ? 'ON' : 'OFF';
    const recommended = aiRecommendedStatus;
    
    if (current === recommended) return 'KEEP SAME';
    if (current === 'OFF' && recommended === 'ON') return 'TURN ON';
    if (current === 'ON' && recommended === 'OFF') return 'TURN OFF';
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
    
    if (strategyControlMode === 'auto') {
      // Check if any AI recommendations are not "KEEP SAME"
      const hasActionableRecommendations = sortedChillers.some(chiller => 
        getAIRecommendationAction(chiller.status, chiller.aiRecommendedStatus!) !== 'KEEP SAME'
      );
      
      if (hasActionableRecommendations) {
        setCountdownActive(true);
        setTimeRemaining(10 * 60); // Reset to 10 minutes
      } else {
        // No changes needed, just show command sent
        setStrategyCommandSent(true);
        setTimeout(() => setStrategyCommandSent(false), 3000);
      }
    } else {
      // Manual control - always show command sent
      setStrategyCommandSent(true);
      setTimeout(() => setStrategyCommandSent(false), 3000);
    }
  };

  // Cancel countdown
  const cancelCountdown = () => {
    setCountdownActive(false);
    setTimeRemaining(10 * 60); // Reset to 10 minutes
  };

  // Handle apply setpoints
  const handleApplySetpoints = () => {
    setAppliedChilledWaterSupplyControlMode(setpoints.chilledWaterSupplyControlMode);
    setSetpointsCommandSent(true);
    setTimeout(() => {
      setSetpointsCommandSent(false);
    }, 3000);
  };

  return (
    <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Snowflake className="w-6 h-6 text-blue-400 mr-3" />
          <h2 className="text-xl font-semibold text-white">Chillers Optimization</h2>
        </div>
      </div>

      {/* Chiller Priority Ranking */}
      <div className="mb-6 mx-2">
        <h3 className="text-lg font-medium text-white mb-4 text-center">
          Chiller Priority Ranking (Best to Worst)
        </h3>
        <div className="flex items-center gap-2 lg:gap-3">
          {prioritizedChillers.map((chiller, index) => (
            <React.Fragment key={chiller.id}>
              <div className={`rounded-lg p-3 border ${getPriorityColor(chiller.priority!)} flex-1 min-h-[60px]`}>
                <div className="flex flex-col items-center text-center justify-center h-full">
                  <div className="mb-2">
                    <span className="text-xl lg:text-2xl font-bold">#{chiller.priority}</span>
                  </div>
                  <div>
                    <span className="text-sm lg:text-base font-semibold">{chiller.name}</span>
                  </div>
                </div>
              </div>
              {index < prioritizedChillers.length - 1 && (
                <div className="flex items-center flex-shrink-0">
                  <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Main Layout: Strategy on top, Setpoint on bottom */}
      <div className="space-y-6">
        {/* Top - Chiller Strategy */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-600">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Snowflake className="w-6 h-6 text-blue-400 mr-3" />
              <h3 className="text-xl font-semibold text-white">Chiller Strategy Optimization</h3>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              appliedStrategyControlMode === 'auto' 
                ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-700/30' 
                : 'bg-gray-900/30 text-gray-400 border border-gray-700/30'
            }`}>
              {appliedStrategyControlMode === 'auto' ? 'Auto' : 'Manual'}
            </div>
          </div>

          {/* Column Headers */}
          <div className="grid grid-cols-3 gap-4 py-3 border-b border-gray-500 mb-4">
            <h4 className="text-sm font-semibold text-gray-300">Chiller Name</h4>
            <h4 className="text-sm font-semibold text-gray-300 text-center">Current Status</h4>
            <h4 className="text-sm font-semibold text-gray-300 text-center">AI Recommendation</h4>
          </div>

          {/* Chiller Rows */}
          <div className="space-y-2 mb-6">
            {sortedChillers.map((chiller) => (
              <div key={chiller.id} className="grid grid-cols-3 gap-4 items-center py-3 border-b border-gray-600 last:border-b-0">
                <h4 className="text-lg font-medium text-white">{chiller.name}</h4>
                <div className="text-center">
                  <span className={`text-lg font-bold ${getStatusColor(getSimpleStatus(chiller.status))}`}>
                    {getSimpleStatus(chiller.status)}
                  </span>
                </div>
                <div className="text-center">
                  <span className={`text-lg font-bold ${getRecommendationColor(getAIRecommendationAction(chiller.status, chiller.aiRecommendedStatus!))}`}>
                    {getAIRecommendationAction(chiller.status, chiller.aiRecommendedStatus!)}
                  </span>
                </div>
              </div>
            ))}
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

          {/* Strategy Command Sent Feedback */}
          {strategyCommandSent && (
            <div className="bg-gradient-to-br from-emerald-900/30 to-emerald-800/20 rounded-lg p-3 border border-emerald-700/30 mb-4">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-emerald-400 mr-2" />
                <span className="text-emerald-300 font-medium">Command Sent</span>
              </div>
              <p className="text-xs text-emerald-400 mt-1">Chiller strategy has been transmitted to the system</p>
            </div>
          )}

          {/* Countdown Timer */}
          {countdownActive && (
            <div className="bg-gradient-to-br from-amber-900/30 to-amber-800/20 rounded-lg p-4 border border-amber-700/30 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-amber-300 font-medium">Countdown before implementing strategy changes</span>
                <button 
                  onClick={cancelCountdown}
                  className="text-amber-400 hover:text-amber-300 text-sm underline"
                >
                  Cancel
                </button>
              </div>
              <div className="flex items-center mb-2">
                <div className="flex-1 bg-amber-900 rounded-full h-2 mr-3">
                  <div 
                    className="bg-amber-400 rounded-full h-2 transition-all duration-1000"
                    style={{ width: `${(timeRemaining / (10 * 60)) * 100}%` }}
                  ></div>
                </div>
                <span className="text-amber-400 font-bold text-sm">
                  {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
                </span>
              </div>
            </div>
          )}

          {/* Apply Strategy Button */}
          <button 
            onClick={handleApplyStrategy}
            disabled={countdownActive}
            className={`w-full py-2 px-4 rounded-lg transition-colors flex items-center justify-center ${
              countdownActive 
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                : 'bg-cyan-600 hover:bg-cyan-700 text-white'
            }`}
          >
            <Snowflake className="w-4 h-4 mr-2" />
            {countdownActive ? 'Strategy Implementing...' : 'Apply Strategy'}
          </button>
        </div>

        {/* Bottom - Setpoint Optimization */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-600">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Target className="w-6 h-6 text-purple-400 mr-3" />
              <h3 className="text-xl font-semibold text-white">Setpoint Optimization</h3>
            </div>
            <div className="flex gap-2">
              <div className="px-2 py-1 rounded-full text-xs font-medium bg-gray-900/30 text-gray-400 border border-gray-700/30">
                Return: Manual Only
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                appliedChilledWaterSupplyControlMode === 'auto' 
                  ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-700/30' 
                  : 'bg-gray-900/30 text-gray-400 border border-gray-700/30'
              }`}>
                Supply: {appliedChilledWaterSupplyControlMode === 'auto' ? 'Auto' : 'Manual'}
              </div>
            </div>
          </div>

          {/* Current Setpoints */}
          <div className="space-y-4 mb-6">
            <h4 className="text-lg font-medium text-white flex items-center">
              <Thermometer className="w-5 h-5 text-blue-400 mr-2" />
              Water Temperature Setpoints
            </h4>
            
            <div className="space-y-4">
              {/* Chilled Water Return Temperature Row */}
              <div className="bg-gradient-to-br from-cyan-900/20 to-cyan-800/10 rounded-lg p-4 border border-cyan-700/30">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-2">Current Chilled Water Return Temp</p>
                    <div className="flex items-center">
                      <span className="text-xl font-bold text-emerald-300">{currentTemps.chilledWaterReturnCurrent.toFixed(1)}</span>
                      <span className="text-blue-300 ml-2 text-sm">°C</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-2">Target Chilled Water Return Temp</p>
                    <div className="flex items-center">
                      <input
                        type="number"
                        value={setpoints.targetChilledWaterReturn}
                        onChange={(e) => setSetpoints(prev => ({
                          ...prev,
                          targetChilledWaterReturn: parseFloat(e.target.value)
                        }))}
                        className="w-20 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-lg font-bold"
                        step="0.1"
                      />
                      <span className="text-blue-300 ml-2 text-sm">°C</span>
                      <span className="text-xs text-gray-400 bg-gray-800/50 px-2 py-1 rounded border border-gray-600 ml-3">Manual Only</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Chilled Water Supply Temperature Row */}
              <div className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 rounded-lg p-4 border border-purple-700/30">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-2">Current Chilled Water Supply Temp</p>
                    <div className="flex items-center">
                      <span className="text-xl font-bold text-emerald-300">{currentTemps.chilledWaterSupplyCurrent.toFixed(1)}</span>
                      <span className="text-blue-300 ml-2 text-sm">°C</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-2">Chilled Water Supply Temp Setpoint</p>
                    <div className="flex items-center">
                      <input
                        type="number"
                        value={setpoints.chilledWaterSupplySetpoint}
                        onChange={(e) => setSetpoints(prev => ({
                          ...prev,
                          chilledWaterSupplySetpoint: parseFloat(e.target.value)
                        }))}
                        className="w-20 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-lg font-bold"
                        step="0.1"
                      />
                      <span className="text-blue-300 ml-2 text-sm">°C</span>
                    </div>
                  </div>
                </div>
                
                {/* Control Mode for Supply Temperature */}
                <div className="border-t border-purple-700/30 pt-3">
                  <p className="text-xs text-purple-300 font-medium mb-2">Control Mode</p>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={setpoints.chilledWaterSupplyControlMode === 'auto'}
                        onChange={() => setSetpoints(prev => ({ ...prev, chilledWaterSupplyControlMode: 'auto' }))}
                        className="mr-2"
                      />
                      <span className="text-gray-300 text-sm">Auto Optimization</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={setpoints.chilledWaterSupplyControlMode === 'manual'}
                        onChange={() => setSetpoints(prev => ({ ...prev, chilledWaterSupplyControlMode: 'manual' }))}
                        className="mr-2"
                      />
                      <span className="text-gray-300 text-sm">Manual Control</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>





          {/* Command Sent Feedback */}
          {setpointsCommandSent && (
            <div className="bg-gradient-to-br from-emerald-900/30 to-emerald-800/20 rounded-lg p-3 border border-emerald-700/30 mb-4">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-emerald-400 mr-2" />
                <span className="text-emerald-300 font-medium">Command Sent</span>
              </div>
              <p className="text-xs text-emerald-400 mt-1">Setpoints have been transmitted to the chiller system</p>
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