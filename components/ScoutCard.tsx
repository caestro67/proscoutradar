
import React, { useMemo, useRef, useCallback } from 'react';
import { ChartConfig, PlayerData } from '../types';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, PolarRadiusAxis
} from 'recharts';
import { Globe, Calendar, MapPin, Sparkles, User, TrendingUp, TrendingDown, DollarSign, Download, Clock, Trophy } from 'lucide-react';
import { toPng } from 'html-to-image';

interface Props {
  config: ChartConfig;
  player: PlayerData;
  aiAnalysis?: string | null;
}

const ScoutCard: React.FC<Props> = ({ config, player, aiAnalysis }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const calculateAge = (birthDate?: string) => {
    if (!birthDate) return '-';
    try {
      const birth = new Date(birthDate);
      const now = new Date();
      let age = now.getFullYear() - birth.getFullYear();
      const m = now.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
      return isNaN(age) ? '-' : age;
    } catch (e) { return '-'; }
  };

  const radarData = useMemo(() => {
    if (!config?.categories) return [];
    return config.categories.map((cat, i) => ({
      subject: cat,
      value: player?.values?.[i] || 0
    }));
  }, [config.categories, player]);

  const sortedIndices = useMemo(() => {
    if (!player?.values) return [];
    return player.values
      .map((val, idx) => ({ val, idx }))
      .sort((a, b) => b.val - a.val);
  }, [player.values]);

  const strengths = useMemo(() => 
    sortedIndices.slice(0, 4).map(item => ({ name: config.categories[item.idx] || 'Métrica' })),
    [sortedIndices, config.categories]
  );
  
  const weaknesses = useMemo(() => 
    sortedIndices.slice(-4).reverse().map(item => ({ name: config.categories[item.idx] || 'Métrica' })),
    [sortedIndices, config.categories]
  );

  const handleDownload = useCallback(async () => {
    if (!cardRef.current) return;
    
    try {
      const dataUrl = await toPng(cardRef.current, { 
        cacheBust: true, 
        backgroundColor: '#0a1120',
        pixelRatio: 2,
        skipFonts: true, 
        filter: (node) => {
          if (node instanceof HTMLElement && node.dataset?.captureIgnore === "true") {
            return false;
          }
          return true;
        }
      });
      
      const link = document.createElement('a');
      const fileName = (player?.name || 'player').replace(/\s+/g, '-');
      link.download = `ScoutReport-${fileName}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error al generar la imagen:', err);
      alert('Hubo un problema al generar la imagen. Inténtalo de nuevo.');
    }
  }, [player?.name]);

  const displayLastName = useMemo(() => {
    const name = player?.name || 'JUGADOR';
    const parts = name.trim().split(' ');
    return parts.length > 0 ? parts[parts.length - 1] : 'JUGADOR';
  }, [player?.name]);

  return (
    <div 
      ref={cardRef}
      id="scout-card-render" 
      className="w-[1200px] h-[675px] bg-[#0a1120] text-white p-8 flex flex-col relative overflow-hidden font-sans select-none border border-slate-800 shadow-2xl"
    >
      <button 
        data-capture-ignore="true"
        onClick={handleDownload}
        className="absolute top-6 right-8 z-[100] bg-slate-800/80 hover:bg-emerald-600 text-white p-2.5 rounded-full border border-slate-700 transition-all active:scale-95 group shadow-xl"
        title="Descargar Informe PNG"
      >
        <Download size={20} className="group-hover:scale-110 transition-transform" />
      </button>

      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="flex justify-between items-center z-50 mb-4 h-[50px] shrink-0 pr-16">
        <div className="flex items-center gap-4">
          {config?.teamLogo && <img src={config.teamLogo} className="h-10 w-10 object-contain drop-shadow-md" alt="Logo" />}
          <h2 className="text-xl font-black tracking-[0.4em] text-slate-500 italic uppercase">SCOUT REPORT</h2>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-2">
            <Sparkles size={12} className="text-emerald-400" />
            <p className="text-[10px] font-black tracking-[0.2em] text-emerald-400 uppercase">AI ENGINE ENABLED</p>
          </div>
          <p className="text-lg font-black italic mt-1">ProScout <span className="text-emerald-500">IA</span></p>
        </div>
      </div>

      <div className="flex-1 flex gap-6 z-40 relative min-h-0">
        <div className="w-[32%] flex flex-col bg-slate-900/40 border border-slate-800/60 rounded-[40px] p-6 relative">
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-[#1e293b] px-6 py-1 rounded-full border border-slate-700 z-10">
             <span className="text-[10px] font-black tracking-widest uppercase text-slate-300">ESTADÍSTICAS RADAR</span>
          </div>
          <div className="flex-1 mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: 800 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar dataKey="value" stroke={player?.color || '#10b981'} fill={player?.color || '#10b981'} fillOpacity={0.2} strokeWidth={3} isAnimationActive={false} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-3 mt-2 bg-slate-800/60 py-2 rounded-2xl border border-slate-700/50">
             <div className="w-6 h-6 rounded-full border border-emerald-500 overflow-hidden shrink-0">
                {player?.image ? <img src={player.image} className="w-full h-full object-cover" /> : <User size={12} />}
             </div>
             <p className="text-[10px] font-black uppercase tracking-wider truncate">{player?.name || 'SIN NOMBRE'}</p>
          </div>
        </div>

        <div className="w-[48%] relative flex flex-col">
          <div className="absolute top-0 left-0 z-50">
            <h1 className="text-7xl font-black text-emerald-500 italic tracking-tighter uppercase drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] leading-none">
                {displayLastName}
            </h1>
          </div>

          <div className="flex-1 flex items-end justify-center relative overflow-hidden">
            {player?.image && <img src={player.image} className="h-full w-auto object-contain z-10 drop-shadow-[0_20px_30px_rgba(0,0,0,0.8)]" />}
            <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-[#0a1120] to-transparent z-20"></div>
          </div>

          {/* Bio Overlays */}
          <div className="absolute top-20 left-0 space-y-2 z-50">
             <div className="bg-slate-900/90 backdrop-blur-md p-1.5 px-4 rounded-xl border border-slate-700/50 flex gap-3 items-center shadow-xl">
                <Globe size={14} className="text-emerald-500" /> <p className="text-[11px] font-black uppercase tracking-wide">{player?.nationality || 'DESCONOCIDO'}</p>
             </div>
             <div className="bg-slate-900/90 backdrop-blur-md p-1.5 px-4 rounded-xl border border-slate-700/50 flex gap-3 items-center shadow-xl">
                <Calendar size={14} className="text-emerald-500" /> <p className="text-[11px] font-black uppercase tracking-wide">{calculateAge(player?.birthDate)} AÑOS</p>
             </div>
             <div className="bg-slate-900/90 backdrop-blur-md p-1.5 px-4 rounded-xl border border-slate-700/50 flex gap-3 items-center shadow-xl">
                <MapPin size={14} className="text-emerald-500" /> <p className="text-[11px] font-black uppercase tracking-wide">{player?.position || 'N/A'}</p>
             </div>
             <div className="bg-slate-900/90 backdrop-blur-md p-1.5 px-4 rounded-xl border border-slate-700/50 flex gap-3 items-center shadow-xl">
                <Clock size={14} className="text-emerald-500" /> <p className="text-[11px] font-black uppercase tracking-wide">{player?.minutesPlayed || '0\''} MINS</p>
             </div>
             <div className="bg-slate-900/90 backdrop-blur-md p-1.5 px-4 rounded-xl border border-slate-700/50 flex gap-3 items-center shadow-xl">
                <Trophy size={14} className="text-emerald-500" /> <p className="text-[11px] font-black uppercase tracking-wide truncate max-w-[150px]">{player?.competition || 'COMPETICIÓN'}</p>
             </div>
             <div className="bg-slate-900/90 backdrop-blur-md p-1.5 px-4 rounded-xl border border-slate-700/50 flex gap-3 items-center shadow-xl border-emerald-500/30">
                <DollarSign size={14} className="text-emerald-400" /> <p className="text-[11px] font-black uppercase tracking-wide text-emerald-400">{player?.marketValue || 'P.R.'}</p>
             </div>
          </div>

          <div className="absolute bottom-2 left-0 w-full flex justify-between gap-4 z-50">
             <div className="flex-1 space-y-1">
                <p className="text-[8px] font-black uppercase text-emerald-400 mb-1 flex items-center gap-1 tracking-widest"><TrendingUp size={10}/> Fortalezas (Top 4)</p>
                {strengths.map((s, i) => (
                    <div key={i} className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-1.5 px-3 flex justify-between items-center backdrop-blur-md shadow-lg transition-transform hover:scale-[1.02]">
                        <span className="text-[9px] font-black uppercase truncate max-w-[110px]">{s.name}</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                    </div>
                ))}
             </div>
             <div className="flex-1 space-y-1">
                <p className="text-[8px] font-black uppercase text-amber-500 mb-1 flex items-center gap-1 tracking-widest"><TrendingDown size={10}/> Áreas Mejora (Bottom 4)</p>
                {weaknesses.map((w, i) => (
                    <div key={i} className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-1.5 px-3 flex justify-between items-center backdrop-blur-md shadow-lg transition-transform hover:scale-[1.02]">
                        <span className="text-[9px] font-black uppercase truncate max-w-[110px]">{w.name}</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"></div>
                    </div>
                ))}
             </div>
          </div>
        </div>

        <div className="w-[20%] flex flex-col gap-4 shrink-0">
            <div className="flex-1 bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden p-3 flex flex-col items-center justify-center relative shadow-inner">
                <span className="absolute top-3 left-3 text-[9px] font-black uppercase text-emerald-500/60 italic tracking-widest">Heatmap</span>
                <div className="w-full h-full flex items-center justify-center p-2">
                  {player?.heatmapImage ? 
                    <img src={player.heatmapImage} className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" /> : 
                    <div className="text-[8px] text-slate-700 font-bold border border-slate-800 p-4 rounded-full">NO HEATMAP</div>
                  }
                </div>
            </div>
            <div className="flex-1 bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden p-3 flex flex-col items-center justify-center relative shadow-inner">
                <span className="absolute top-3 left-3 text-[9px] font-black uppercase text-emerald-500/60 italic tracking-widest">Tactical</span>
                <div className="w-full h-full flex items-center justify-center p-2">
                  {player?.pitchPositionImage ? 
                    <img src={player.pitchPositionImage} className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" /> : 
                    <div className="text-[8px] text-slate-700 font-bold border border-slate-800 p-4 rounded-full">NO POSITION</div>
                  }
                </div>
            </div>
        </div>
      </div>

      <div className="h-[110px] mt-6 bg-[#111a2e] border border-slate-800/80 rounded-[32px] p-6 flex items-center gap-6 relative shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 shrink-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-emerald-400 to-emerald-600"></div>
          <div className="flex-1 min-w-0">
             <div className="flex items-center gap-2 mb-1.5">
                <Sparkles size={16} className="text-emerald-400" />
                <span className="text-[11px] font-black uppercase text-emerald-400 tracking-[0.25em]">IA SCOUTING INSIGHT</span>
             </div>
             <p className="text-slate-100 italic text-xl leading-tight font-semibold pr-12 line-clamp-2">
                "{aiAnalysis || config?.observations || 'Analizando perfil técnico y métricas avanzadas para generar el resumen ejecutivo...'}"
             </p>
          </div>
          <div className="shrink-0 text-right opacity-20 border-l border-slate-800 pl-6 h-full flex flex-col justify-center">
             <p className="text-[9px] font-black uppercase tracking-[1.2em] rotate-90 whitespace-nowrap text-slate-400 mr-[-20px]">SYSTEM v3.1</p>
          </div>
      </div>
    </div>
  );
};

export default ScoutCard;
