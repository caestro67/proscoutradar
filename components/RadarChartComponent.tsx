
import React, { useMemo, useRef, useCallback } from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { ChartConfig, RadarDataPoint } from '../types';
import { Download, User, Quote, MapPin, Flame, Map as MapIcon, Clock, Trophy } from 'lucide-react';
import { toPng } from 'html-to-image';

interface Props {
  config: ChartConfig;
}

const RadarChartComponent: React.FC<Props> = ({ config }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  
  const activePlayers = useMemo(() => config.players.filter(p => p.visible !== false), [config.players]);

  const chartData = useMemo(() => {
    return config.categories.map((category, index) => {
      const point: RadarDataPoint = { subject: category };
      activePlayers.forEach(player => {
        point[player.id] = player.values[index] || 0;
      });
      return point;
    });
  }, [config.categories, activePlayers]);

  const maxValue = useMemo(() => {
    let max = 0;
    activePlayers.forEach(p => {
      const pMax = Math.max(...p.values);
      if (pMax > max) max = pMax;
    });
    return Math.max(max, 100);
  }, [activePlayers]);

  const calculateAge = (birthDate?: string) => {
    if (!birthDate) return null;
    const birth = new Date(birthDate);
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    const m = now.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) {
        age--;
    }
    return age;
  };

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
            link.download = `proscout-radar-${Date.now()}.png`;
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
    <div ref={chartRef} className="relative w-full flex flex-col bg-slate-800/50 rounded-xl border border-slate-700 p-6 shadow-xl backdrop-blur-sm">
      
      <div className="flex justify-between items-start mb-2 relative z-10 shrink-0 min-h-[60px]">
        <div className="absolute left-0 top-0">
            {config.teamLogo && (
                <img 
                    src={config.teamLogo} 
                    alt="Team Logo" 
                    className="h-16 w-16 object-contain drop-shadow-md" 
                />
            )}
        </div>

        <div className="flex-1 text-center px-20">
           <h2 className="text-2xl font-bold text-white tracking-wide uppercase">{config.title}</h2>
           <div className="h-1 w-24 bg-blue-500 mx-auto mt-2 rounded-full"></div>
        </div>

        <div className="absolute right-0 top-0">
            <button 
                onClick={handleDownload}
                className="p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
                title="Descargar como PNG"
            >
                <Download size={20} />
            </button>
        </div>
      </div>

      <div className="w-full h-[500px] relative">
        <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
            <PolarGrid gridType="polygon" stroke="#475569" strokeWidth={1} />
            <PolarAngleAxis 
                dataKey="subject" 
                tick={{ fill: '#cbd5e1', fontSize: 13, fontWeight: 500 }} 
            />
            <PolarRadiusAxis 
                angle={30} 
                domain={[0, maxValue]} 
                tick={{ fill: '#94a3b8', fontSize: 10 }}
                axisLine={false}
                tickCount={5}
            />
            
            <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc', borderRadius: '8px' }}
                itemStyle={{ color: '#f8fafc', fontWeight: 600 }}
            />
            
            {activePlayers.map((player) => (
                <Radar
                key={player.id}
                name={player.name}
                dataKey={player.id}
                stroke={player.color}
                strokeWidth={3}
                fill={player.color}
                fillOpacity={0.2}
                isAnimationActive={false}
                />
            ))}
            </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex flex-col gap-4">
          <div className="flex flex-wrap justify-center gap-4 p-3 bg-slate-900/40 rounded-xl border border-slate-800/50">
            {activePlayers.map((player) => {
                const age = calculateAge(player.birthDate);
                return (
                    <div key={player.id} className="flex flex-col bg-slate-800/60 p-3 rounded-xl border border-slate-700/50 min-w-[200px] gap-2">
                        <div className="flex items-center gap-3">
                            <div 
                                className="w-12 h-12 rounded-lg overflow-hidden border-2 flex items-center justify-center bg-slate-700 shrink-0"
                                style={{ borderColor: player.color }}
                            >
                                {player.image ? (
                                    <img src={player.image} alt={player.name} className="w-full h-full object-cover" />
                                ) : (
                                    <User size={24} className="text-slate-400" />
                                )}
                            </div>
                            <div className="flex flex-col min-w-0 flex-1">
                                <span className="text-sm font-bold text-slate-100 truncate leading-tight">{player.name}</span>
                                <div className="flex flex-col mt-0.5 space-y-0.5">
                                    <div className="flex items-center gap-1">
                                        <MapPin size={10} className="text-blue-400" />
                                        <span className="text-[10px] text-slate-400 font-medium truncate">
                                            {player.position || 'N/A'} {age ? `(${age} años)` : ''}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="flex items-center gap-1 text-[9px] text-slate-500 font-bold uppercase truncate">
                                            <Clock size={8} /> {player.minutesPlayed || '-'}
                                        </span>
                                        <span className="flex items-center gap-1 text-[9px] text-slate-500 font-bold uppercase truncate">
                                            <Trophy size={8} /> {player.competition || '-'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tactical Mini Previews */}
                        {(player.heatmapImage || player.pitchPositionImage) && (
                            <div className="flex gap-2 mt-1">
                                {player.pitchPositionImage && (
                                    <div className="flex-1 flex flex-col items-center gap-1">
                                        <div className="w-full h-12 rounded border border-slate-700 overflow-hidden bg-slate-900">
                                            <img src={player.pitchPositionImage} className="w-full h-full object-contain" />
                                        </div>
                                        <span className="text-[8px] uppercase text-slate-500 font-bold flex items-center gap-0.5"><MapIcon size={8}/> Posición</span>
                                    </div>
                                )}
                                {player.heatmapImage && (
                                    <div className="flex-1 flex flex-col items-center gap-1">
                                        <div className="w-full h-12 rounded border border-slate-700 overflow-hidden bg-slate-900">
                                            <img src={player.heatmapImage} className="w-full h-full object-contain" />
                                        </div>
                                        <span className="text-[8px] uppercase text-slate-500 font-bold flex items-center gap-0.5"><Flame size={8}/> Mapa Calor</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                );
            })}
          </div>

          {config.observations && (
              <div className="mt-2 p-4 bg-slate-800/30 rounded-lg border-l-4 border-indigo-500 relative">
                  <Quote className="absolute top-2 left-2 text-indigo-500/20" size={40} />
                  <div className="relative z-10 pl-6">
                      <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-1">Observaciones Técnicas</h4>
                      <p className="text-sm text-slate-300 italic leading-relaxed whitespace-pre-wrap">
                          {config.observations}
                      </p>
                  </div>
              </div>
          )}

          <div className="flex justify-end mt-2">
            <span className="text-[10px] text-slate-500 italic font-medium">Gráfico generado por ProScout IA</span>
          </div>
      </div>
    </div>
  );
};

export default RadarChartComponent;
