import React from 'react';
import { Brain, Activity, Calendar } from 'lucide-react';
import { CoolingLoadProfile } from './components/CoolingLoadProfile';
import { ChillersOptimization } from './components/ChillersOptimization';
import { CoolingTowersOptimization } from './components/CoolingTowersOptimization';
import { PumpsOptimization } from './components/PumpsOptimization';
import { generateCoolingLoadData, mockChillers, mockCoolingTowers, mockPumps } from './data/mockData';

function App() {
  const coolingLoadData = generateCoolingLoadData();
  
  return (
    <div className="min-h-screen bg-gray-950 p-4">
      <div className="max-w-[95%] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Brain className="w-8 h-8 text-purple-400 mr-3" />
            <h1 className="text-2xl font-bold text-white">
              Chiller Plant AI Optimization
            </h1>
          </div>
          <div className="flex items-center text-sm text-gray-400">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</span>
          </div>
        </div>

        {/* Status Bar */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg p-4 mb-8 border border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Activity className="w-5 h-5 text-emerald-400 mr-2" />
              <span className="text-emerald-400 font-medium">System Online</span>
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></div>
                <span className="text-gray-300">AI Optimization Active</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                <span className="text-gray-300">Real-time Monitoring</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-purple-400 rounded-full mr-2"></div>
                <span className="text-gray-300">Predictive Analytics</span>
              </div>
            </div>
          </div>
        </div>

        {/* Cooling Load Profile */}
        <div className="mb-8">
          <CoolingLoadProfile data={coolingLoadData} />
        </div>

        {/* Optimization Components Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Chillers Optimization */}
          <ChillersOptimization chillers={mockChillers} />

          {/* Cooling Towers Optimization */}
          <CoolingTowersOptimization coolingTowers={mockCoolingTowers} />

          {/* Pumps Optimization */}
          <PumpsOptimization pumps={mockPumps} />
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>Chiller Plant AI Optimization System - Real-time Energy Management</p>
        </div>
      </div>
    </div>
  );
}

export default App; 