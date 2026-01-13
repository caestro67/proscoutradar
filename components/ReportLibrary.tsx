
import React, { useState, useEffect } from 'react';
import { ChartConfig, SavedReport } from '../types';
import { FolderOpen, Save, Trash2, PlusCircle, FileText, ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
  currentConfig: ChartConfig;
  onLoadReport: (config: ChartConfig) => void;
  onReset: () => void;
}

const REPORTS_STORAGE_KEY = 'proscout_saved_reports';

const ReportLibrary: React.FC<Props> = ({ currentConfig, onLoadReport, onReset }) => {
  const [reports, setReports] = useState<SavedReport[]>([]);
  const [reportName, setReportName] = useState('');
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(REPORTS_STORAGE_KEY);
      if (saved) {
        setReports(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Error loading reports", e);
    }
  }, []);

  const handleSave = () => {
    if (!reportName.trim()) return;

    // DEEP CLONE: Critical to prevent reference issues. 
    // We want a snapshot of the config AS IT IS NOW, not a live reference.
    const configSnapshot = JSON.parse(JSON.stringify(currentConfig));

    const newReport: SavedReport = {
      id: Date.now().toString(),
      name: reportName,
      timestamp: Date.now(),
      config: configSnapshot
    };

    const updated = [newReport, ...reports];
    
    try {
        localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(updated));
        setReports(updated);
        setReportName('');
    } catch (e) {
        alert("No hay suficiente espacio para guardar este informe. Intenta eliminar informes antiguos o reducir el tamaño de las imágenes.");
        console.error("Storage full", e);
    }
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    // Stop propagation to prevent triggering the "Load" click of the parent container
    e.stopPropagation();
    
    if (window.confirm('¿Estás seguro de querer borrar este informe?')) {
        const updated = reports.filter(r => r.id !== id);
        try {
            localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(updated));
            setReports(updated);
        } catch (e) {
            console.error("Error updating storage after delete", e);
            // Even if storage fails, we update state
            setReports(updated);
        }
    }
  };

  const handleLoad = (report: SavedReport) => {
      if (window.confirm('¿Cargar este informe? Los cambios no guardados en el actual se perderán.')) {
        // DEEP CLONE: Ensure the app gets a fresh object, not a reference to the saved report array
        const configToLoad = JSON.parse(JSON.stringify(report.config));
        onLoadReport(configToLoad);
      }
  };

  const handleNew = () => {
      if (window.confirm('¿Crear nuevo informe vacío?')) {
          onReset();
      }
  }

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden mb-6">
      <div 
        className="p-4 bg-slate-900/50 flex items-center justify-between cursor-pointer hover:bg-slate-900/70 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="font-bold text-slate-200 flex items-center gap-2">
            <FolderOpen size={20} className="text-amber-500" />
            Librería de Informes
        </h3>
        {isOpen ? <ChevronUp size={16} className="text-slate-500"/> : <ChevronDown size={16} className="text-slate-500"/>}
      </div>

      {isOpen && (
        <div className="p-4 space-y-4">
            {/* Controls */}
            <div className="flex gap-2">
                <input 
                    type="text" 
                    value={reportName}
                    onChange={(e) => setReportName(e.target.value)}
                    placeholder="Nombre del análisis..."
                    className="flex-1 bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-white outline-none focus:border-amber-500"
                />
                <button 
                    onClick={handleSave}
                    disabled={!reportName.trim()}
                    className="bg-amber-600 hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2 rounded transition-colors"
                    title="Guardar Estado Actual"
                >
                    <Save size={18} />
                </button>
            </div>

            <button 
                onClick={handleNew}
                className="w-full flex items-center justify-center gap-2 py-2 border border-dashed border-slate-600 rounded text-slate-400 hover:text-white hover:border-slate-400 text-sm transition-colors"
            >
                <PlusCircle size={16} /> Nuevo Informe en Blanco
            </button>

            {/* List */}
            <div className="space-y-2 max-h-[200px] overflow-y-auto custom-scrollbar">
                {reports.length === 0 ? (
                    <p className="text-center text-xs text-slate-600 py-4 italic">No tienes informes guardados.</p>
                ) : (
                    reports.map(report => (
                        <div 
                            key={report.id}
                            onClick={() => handleLoad(report)}
                            className="group flex items-center justify-between p-3 rounded bg-slate-900/30 border border-slate-700/50 hover:border-amber-500/50 hover:bg-slate-700/30 cursor-pointer transition-all"
                        >
                            <div className="flex items-center gap-3 overflow-hidden">
                                <FileText size={16} className="text-slate-500 group-hover:text-amber-400 flex-shrink-0" />
                                <div className="flex flex-col min-w-0">
                                    <span className="text-sm text-slate-200 font-medium truncate">{report.name}</span>
                                    <span className="text-[10px] text-slate-500">
                                        {new Date(report.timestamp).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                            <button 
                                onClick={(e) => handleDelete(report.id, e)}
                                className="text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-slate-800 rounded"
                                title="Eliminar Informe"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
      )}
    </div>
  );
};

export default ReportLibrary;
