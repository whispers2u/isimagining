
import React, { useState } from 'react';
import { AspectRatio, UserConfig } from '../types';
import { refinePrompt } from '../services/geminiService';

interface PromptPanelProps {
  onGenerate: (prompt: string, aspectRatio: AspectRatio) => void;
  isLoading: boolean;
  config: UserConfig;
  setConfig: React.Dispatch<React.SetStateAction<UserConfig>>;
}

const PromptPanel: React.FC<PromptPanelProps> = ({ onGenerate, isLoading, config, setConfig }) => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [isRefining, setIsRefining] = useState(false);

  const ratios: { value: AspectRatio; label: string; icon: string }[] = [
    { value: '1:1', label: 'Carré', icon: 'fa-square' },
    { value: '16:9', label: 'Paysage', icon: 'fa-rectangle-list rotate-90' },
    { value: '9:16', label: 'Portrait', icon: 'fa-rectangle-list' },
    { value: '4:3', label: 'Photo', icon: 'fa-image' },
  ];

  const handleMagicRefine = async () => {
    if (!prompt.trim() || isRefining) return;
    setIsRefining(true);
    const betterPrompt = await refinePrompt(prompt);
    setPrompt(betterPrompt);
    setIsRefining(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;
    onGenerate(prompt, aspectRatio);
  };

  const isN8nMissing = config.useN8n && !config.n8nWebhookUrl;

  return (
    <div className="bg-[#151921] border border-gray-800 rounded-2xl p-6 shadow-2xl relative">
      {/* Switch rapide de moteur */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex bg-[#0b0e14] border border-gray-800 rounded-full p-1 shadow-xl z-20">
        <button 
          onClick={() => setConfig({...config, useN8n: false})}
          className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${!config.useN8n ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:text-gray-300'}`}
        >
          GEMINI
        </button>
        <button 
          onClick={() => setConfig({...config, useN8n: true})}
          className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${config.useN8n ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:text-gray-300'}`}
        >
          N8N
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 pt-2">
        <div className="relative">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-400">Votre vision</label>
            <button
              type="button"
              onClick={handleMagicRefine}
              disabled={isRefining || !prompt.trim()}
              className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              {isRefining ? <i className="fas fa-circle-notch fa-spin"></i> : <i className="fas fa-sparkles"></i>}
              MAGIE IA
            </button>
          </div>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ex: Un chien qui mange de la banane..."
            className="w-full h-32 bg-[#0b0e14] border border-gray-800 rounded-xl p-4 text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-3">Format d'exportation</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {ratios.map((ratio) => (
              <button
                key={ratio.value}
                type="button"
                onClick={() => setAspectRatio(ratio.value)}
                className={`flex flex-col items-center justify-center py-3 px-2 rounded-xl border transition-all ${
                  aspectRatio === ratio.value
                    ? 'bg-indigo-600/10 border-indigo-600 text-indigo-400'
                    : 'bg-[#0b0e14] border-gray-800 text-gray-500 hover:border-gray-700'
                }`}
              >
                <i className={`fas ${ratio.icon} mb-1 text-sm`}></i>
                <span className="text-xs font-medium">{ratio.label}</span>
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !prompt.trim()}
          className={`w-full py-4 rounded-xl font-bold flex flex-col items-center justify-center transition-all ${
            isLoading || !prompt.trim()
              ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_20px_rgba(79,70,229,0.3)] active:scale-[0.98]'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <i className="fas fa-circle-notch fa-spin"></i>
              <span>Workflow en cours...</span>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <i className="fas fa-rocket"></i>
                <span>Lancer la génération</span>
              </div>
              <span className="text-[10px] opacity-70 font-normal">
                Propulsé par {config.useN8n ? 'n8n Workflow' : 'Gemini Engine'}
              </span>
            </>
          )}
        </button>

        {isN8nMissing && (
          <button
            type="button"
            onClick={() => onGenerate(prompt, aspectRatio)}
            className="w-full text-center text-xs text-red-400 bg-red-400/10 p-3 rounded-xl border border-red-400/20 hover:bg-red-400/20 transition-all cursor-pointer group"
          >
            <i className="fas fa-exclamation-triangle mr-2 group-hover:scale-110 transition-transform"></i> 
            URL n8n manquante. <b>Cliquez ici pour configurer</b>
          </button>
        )}
      </form>
    </div>
  );
};

export default PromptPanel;
