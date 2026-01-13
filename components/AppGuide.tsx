
import React, { useState } from 'react';
import { HelpCircle, X, ChevronRight, ChevronLeft, Play, Database, Sparkles, Download, Layout, Video, MousePointer2 } from 'lucide-react';

const steps = [
  {
    title: "1. Panel de Control",
    desc: "En la columna izquierda gestionas todo el ADN del informe. Puedes cambiar el título, subir el escudo de tu club y elegir plantillas tácticas predefinidas (Ataque, Defensa o Posesión) para ahorrar tiempo.",
    icon: <Layout className="text-blue-400" size={40} />,
    color: "from-blue-500/20 to-transparent",
    action: "Configura tu identidad visual"
  },
  {
    title: "2. Datos del Jugador",
    desc: "Añade nuevos perfiles y personaliza cada detalle: desde su valor de mercado hasta sus minutos jugados. Sube fotos reales, mapas de calor y posiciones tácticas para que el informe luzca profesional.",
    icon: <Database className="text-emerald-400" size={40} />,
    color: "from-emerald-500/20 to-transparent",
    action: "Crea perfiles ilimitados"
  },
  {
    title: "3. El Radar Interactivo",
    desc: "Ajusta las métricas deslizando los valores o escribiéndolos. El gráfico de radar central se actualizará al instante, permitiéndote comparar visualmente las virtudes de hasta 5 jugadores a la vez.",
    icon: <MousePointer2 className="text-indigo-400" size={40} />,
    color: "from-indigo-500/20 to-transparent",
    action: "Visualización en tiempo real"
  },
  {
    title: "4. Inteligencia Artificial",
    desc: "Nuestro motor Gemini IA analiza los datos por ti. Pulsa 'Iniciar Análisis' para obtener informes técnicos detallados y resúmenes ejecutivos que resaltan las fortalezas de cada scouted player.",
    icon: <Sparkles className="text-purple-400" size={40} />,
    color: "from-purple-500/20 to-transparent",
    action: "Análisis técnico automatizado"
  },
  {
    title: "5. Exportación Premium",
    desc: "Cambia a la vista 'Card' para generar fichas coleccionables de nivel élite. Podrás descargarlas en alta resolución para incluirlas en tus presentaciones de scouting o redes sociales.",
    icon: <Download className="text-pink-400" size={40} />,
    color: "from-pink-500/20 to-transparent",
    action: "Descarga en un click"
  }
];

const AppGuide: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 text-emerald-400 hover:text-white text-xs font-black uppercase tracking-widest transition-all bg-emerald-500/10 hover:bg-emerald-500/20 rounded-full border border-emerald-500/30 group shadow-lg shadow-emerald-950/20"
      >
        <Play size={14} className="fill-current group-hover:scale-110 transition-transform" /> 
        Guía Interactiva
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-slate-950/95 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-[40px] shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden relative border-t-emerald-500/50">
        
        {/* Background Accent */}
        <div className={`absolute inset-0 bg-gradient-to-b ${steps[currentStep].color} opacity-30 pointer-events-none transition-all duration-500`}></div>

        <button 
          onClick={() => { setIsOpen(false); setCurrentStep(0); }}
          className="absolute top-6 right-6 p-2 text-slate-500 hover:text-white transition-colors z-10 hover:rotate-90 duration-200"
        >
          <X size={24} />
        </button>

        <div className="p-10 relative z-10">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-900/40">
              <HelpCircle size={28} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tighter text-white">Tour <span className="text-emerald-500">ProScout</span></h2>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em]">Domina la herramienta en 60 segundos</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center min-h-[300px]">
            <div className="flex flex-col items-center justify-center bg-slate-800/50 rounded-[32px] p-10 border border-slate-700/50 shadow-inner relative group">
              <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:scale-110 transition-transform duration-700">
                 <Play size={120} className="text-white" />
              </div>
              <div className="relative transform group-hover:-translate-y-2 transition-transform duration-500">
                {steps[currentStep].icon}
              </div>
              <div className="mt-6 px-4 py-1.5 bg-slate-900 border border-slate-700 rounded-full">
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
                  {steps[currentStep].action}
                </p>
              </div>
            </div>

            <div className="flex flex-col justify-center space-y-4">
              <span className="text-emerald-500 font-black text-sm uppercase tracking-widest">Paso {currentStep + 1} de {steps.length}</span>
              <h3 className="text-3xl font-black text-white leading-tight uppercase tracking-tighter italic">
                {steps[currentStep].title}
              </h3>
              <p className="text-slate-400 text-lg leading-relaxed font-medium">
                {steps[currentStep].desc}
              </p>
            </div>
          </div>

          <div className="mt-12 flex items-center justify-between border-t border-slate-800 pt-8">
            <div className="flex gap-2">
              {steps.map((_, i) => (
                <button 
                  key={i} 
                  onClick={() => setCurrentStep(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${i === currentStep ? 'w-12 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'w-2 bg-slate-700 hover:bg-slate-600'}`} 
                />
              ))}
            </div>
            
            <div className="flex gap-3">
              {currentStep > 0 && (
                <button 
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
                >
                  <ChevronLeft size={20} />
                </button>
              )}
              
              <button 
                onClick={() => {
                  if (currentStep < steps.length - 1) {
                    setCurrentStep(currentStep + 1);
                  } else {
                    setIsOpen(false);
                    setCurrentStep(0);
                  }
                }}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center gap-2 shadow-xl shadow-emerald-900/20 transition-all active:scale-95"
              >
                {currentStep === steps.length - 1 ? "Comenzar ahora" : "Siguiente"}
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppGuide;
