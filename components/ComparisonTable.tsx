
import React, { useRef, useCallback } from 'react';
import { ChartConfig } from '../types';
import { Download, User, Globe, Calendar, MapPin, DollarSign, Flame, Map as MapIcon, Clock, Trophy } from 'lucide-react';
import { toPng } from 'html-to-image';

interface Props {
  config: ChartConfig;
}

const ComparisonTable: React.FC<Props> = ({ config }) => {
  const tableRef = useRef<HTMLDivElement>(null);
  const activePlayers = config.players.filter(p => p.visible !== false);

  const calculateAge = (birthDate?: string) => {
    if (!birthDate) return '-';
    const birth = new Date(birthDate);
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    const m = now.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) {
        age--;
    }
    return age.toString();
  };

  const handleDownload = useCallback(() => {
    if (tableRef.current === null) return;
    setTimeout(() => {
      if (tableRef.current) {
        toPng(tableRef.current, { 
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
            link.download = `proscout-comparison-${Date.now()}.png`;
            link.href = dataUrl;
            link.click();
          })
          .catch((err) => {
            console.error('Failed to download image', err);
            alert('Error al generar la imagen.');
          });
      }
    }, 100);
  }, [tableRef]);

  if (activePlayers.length === 0) return null;

  return (
    <div ref={tableRef} className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-xl p-1">
      <div className="p-4 border-b border-slate-700 bg-slate-900/50 flex justify-between items-center">
        <div>
            <h3 className="font-bold text-white uppercase tracking-tight">Comparativa Directa (Mejor vs Resto)</h3>
            <p className="text-[10px] text-slate-500 uppercase font-semibold mt-0.5">Ficha técnica y rendimiento métrico</p>
        </div>
        <button 
            onClick={handleDownload}
            className="p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
            title="Descargar como PNG"
        >
            <Download size={18} />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="bg-slate-900 text-slate-400">
              <th className="p-4 font-semibold uppercase text-xs tracking-wider w-40">Perfil del Jugador</th>
              {activePlayers.map(player => (
                <th key={player.id} className="p-4 font-bold text-center border-l border-slate-800">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full border-2 overflow-hidden bg-slate-800" style={{ borderColor: player.color }}>
                        {player.image ? (
                            <img src={player.image} alt={player.name} className="w-full h-full object-cover" />
                        ) : (
                            <User size={24} className="m-auto mt-2 text-slate-600" />
                        )}
                    </div>
                    <span style={{ color: player.color }} className="text-sm">{player.name}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Visual Technical Data Rows */}
            <tr className="bg-slate-900/40">
                <td className="p-4 text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                    <MapIcon size={14} className="text-emerald-500" /> Posición Táctica
                </td>
                {activePlayers.map(p => (
                    <td key={`pitch-${p.id}`} className="p-2 border-l border-slate-700/50">
                        {p.pitchPositionImage ? (
                            <div className="max-w-[120px] mx-auto rounded overflow-hidden border border-slate-600 bg-slate-900">
                                <img src={p.pitchPositionImage} alt="Position" className="w-full h-auto" />
                            </div>
                        ) : (
                            <div className="text-center py-4 text-slate-600 italic text-[10px]">Sin datos</div>
                        )}
                    </td>
                ))}
            </tr>
            <tr className="bg-slate-900/40">
                <td className="p-4 text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                    <Flame size={14} className="text-orange-500" /> Mapa de Calor
                </td>
                {activePlayers.map(p => (
                    <td key={`heatmap-${p.id}`} className="p-2 border-l border-slate-700/50">
                        {p.heatmapImage ? (
                            <div className="max-w-[120px] mx-auto rounded overflow-hidden border border-slate-600 bg-slate-900">
                                <img src={p.heatmapImage} alt="Heatmap" className="w-full h-auto" />
                            </div>
                        ) : (
                            <div className="text-center py-4 text-slate-600 italic text-[10px]">Sin datos</div>
                        )}
                    </td>
                ))}
            </tr>

            {/* Bio Info Section */}
            <tr className="bg-slate-800/30">
                <td className="p-4 text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                    <Globe size={14} /> Nacionalidad
                </td>
                {activePlayers.map(p => (
                    <td key={`nat-${p.id}`} className="p-4 text-center text-slate-300 font-medium border-l border-slate-700/50">
                        {p.nationality || '-'}
                    </td>
                ))}
            </tr>
            <tr>
                <td className="p-4 text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                    <MapPin size={14} /> Posición
                </td>
                {activePlayers.map(p => (
                    <td key={`pos-${p.id}`} className="p-4 text-center text-slate-300 font-medium border-l border-slate-700/50">
                        {p.position || '-'}
                    </td>
                ))}
            </tr>
            <tr className="bg-slate-800/30">
                <td className="p-4 text-xs font-bold text-slate-500 uppercase flex items-center gap-2 text-emerald-400">
                    <Clock size={14} /> Minutos Totales
                </td>
                {activePlayers.map(p => (
                    <td key={`min-${p.id}`} className="p-4 text-center text-emerald-100 font-bold border-l border-slate-700/50">
                        {p.minutesPlayed || '-'}
                    </td>
                ))}
            </tr>
            <tr>
                <td className="p-4 text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                    <Trophy size={14} /> Competición
                </td>
                {activePlayers.map(p => (
                    <td key={`comp-${p.id}`} className="p-4 text-center text-slate-300 font-medium border-l border-slate-700/50">
                        {p.competition || '-'}
                    </td>
                ))}
            </tr>
            <tr className="bg-slate-800/30">
                <td className="p-4 text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                    <Calendar size={14} /> Edad
                </td>
                {activePlayers.map(p => (
                    <td key={`age-${p.id}`} className="p-4 text-center text-slate-300 font-medium border-l border-slate-700/50">
                        {calculateAge(p.birthDate)}
                    </td>
                ))}
            </tr>
            <tr>
                <td className="p-4 text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                    <DollarSign size={14} /> Valor Mercado
                </td>
                {activePlayers.map(p => (
                    <td key={`val-${p.id}`} className="p-4 text-center text-emerald-400 font-bold border-l border-slate-700/50">
                        {p.marketValue || '-'}
                    </td>
                ))}
            </tr>

            {/* Metrics Separator */}
            <tr className="bg-slate-900">
                <td colSpan={activePlayers.length + 1} className="p-2 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] text-center">
                    Rendimiento Métrico (0-100)
                </td>
            </tr>

            {config.categories.map((category, idx) => {
              const rowValues = activePlayers.map(p => p.values[idx] || 0);
              const maxVal = Math.max(...rowValues);

              return (
                <tr key={idx} className="hover:bg-slate-700/20 transition-colors border-t border-slate-700/50">
                  <td className="p-4 font-medium text-slate-300">{category}</td>
                  {activePlayers.map(player => {
                    const val = player.values[idx] || 0;
                    const isMax = val === maxVal;
                    const cellStyle = isMax 
                        ? { backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.4)' }
                        : { color: '#94a3b8' };

                    return (
                      <td key={`${player.id}-${idx}`} className="p-3 text-center border-l border-slate-700/50">
                        <div className="inline-block px-3 py-1 rounded font-bold text-xs min-w-[3rem]" style={cellStyle}>
                          {val}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
          <tfoot className="bg-slate-900/80 font-bold text-slate-200">
             <tr className="border-t-2 border-slate-700">
                <td className="p-4 uppercase text-xs tracking-widest text-slate-400">Promedio General</td>
                {(() => {
                    const averages = activePlayers.map(p => 
                        Math.round(p.values.reduce((a, b) => a + b, 0) / p.values.length)
                    );
                    const maxAvg = Math.max(...averages);
                    return activePlayers.map((player, idx) => (
                        <td key={player.id} className="p-4 text-center border-l border-slate-700/50">
                            <span className={`text-base ${averages[idx] === maxAvg ? 'text-emerald-400' : 'text-slate-500'}`}>
                                {averages[idx]}
                            </span>
                        </td>
                    ));
                })()}
             </tr>
          </tfoot>
        </table>
      </div>
      <div className="p-3 flex justify-end bg-slate-900/20">
         <span className="text-[10px] text-slate-500 italic font-medium">Ficha generada por ProScout IA</span>
      </div>
    </div>
  );
};

export default ComparisonTable;
