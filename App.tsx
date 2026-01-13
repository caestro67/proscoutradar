
import React, { useState, useEffect } from 'react';
import RadarChartComponent from './components/RadarChartComponent';
import BarChartComponent from './components/BarChartComponent';
import StatEditor from './components/StatEditor';
import AiAssistant from './components/AiAssistant';
import ComparisonTable from './components/ComparisonTable';
import TemplateManager from './components/TemplateManager';
import ScoutCard from './components/ScoutCard'; 
import VideoGenerator from './components/VideoGenerator';
import AppGuide from './components/AppGuide';
import { ChartConfig } from './types';
import { INITIAL_DATA, ALTERNATIVE_TEMPLATES } from './constants';
import { Settings2, BarChart2 as AppIcon, FileJson, FileUp, Video } from 'lucide-react';

const STORAGE_KEY = 'proscout_radar_config_v1';

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<'radar' | 'bar' | 'card' | 'video'>('radar');
  const [showEditor, setShowEditor] = useState(true);
  const [config, setConfig] = useState<ChartConfig>(INITIAL_DATA);
  const [analysisMap, setAnalysisMap] = useState<Record<string, { detailed: string, summary: string }>>({});
  const [hasApiKey, setHasApiKey] = useState(false);

  useEffect(() => {
    const checkKey = async () => {
      const selected = await window.aistudio.hasSelectedApiKey();
      setHasApiKey(selected);
    };
    checkKey();
    
    const savedConfig = localStorage.getItem(STORAGE_KEY);
    if (savedConfig) {
      try { setConfig(JSON.parse(savedConfig)); } catch (e) {}
    }
  }, []);

  const handleOpenKeySelector = async () => {
    await window.aistudio.openSelectKey();
    setHasApiKey(true); 
  };

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  }, [config]);

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.categories && json.players) {
          setConfig(json);
        } else {
          alert("El archivo JSON no tiene el formato de ProScout válido.");
        }
      } catch (err) {
        alert("Error al leer el archivo JSON.");
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleAnalysisChange = (res: string) => {
    try {
      const data = JSON.parse(res);
      if (!data.players || data.players.length === 0) {
        setAnalysisMap({});
        return;
      }
      const newMap: Record<string, { detailed: string, summary: string }> = {};
      data.players.forEach((p: any) => {
        newMap[p.id] = { detailed: p.detailedAnalysis, summary: p.executiveSummary };
      });
      setAnalysisMap(newMap);
    } catch (e) {
      setAnalysisMap({});
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans">
      <header className="bg-slate-900 border-b border-slate-800 h-16 flex items-center px-6 justify-between shadow-xl sticky top-0 z-[100]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-600 rounded flex items-center justify-center shadow-lg"><AppIcon className="text-white" size={18} /></div>
          <h1 className="text-lg font-black uppercase tracking-tighter">ProScout <span className="text-emerald-500">IA</span></h1>
        </div>
        <div className="flex items-center gap-2">
          
          <AppGuide />

          <label className="flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-emerald-400 text-xs font-bold transition-all cursor-pointer">
            <FileUp size={16} /> IMPORTAR JSON
            <input type="file" accept=".json" className="hidden" onChange={handleImportJson} />
          </label>

          <button onClick={() => {
            const blob = new Blob([JSON.stringify(config, null, 2)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url; a.download = `backup_${Date.now()}.json`; a.click();
          }} className="flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-blue-400 text-xs font-bold transition-all">
            <FileJson size={16} /> BACKUP
          </button>
          
          <button onClick={() => setShowEditor(!showEditor)} className={`p-2 rounded-lg transition-colors ${showEditor ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}><Settings2 size={20} /></button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {showEditor && (
          <div className="lg:col-span-4 space-y-6">
            <TemplateManager 
              currentConfig={config} 
              onLoadTemplate={(cat) => setConfig({...config, categories: cat})} 
              onLoadStandardTemplate={(type) => {
                const template = ALTERNATIVE_TEMPLATES[type];
                const newPlayers = config.players.map(p => ({ ...p, values: [...template.values] }));
                setConfig({ ...config, categories: template.categories, players: newPlayers });
              }} 
            />
            <StatEditor config={config} onChange={setConfig} />
          </div>
        )}
        <div className={showEditor ? "lg:col-span-8 space-y-6" : "lg:col-span-12 space-y-6"}>
          <div className="bg-slate-900/50 p-2 rounded border border-slate-800 flex justify-between items-center shadow-inner">
             <div className="flex gap-1">
                {['radar', 'bar', 'card', 'video'].map(m => (
                  <button key={m} onClick={() => setViewMode(m as any)} className={`px-4 py-1.5 rounded text-[10px] font-black uppercase transition-all ${viewMode === m ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-300'}`}>
                    {m === 'video' ? <div className="flex items-center gap-1"><Video size={12}/> video</div> : m}
                  </button>
                ))}
             </div>
          </div>
          <div className="min-h-[500px]">
            {viewMode === 'radar' && <RadarChartComponent config={config} />}
            {viewMode === 'bar' && <BarChartComponent config={config} />}
            {viewMode === 'card' && (
              <div className="flex flex-col items-center gap-10 w-full overflow-visible">
                {config.players.filter(p => p.visible !== false).map(p => (
                   <div key={p.id} className="w-full flex justify-center -ml-4 lg:-ml-8">
                      <div className="scale-[0.55] sm:scale-[0.7] xl:scale-[0.85] origin-center -my-[180px] sm:-my-[120px]">
                        <ScoutCard config={config} player={p} aiAnalysis={analysisMap[p.id]?.summary} />
                      </div>
                   </div>
                ))}
              </div>
            )}
            {viewMode === 'video' && <VideoGenerator config={config} hasKey={hasApiKey} onOpenKey={handleOpenKeySelector} />}
            {viewMode !== 'card' && viewMode !== 'video' && <div className="mt-8"><ComparisonTable config={config} /></div>}
          </div>
          <AiAssistant config={config} onAnalysisChange={handleAnalysisChange} />
        </div>
      </main>
    </div>
  );
};

export default App;
