
import React, { useMemo, useRef, useCallback } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { ChartConfig } from '../types';
import { Download } from 'lucide-react';
import { toPng } from 'html-to-image';

interface Props {
  config: ChartConfig;
}

const BarChartComponent: React.FC<Props> = ({ config }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const activePlayers = useMemo(() => config.players.filter(p => p.visible !== false), [config.players]);

  const data = useMemo(() => {
    return config.categories.map((category, index) => {
      const item: any = { name: category };
      activePlayers.forEach(player => {
        item[player.id] = player.values[index] || 0;
      });
      return item;
    });
  }, [config.categories, activePlayers]);

  const handleDownload = useCallback(() => {
    if (chartRef.current === null) return;

    setTimeout(() => {
      if (chartRef.current) {
        toPng(chartRef.current, { 
            cacheBust: true, 
            backgroundColor: '#0f172a',
            pixelRatio: 2,
            fontEmbedCSS: '',
            filter: (node) => {
                if (node.tagName === 'BUTTON' && node.getAttribute('title') === 'Descargar como PNG') {
                    return false;
                }
                return true;
            }
        })
          .then((dataUrl) => {
            const link = document.createElement('a');
            link.download = `proscout-bar-chart-${Date.now()}.png`;
            link.href = dataUrl;
            link.click();
          })
          .catch((err) => {
            console.error('Failed to download image', err);
            alert('Error al generar la imagen.');
          });
      }
    }, 100);
  }, [chartRef]);

  return (
    <div ref={chartRef} className="relative w-full h-[600px] bg-slate-800/50 rounded-xl border border-slate-700 p-6 shadow-xl backdrop-blur-sm flex flex-col">
        {/* Header with Title and Download Button */}
        <div className="flex justify-between items-center mb-6 relative z-10">
            <div className="flex-1 text-center">
                <h3 className="text-xl font-bold text-white uppercase tracking-wider">{config.title}</h3>
                <div className="h-1 w-16 bg-indigo-500 mx-auto mt-1 rounded-full"></div>
            </div>
            
            <button 
                onClick={handleDownload}
                className="p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700 shrink-0"
                title="Descargar como PNG"
            >
                <Download size={20} />
            </button>
        </div>

        <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
            <BarChart
                data={data}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} stroke="#94a3b8" />
                <YAxis 
                    dataKey="name" 
                    type="category" 
                    width={120} 
                    tick={{ fill: '#cbd5e1', fontSize: 11 }} 
                    stroke="#94a3b8"
                />
                <Tooltip 
                    cursor={{fill: '#334155', opacity: 0.4}}
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc', borderRadius: '8px' }}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                {activePlayers.map((player) => (
                <Bar 
                    key={player.id} 
                    dataKey={player.id} 
                    name={player.name} 
                    fill={player.color} 
                    radius={[0, 4, 4, 0]}
                    barSize={20}
                />
                ))}
            </BarChart>
            </ResponsiveContainer>
        </div>
        
        {/* Watermark Legend */}
        <div className="flex justify-end mt-4">
            <span className="text-[10px] text-slate-500 italic font-medium">Gráfico generado por ProScout IA</span>
        </div>
    </div>
  );
};

export default BarChartComponent;
