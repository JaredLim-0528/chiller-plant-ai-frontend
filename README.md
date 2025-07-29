# Chiller Plant AI Optimization

A real-time AI-powered optimization system for chiller plant operations, featuring intelligent monitoring and control of chillers, cooling towers, and pumps.

## Features

- **Real-time Cooling Load Monitoring**: Live tracking of actual vs forecasted cooling loads
- **Chillers Optimization**: AI-driven chiller sequencing and efficiency optimization
- **Cooling Towers Optimization**: Intelligent fan speed and water flow control
- **Pumps Optimization**: Variable frequency drive optimization for all pump types
- **Predictive Analytics**: Forecast-based optimization recommendations

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS with modern dark theme
- **Charts**: Chart.js with React wrapper
- **Build Tool**: Vite
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 8.0.0

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

### Building for Production

```bash
npm run build
```

### Linting

```bash
npm run lint
npm run lint:fix
```

## Project Structure

```
src/
├── components/          # React components
│   ├── CoolingLoadProfile.tsx
│   ├── ChillersOptimization.tsx
│   ├── CoolingTowersOptimization.tsx
│   └── PumpsOptimization.tsx
├── data/               # Mock data and utilities
│   └── mockData.ts
├── types.ts            # TypeScript type definitions
├── App.tsx             # Main application component
└── main.tsx            # Application entry point
```

## Components

### CoolingLoadProfile
- Displays today's cooling load with actual vs forecasted data
- Real-time updates with current metrics
- Interactive Chart.js visualization

### ChillersOptimization
- Real-time chiller monitoring and control
- Efficiency tracking and optimization recommendations
- Load balancing and sequencing optimization

### CoolingTowersOptimization
- Fan speed and water flow optimization
- Temperature differential monitoring
- Energy efficiency tracking

### PumpsOptimization
- Primary, secondary, and condenser pump control
- VFD optimization recommendations
- Flow rate and pressure monitoring

## Theme

The application uses a modern dark theme with:
- Dark gray background gradients
- Blue, emerald, amber, and purple accent colors
- Modern card-based layout
- Responsive design for all screen sizes

## License

Copyright © 2024. All rights reserved. 