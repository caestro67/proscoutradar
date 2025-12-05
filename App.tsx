import React, { useState } from 'react';
import RadarChartComponent from './components/RadarChartComponent';
import StatEditor from './components/StatEditor';
import AiScout from './components/AiScout';
import { ChartConfig } from './types';
import { INITIAL_DATA, ALTERNATIVE_TEMPLATES, PLAYER_COLORS } from './constants';
import { LayoutDashboard, Settings2, Github } from 'lucide-react';

const App: React.FC = () => {
  const [config, setConfig] = useState<ChartConfig>(INITIAL_DATA);

  const loadTemplate = (type: 'ATTACK' | 'DEFENSE' | 'POSSESSION') => {
    const template = ALTERNATIVE_TEMPLATES[type];
    let newTitle = '';
    
    switch (type) {
      case 'ATTACK':
        newTitle = 'Rendimiento Ofensivo';
        break;
      case 'DEFENSE':
        newTitle = 'Acciones Defensivas';
        break;
      case 'POSSESSION':
        newTitle = 'Impacto en Posesión';
        break;
    }

    setConfig(prev => ({
      ...prev,
      title: newTitle,
      categories: template.categories,
      players: prev.players.map(p => ({
        ...p,
        values: [...template.values] // Reset values to template default to avoid length mismatch
      }))
    }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 pb-20">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 backdrop-blur-md bg-opacity-80">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <LayoutDashboard size={20} className="text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              ProScout Radar
            </h1>
          </div>
          <div className="flex items-center gap-4">
             <div className="hidden md:flex gap-2">
                <button 
                    onClick={() => loadTemplate('POSSESSION')}
                    className="text-xs font-medium px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
                >
                    Plantilla Posesión
                </button>
                <button 
                    onClick={() => loadTemplate('ATTACK')}
                    className="text-xs font-medium px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
                >
                    Plantilla Ataque
                </button>
                <button 
                    onClick={() => loadTemplate('DEFENSE')}
                    className="text-xs font-medium px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
                >
                    Plantilla Defensa
                </button>
             </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        
        {/* Mobile Template Buttons */}
        <div className="md:hidden flex gap-2 overflow-x-auto pb-4 mb-2">
            <button 
                onClick={() => loadTemplate('POSSESSION')}
                className="whitespace-nowrap text-xs font-medium px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
            >
                Plantilla Posesión
            </button>
            <button 
                onClick={() => loadTemplate('ATTACK')}
                className="whitespace-nowrap text-xs font-medium px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
            >
                Plantilla Ataque
            </button>
            <button 
                onClick={() => loadTemplate('DEFENSE')}
                className="whitespace-nowrap text-xs font-medium px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
            >
                Plantilla Defensa
            </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Chart */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
            <RadarChartComponent config={config} />
            
            <div className="hidden lg:block">
               <AiScout config={config} />
            </div>
          </div>

          {/* Right Column: Controls */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-6">
            <StatEditor config={config} onChange={setConfig} />
            
            <div className="lg:hidden">
               <AiScout config={config} />
            </div>

            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 text-sm text-slate-500">
               <h4 className="font-semibold text-slate-400 mb-2 flex items-center gap-2">
                 <Settings2 size={16} /> Instrucciones
               </h4>
               <ul className="list-disc list-inside space-y-1 ml-1">
                 <li>Agrega jugadores para comparar estadísticas.</li>
                 <li>Haz clic en las categorías para renombrar los ejes.</li>
                 <li>Los valores se ajustan automáticamente (máx del set o 100).</li>
                 <li>Usa la IA para generar un informe de scouting.</li>
               </ul>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;