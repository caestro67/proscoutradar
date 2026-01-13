
import React from 'react';
import { ChartConfig, PlayerData } from '../types';
import { Trash2, Plus, Eye, EyeOff, Upload, User, Map as MapIcon, Flame, Shield, Clock, Trophy } from 'lucide-react';
import { PLAYER_COLORS, COUNTRIES, POSITIONS } from '../constants';

interface Props {
  config: ChartConfig;
  onChange: (newConfig: ChartConfig) => void;
}

const StatEditor: React.FC<Props> = ({ config, onChange }) => {
  const [activeTab, setActiveTab] = React.useState<'data' | 'report'>('data');

  const handleValueChange = (playerIndex: number, valIndex: number, value: string) => {
    const numValue = value === '' ? 0 : Number(value);
    const newPlayers = [...config.players];
    const player = { ...newPlayers[playerIndex] };
    const newValues = [...player.values];
    newValues[valIndex] = numValue;
    player.values = newValues;
    newPlayers[playerIndex] = player;
    onChange({ ...config, players: newPlayers });
  };

  const updatePlayerField = (playerIndex: number, field: keyof PlayerData, value: any) => {
    const newPlayers = [...config.players];
    newPlayers[playerIndex] = { ...newPlayers[playerIndex], [field]: value };
    onChange({ ...config, players: newPlayers });
  };

  const handleImageUpload = (playerIndex: number, field: keyof PlayerData, file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      updatePlayerField(playerIndex, field, e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleClubLogoUpload = (file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      onChange({ ...config, teamLogo: e.target?.result as string });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 flex flex-col h-full overflow-hidden shadow-2xl">
      <div className="flex border-b border-slate-700 bg-slate-900/20">
        <button onClick={() => setActiveTab('data')} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'data' ? 'bg-slate-700/50 text-emerald-400 border-b-2 border-emerald-500' : 'text-slate-500'}`}>Datos</button>
        <button onClick={() => setActiveTab('report')} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'report' ? 'bg-slate-700/50 text-emerald-400 border-b-2 border-emerald-500' : 'text-slate-500'}`}>Informe</button>
      </div>

      <div className="p-4 overflow-y-auto max-h-[800px] bg-slate-800/50">
        {activeTab === 'data' && (
          <div className="space-y-6">
            {/* Club Settings Section */}
            <div className="p-4 bg-slate-900/40 rounded-xl border border-slate-700/50 space-y-3">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Shield size={12} className="text-emerald-500" /> Configuración del Club
              </h4>
              <div className="flex items-center gap-4">
                <label className="relative group cursor-pointer shrink-0">
                  <div className="w-14 h-14 bg-slate-800 border-2 border-dashed border-slate-600 rounded-xl flex items-center justify-center overflow-hidden group-hover:border-emerald-500 transition-colors">
                    {config.teamLogo ? (
                      <img src={config.teamLogo} className="w-full h-full object-contain p-1" alt="Logo club" />
                    ) : (
                      <Upload size={16} className="text-slate-500 group-hover:text-emerald-500" />
                    )}
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleClubLogoUpload(e.target.files?.[0] || null)} />
                </label>
                <div className="flex-1 space-y-1">
                  <label className="text-[9px] font-black text-slate-500 uppercase">Título del Informe</label>
                  <input 
                    type="text" 
                    value={config.title} 
                    onChange={(e) => onChange({ ...config, title: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-white outline-none focus:border-emerald-500"
                    placeholder="Ej: Análisis de Rendimiento"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Jugadores</h4>
              <button 
                onClick={() => {
                  onChange({
                    ...config,
                    players: [...config.players, {
                      id: `p${Date.now()}`,
                      name: `Nuevo Jugador`,
                      color: PLAYER_COLORS[config.players.length % PLAYER_COLORS.length],
                      values: new Array(config.categories.length).fill(50),
                      visible: true
                    }]
                  });
                }}
                className="bg-emerald-600 text-white px-3 py-1.5 rounded text-[10px] font-black uppercase shadow-lg flex items-center gap-1 transition-all active:scale-95"
              >
                <Plus size={14} /> Añadir
              </button>
            </div>

            <div className="space-y-4">
              {config.players.map((p, pIdx) => (
                <div key={p.id} className="p-4 bg-slate-900/50 rounded-xl border border-slate-700 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
                    <div className="flex items-center gap-2">
                       <input type="color" value={p.color} title="Color del jugador" onChange={(e) => updatePlayerField(pIdx, 'color', e.target.value)} className="w-6 h-6 rounded bg-transparent cursor-pointer" />
                       <input type="text" value={p.name} onChange={(e) => updatePlayerField(pIdx, 'name', e.target.value)} className="bg-transparent text-white font-bold text-sm outline-none border-b border-transparent focus:border-emerald-500" />
                    </div>
                    <div className="flex items-center gap-2">
                       <button onClick={() => {
                         const np = [...config.players]; np[pIdx].visible = !np[pIdx].visible; onChange({...config, players: np});
                       }} className="text-slate-500 hover:text-white transition-colors">
                        {p.visible !== false ? <Eye size={16} /> : <EyeOff size={16} />}
                       </button>
                       <button onClick={() => onChange({...config, players: config.players.filter(pl => pl.id !== p.id)})} className="text-slate-600 hover:text-red-500"><Trash2 size={16} /></button>
                    </div>
                  </div>

                  {/* Multimedia Section */}
                  <div className="grid grid-cols-3 gap-2">
                    <label className="flex flex-col items-center justify-center p-2 bg-slate-800 border border-slate-700 rounded-lg hover:border-emerald-500 transition-colors cursor-pointer group">
                      <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center mb-1 overflow-hidden">
                        {p.image ? <img src={p.image} className="w-full h-full object-cover" /> : <User size={14} className="text-slate-600" />}
                      </div>
                      <span className="text-[8px] font-black text-slate-500 uppercase group-hover:text-emerald-400">Avatar</span>
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(pIdx, 'image', e.target.files?.[0] || null)} />
                    </label>

                    <label className="flex flex-col items-center justify-center p-2 bg-slate-800 border border-slate-700 rounded-lg hover:border-orange-500 transition-colors cursor-pointer group">
                      <div className="w-8 h-8 rounded bg-slate-900 flex items-center justify-center mb-1 overflow-hidden">
                        {p.heatmapImage ? <img src={p.heatmapImage} className="w-full h-full object-contain" /> : <Flame size={14} className="text-slate-600" />}
                      </div>
                      <span className="text-[8px] font-black text-slate-500 uppercase group-hover:text-orange-400">Heatmap</span>
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(pIdx, 'heatmapImage', e.target.files?.[0] || null)} />
                    </label>

                    <label className="flex flex-col items-center justify-center p-2 bg-slate-800 border border-slate-700 rounded-lg hover:border-blue-500 transition-colors cursor-pointer group">
                      <div className="w-8 h-8 rounded bg-slate-900 flex items-center justify-center mb-1 overflow-hidden">
                        {p.pitchPositionImage ? <img src={p.pitchPositionImage} className="w-full h-full object-contain" /> : <MapIcon size={14} className="text-slate-600" />}
                      </div>
                      <span className="text-[8px] font-black text-slate-500 uppercase group-hover:text-blue-400">Posición</span>
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(pIdx, 'pitchPositionImage', e.target.files?.[0] || null)} />
                    </label>
                  </div>

                  {/* Profile Section */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-500 uppercase">Nacionalidad</label>
                      <input 
                        list={`countries-${p.id}`}
                        value={p.nationality || ''} 
                        onChange={(e) => updatePlayerField(pIdx, 'nationality', e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-slate-300 outline-none focus:border-emerald-500"
                        placeholder="Buscar país..."
                      />
                      <datalist id={`countries-${p.id}`}>
                        {COUNTRIES.map(country => (
                          <option key={country} value={country} />
                        ))}
                      </datalist>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-500 uppercase">Posición</label>
                      <input 
                        list={`positions-${p.id}`}
                        value={p.position || ''} 
                        onChange={(e) => updatePlayerField(pIdx, 'position', e.target.value)} 
                        className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-slate-300 outline-none focus:border-emerald-500" 
                        placeholder="Buscar posición..." 
                      />
                      <datalist id={`positions-${p.id}`}>
                        {POSITIONS.map(pos => (
                          <option key={pos} value={pos} />
                        ))}
                      </datalist>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-500 uppercase flex items-center gap-1"><Clock size={10} /> Minutos</label>
                      <input type="text" value={p.minutesPlayed || ''} onChange={(e) => updatePlayerField(pIdx, 'minutesPlayed', e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-slate-300 outline-none focus:border-emerald-500" placeholder="Ej: 2,450'" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-500 uppercase flex items-center gap-1"><Trophy size={10} /> Competición</label>
                      <input type="text" value={p.competition || ''} onChange={(e) => updatePlayerField(pIdx, 'competition', e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-slate-300 outline-none focus:border-emerald-500" placeholder="Ej: LaLiga" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-500 uppercase">Fecha Nac.</label>
                      <input type="date" value={p.birthDate || ''} onChange={(e) => updatePlayerField(pIdx, 'birthDate', e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-slate-300" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-500 uppercase">Valor Mercado</label>
                      <input type="text" value={p.marketValue || ''} onChange={(e) => updatePlayerField(pIdx, 'marketValue', e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-emerald-400 font-bold" placeholder="Ej: 50M €" />
                    </div>
                  </div>

                  {/* Metrics Section */}
                  <div className="mt-4 space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase">Métricas (0-100)</label>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                      {config.categories.map((cat, cIdx) => (
                        <div key={cIdx} className="flex items-center justify-between gap-2 border-b border-slate-800/50 py-1">
                          <span className="text-[10px] text-slate-400 truncate w-24 uppercase">{cat}</span>
                          <input type="number" value={p.values[cIdx]} onChange={(e) => handleValueChange(pIdx, cIdx, e.target.value)} className="w-12 bg-slate-800 text-white text-[11px] text-center font-bold rounded" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'report' && (
          <div className="space-y-6">
            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700 shadow-inner">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Observaciones Generales</label>
              <textarea 
                value={config.observations || ''} 
                onChange={(e) => onChange({ ...config, observations: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-slate-200 h-64 outline-none focus:border-emerald-500 custom-scrollbar shadow-inner"
                placeholder="Añade notas de scouting técnicas..."
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatEditor;
