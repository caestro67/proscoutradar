import React, { useMemo } from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip
} from 'recharts';
import { ChartConfig, RadarDataPoint } from '../types';

interface Props {
  config: ChartConfig;
}

const RadarChartComponent: React.FC<Props> = ({ config }) => {
  
  // Transform data for Recharts
  const chartData = useMemo(() => {
    return config.categories.map((category, index) => {
      const point: RadarDataPoint = { subject: category };
      config.players.forEach(player => {
        point[player.id] = player.values[index] || 0;
      });
      return point;
    });
  }, [config]);

  // Calculate max value for domain scaling (add 10% buffer like the Python script)
  const maxValue = useMemo(() => {
    let max = 0;
    config.players.forEach(p => {
      const pMax = Math.max(...p.values);
      if (pMax > max) max = pMax;
    });
    return Math.max(max, 100); // Default to at least 100
  }, [config]);

  return (
    <div className="w-full h-[500px] bg-slate-800/50 rounded-xl border border-slate-700 p-4 shadow-xl backdrop-blur-sm">
      <div className="text-center mb-2">
        <h2 className="text-xl font-bold text-white tracking-wide">{config.title}</h2>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
          <PolarGrid gridType="polygon" stroke="#475569" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: '#cbd5e1', fontSize: 12 }} 
          />
          <PolarRadiusAxis 
            angle={30} 
            domain={[0, maxValue]} 
            tick={{ fill: '#94a3b8', fontSize: 10 }}
            axisLine={false}
          />
          
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
            itemStyle={{ color: '#f8fafc' }}
          />
          
          {config.players.map((player) => (
            <Radar
              key={player.id}
              name={player.name}
              dataKey={player.id}
              stroke={player.color}
              strokeWidth={3}
              fill={player.color}
              fillOpacity={0.25}
              isAnimationActive={true}
            />
          ))}
          <Legend wrapperStyle={{ paddingTop: '20px' }}/>
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RadarChartComponent;