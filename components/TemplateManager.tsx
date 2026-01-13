
import React, { useState, useEffect } from 'react';
import { CustomTemplate, ChartConfig } from '../types';
import { Save, Trash2, LayoutTemplate, Shield, Sword, Activity } from 'lucide-react';

interface Props {
  currentConfig: ChartConfig;
  onLoadTemplate: (categories: string[]) => void;
  onLoadStandardTemplate: (type: 'ATTACK' | 'DEFENSE' | 'POSSESSION') => void;
}

const TEMPLATE_STORAGE_KEY = 'proscout_custom_templates';

const TemplateManager: React.FC<Props> = ({ currentConfig, onLoadTemplate, onLoadStandardTemplate }) => {
  const [templates, setTemplates] = useState<CustomTemplate[]>([]);
  const [newTemplateName, setNewTemplateName] = useState('');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(TEMPLATE_STORAGE_KEY);
      if (saved) {
        setTemplates(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Error loading templates", e);
    }
  }, []);

  const saveTemplate = () => {
    if (!newTemplateName.trim()) return;
    
    const newTemplate: CustomTemplate = {
      id: Date.now().toString(),
      name: newTemplateName,
      categories: [...currentConfig.categories]
    };

    const updated = [...templates, newTemplate];
    
    try {
      localStorage.setItem(TEMPLATE_STORAGE_KEY, JSON.stringify(updated));
      setTemplates(updated);
      setNewTemplateName('');
    } catch (e) {
      alert("No se pudo guardar la plantilla: Almacenamiento lleno.");
      console.error("Storage limit reached", e);
    }
  };

  const deleteTemplate = (id: string) => {
    const updated = templates.filter(t => t.id !== id);
    try {
      localStorage.setItem(TEMPLATE_STORAGE_KEY, JSON.stringify(updated));
      setTemplates(updated);
    } catch (e) {
      console.error("Error saving templates after delete", e);
      setTemplates(updated);
    }
  };

  return (
    <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
      
      {/* Standard Templates Section */}
      <h4 className="font-semibold text-slate-400 mb-3 flex items-center gap-2 text-sm">
        <Activity size={16} /> Plantillas Estándar
      </h4>
      <div className="grid grid-cols-3 gap-2 mb-6">
        <button 
            onClick={() => onLoadStandardTemplate('ATTACK')}
            className="flex flex-col items-center justify-center gap-1 p-2 bg-slate-800 hover:bg-blue-900/40 border border-slate-700 hover:border-blue-500 rounded-lg transition-all group"
        >
            <Sword size={18} className="text-slate-400 group-hover:text-blue-400" />
            <span className="text-[10px] font-medium text-slate-400 group-hover:text-slate-200">Ataque</span>
        </button>
        <button 
            onClick={() => onLoadStandardTemplate('DEFENSE')}
            className="flex flex-col items-center justify-center gap-1 p-2 bg-slate-800 hover:bg-green-900/40 border border-slate-700 hover:border-green-500 rounded-lg transition-all group"
        >
            <Shield size={18} className="text-slate-400 group-hover:text-green-400" />
            <span className="text-[10px] font-medium text-slate-400 group-hover:text-slate-200">Defensa</span>
        </button>
        <button 
            onClick={() => onLoadStandardTemplate('POSSESSION')}
            className="flex flex-col items-center justify-center gap-1 p-2 bg-slate-800 hover:bg-amber-900/40 border border-slate-700 hover:border-amber-500 rounded-lg transition-all group"
        >
            <Activity size={18} className="text-slate-400 group-hover:text-amber-400" />
            <span className="text-[10px] font-medium text-slate-400 group-hover:text-slate-200">Posesión</span>
        </button>
      </div>

      <div className="h-px bg-slate-800 mb-4"></div>

      {/* Custom Templates Section */}
      <h4 className="font-semibold text-slate-400 mb-4 flex items-center gap-2 text-sm">
        <LayoutTemplate size={16} /> Mis Plantillas
      </h4>

      {/* Save Current */}
      <div className="flex gap-2 mb-4">
        <input 
          type="text" 
          value={newTemplateName}
          onChange={(e) => setNewTemplateName(e.target.value)}
          placeholder="Nombre nueva plantilla..."
          className="flex-1 bg-slate-800 border border-slate-700 rounded px-3 py-1.5 text-xs text-white outline-none focus:border-blue-500"
        />
        <button 
          onClick={saveTemplate}
          className="bg-blue-600 hover:bg-blue-500 text-white p-1.5 rounded transition-colors"
          title="Guardar categorías actuales"
        >
          <Save size={16} />
        </button>
      </div>

      {/* List */}
      <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
        {templates.length === 0 ? (
          <p className="text-xs text-slate-600 text-center italic">No hay plantillas guardadas.</p>
        ) : (
          templates.map(t => (
            <div key={t.id} className="flex items-center justify-between bg-slate-800 px-3 py-2 rounded border border-slate-700/50 group">
              <span className="text-xs text-slate-300 font-medium">{t.name}</span>
              <div className="flex items-center gap-2">
                 <button 
                    onClick={() => onLoadTemplate(t.categories)}
                    className="text-xs text-indigo-400 hover:text-indigo-300 hover:underline"
                 >
                    Cargar
                 </button>
                 <button 
                    onClick={() => deleteTemplate(t.id)}
                    className="text-slate-500 hover:text-red-400"
                 >
                    <Trash2 size={12} />
                 </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TemplateManager;
