import React from 'react';
import { ChartConfig, PlayerData } from '../types';
import { Trash2, Plus, RefreshCcw } from 'lucide-react';
import { PLAYER_COLORS } from '../constants';

interface Props {
  config: ChartConfig;
  onChange: (newConfig: ChartConfig) => void;
}

const StatEditor: React.FC<Props> = ({ config, onChange }) => {

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...config, title: e.target.value });
  };

  const handleCategoryChange = (index: number, value: string) => {
    const newCategories = [...config.categories];
    newCategories[index] = value;
    onChange({ ...config, categories: newCategories });
  };

  const handleValueChange = (playerIndex: number, valIndex: number, value: string) => {
    const numValue = value === '' ? 0 : Number(value);
    const newPlayers = [...config.players];
    newPlayers[playerIndex].values[valIndex] = numValue;
    onChange({ ...config, players: newPlayers });
  };

  const handleAddPlayer = () => {
    const newId = `p${Date.now()}`;
    const nextColorIndex = config.players.length % PLAYER_COLORS.length;
    const newPlayer: PlayerData = {
      id: newId,
      name: `Player ${config.players.length + 1}`,
      color: PLAYER_COLORS[nextColorIndex],
      values: new Array(config.categories.length).fill(50)
    };
    onChange({ ...config, players: [...config.players, newPlayer] });
  };

  const handleRemovePlayer = (index: number) => {
    const newPlayers = config.players.filter((_, i) => i !== index);
    onChange({ ...config, players: newPlayers });
  };

  const handlePlayerNameChange = (index: number, name: string) => {
    const newPlayers = [...config.players];
    newPlayers[index].name = name;
    onChange({ ...config, players: newPlayers });
  };

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 space-y-6">
      <div className="flex justify-between items-center border-b border-slate-700 pb-4">
        <h3 className="text-lg font-semibold text-white">Data Configuration</h3>
      </div>

      {/* Chart Title */}
      <div>
        <label className="block text-sm font-medium text-slate-400 mb-1">Chart Title</label>
        <input 
          type="text" 
          value={config.title} 
          onChange={handleTitleChange}
          className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* Players & Values */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-slate-300">Player Stats</h4>
            <button 
                onClick={handleAddPlayer}
                className="flex items-center gap-1 text-xs bg-blue-600 hover:bg-blue-500 text-white px-2 py-1 rounded transition-colors"
            >
                <Plus size={14} /> Add Player
            </button>
        </div>

        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr>
                        <th className="p-2 text-xs text-slate-500 border-b border-slate-700 bg-slate-800/50 sticky left-0 z-10">Metric / Player</th>
                        {config.players.map((p, pIdx) => (
                            <th key={p.id} className="p-2 min-w-[120px] border-b border-slate-700">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ background: p.color }}></div>
                                    <input 
                                        type="text" 
                                        value={p.name}
                                        onChange={(e) => handlePlayerNameChange(pIdx, e.target.value)}
                                        className="bg-transparent text-white font-medium w-full outline-none border-b border-transparent focus:border-blue-500 text-sm"
                                    />
                                    {config.players.length > 1 && (
                                        <button onClick={() => handleRemovePlayer(pIdx)} className="text-slate-600 hover:text-red-400">
                                            <Trash2 size={14} />
                                        </button>
                                    )}
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {config.categories.map((cat, cIdx) => (
                        <tr key={cIdx} className="hover:bg-slate-700/30 transition-colors">
                            <td className="p-2 sticky left-0 bg-slate-800 z-10 border-r border-slate-700">
                                <input 
                                    type="text" 
                                    value={cat}
                                    onChange={(e) => handleCategoryChange(cIdx, e.target.value)}
                                    className="bg-transparent text-slate-300 text-xs w-full outline-none focus:text-blue-400"
                                />
                            </td>
                            {config.players.map((p, pIdx) => (
                                <td key={`${p.id}-${cIdx}`} className="p-2">
                                    <input 
                                        type="number"
                                        value={p.values[cIdx]}
                                        onChange={(e) => handleValueChange(pIdx, cIdx, e.target.value)}
                                        className="w-full bg-slate-900/50 border border-slate-700 rounded px-2 py-1 text-white text-xs text-center focus:border-blue-500 outline-none"
                                    />
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default StatEditor;