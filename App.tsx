
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import PromptPanel from './components/PromptPanel';
import Settings from './components/Settings';
import { generateImageWithGemini } from './services/geminiService';
import { generateImageWithN8n } from './services/n8nService';
import { GeneratedImage, UserConfig, AspectRatio } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('studio');
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<GeneratedImage[]>([]);
  const [lastImage, setLastImage] = useState<GeneratedImage | null>(null);
  const [loadingStep, setLoadingStep] = useState('');
  const [config, setConfig] = useState<UserConfig>(() => {
    const savedConfig = localStorage.getItem('imagine_config');
    if (savedConfig) {
      const parsed = JSON.parse(savedConfig);
      if (!parsed.n8nWebhookUrl) parsed.n8nWebhookUrl = 'https://automation.autec.online/webhook/generate-image';
      return parsed;
    }
    return {
      n8nWebhookUrl: 'https://automation.autec.online/webhook/generate-image',
      useN8n: true,
    };
  });

  useEffect(() => {
    const savedHistory = localStorage.getItem('imagine_history');
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  useEffect(() => {
    localStorage.setItem('imagine_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('imagine_config', JSON.stringify(config));
  }, [config]);

  const handleGenerate = async (prompt: string, aspectRatio: AspectRatio) => {
    if (config.useN8n && !config.n8nWebhookUrl) {
      alert("Veuillez configurer l'URL du Webhook dans les paramètres.");
      setActiveTab('settings');
      return;
    }

    setIsLoading(true);
    setLoadingStep('Préparation de la toile numérique...');
    
    let stepIndex = 0;
    const steps = [
      'Interprétation de votre vision...',
      'L\'IA commence à rêver...',
      'Assemblage des fragments de lumière...',
      'Sculpture des pixels artistiques...',
      'Infusion des détails profonds...',
      'Peinture des textures finales...',
      'Finalisation de votre chef-d\'œuvre...'
    ];

    const progressInterval = setInterval(() => {
      setLoadingStep(steps[stepIndex % steps.length]);
      stepIndex++;
    }, 3500);

    try {
      let imageUrl = '';
      const provider = config.useN8n ? 'n8n' : 'gemini';

      if (config.useN8n) {
        imageUrl = await generateImageWithN8n(config.n8nWebhookUrl, prompt, aspectRatio);
      } else {
        imageUrl = await generateImageWithGemini(prompt, aspectRatio);
      }

      if (!imageUrl) {
        throw new Error("La création n'a pas pu être récupérée.");
      }

      const newImage: GeneratedImage = {
        id: Math.random().toString(36).substr(2, 9),
        url: imageUrl,
        prompt,
        timestamp: Date.now(),
        provider,
        settings: { aspectRatio },
      };

      setLastImage(newImage);
      setHistory((prev) => [newImage, ...prev]);
    } catch (error: any) {
      console.error("💥 Erreur génération:", error);
      alert(`Oups ! Quelque chose a freiné la création : ${error.message}`);
    } finally {
      setIsLoading(false);
      clearInterval(progressInterval);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'studio':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
            <div className="lg:col-span-5 flex flex-col gap-6">
              <header className="mb-2">
                <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-1">
                  <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
                  {config.useN8n ? 'Creative Pipeline' : 'Gemini Engine'}
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight">Studio Créatif</h1>
                <p className="text-gray-400 mt-1">Donnez vie à vos idées les plus folles.</p>
              </header>
              <PromptPanel 
                onGenerate={handleGenerate} 
                isLoading={isLoading} 
                config={config} 
                setConfig={setConfig} 
              />
              
              <div className="mt-auto hidden lg:block">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-4">Dernières pépites</h3>
                <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
                  {history.slice(0, 5).map(img => (
                    <div key={img.id} onClick={() => setLastImage(img)} className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-gray-800 hover:border-indigo-500 transition-all cursor-pointer bg-gray-900 group shadow-lg">
                      <img src={img.url} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 flex flex-col h-full min-h-[550px]">
              <div className="flex-1 bg-[#151921] border border-gray-800 rounded-[2.5rem] overflow-hidden relative group shadow-2xl flex items-center justify-center transition-all">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center text-center p-12 w-full h-full bg-[#0d1016]/50 backdrop-blur-sm">
                    {/* Loader Artistique */}
                    <div className="relative w-32 h-32 mb-10">
                      <div className="absolute inset-0 bg-indigo-600/20 blur-3xl rounded-full animate-pulse"></div>
                      <div className="absolute inset-0 border-4 border-transparent border-t-indigo-500 rounded-full animate-spin"></div>
                      <div className="absolute inset-4 border-4 border-transparent border-b-indigo-400 rounded-full animate-[spin_3s_linear_infinite]"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                         <i className="fas fa-magic text-indigo-400 text-3xl animate-pulse"></i>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-2xl font-bold text-white tracking-tight animate-pulse">L'art prend forme...</h3>
                      <div className="px-6 py-2.5 bg-gradient-to-r from-indigo-500/10 via-indigo-500/20 to-indigo-500/10 rounded-full border border-indigo-500/20">
                        <p className="text-indigo-300 font-medium text-sm tracking-wide italic">{loadingStep}</p>
                      </div>
                    </div>

                    <div className="mt-12 flex gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce"></div>
                    </div>
                  </div>
                ) : lastImage ? (
                  <div className="relative w-full h-full p-4 flex items-center justify-center bg-[#0d1016]">
                    <img 
                      key={lastImage.id}
                      src={lastImage.url} 
                      alt={lastImage.prompt} 
                      className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl transition-all duration-700 animate-fadeIn" 
                    />
                    <div className="absolute bottom-8 right-8 flex gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                       <a href={lastImage.url} target="_blank" rel="noreferrer" className="bg-white/10 hover:bg-indigo-600 p-4 rounded-2xl text-white backdrop-blur-xl border border-white/10 transition-all flex items-center gap-3 text-xs font-bold shadow-2xl">
                         <i className="fas fa-expand-alt"></i>
                         AGRANDIR
                       </a>
                    </div>
                    <div className="absolute top-8 left-8 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/5 text-[10px] font-medium text-gray-400">
                      {lastImage.settings.aspectRatio} • {lastImage.provider.toUpperCase()}
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-8">
                    <div className="w-20 h-20 bg-indigo-600/5 border border-indigo-600/10 rounded-3xl flex items-center justify-center mb-8 mx-auto group-hover:scale-110 transition-transform duration-500">
                      <i className="fas fa-wand-magic-sparkles text-indigo-500/40 text-3xl"></i>
                    </div>
                    <h2 className="text-xl font-bold text-gray-300 tracking-tight">VOTRE TOILE EST VIERGE</h2>
                    <p className="text-gray-500 mt-3 text-sm max-w-xs mx-auto leading-relaxed">
                      Décrivez votre vision dans le panneau de gauche et laissez l'intelligence artificielle faire le reste.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'gallery':
        return (
          <div className="space-y-8 animate-fadeIn pb-10">
            <header className="flex justify-between items-end">
              <div>
                <h2 className="text-3xl font-bold mb-2">Galerie Personnelle</h2>
                <p className="text-gray-400">Le sanctuaire de vos créations passées.</p>
              </div>
              <button 
                onClick={() => {if(confirm('Effacer tous vos chefs-d\'œuvre ?')) setHistory([])}}
                className="text-xs text-gray-500 hover:text-red-400 transition-colors flex items-center gap-2 bg-gray-800/30 px-4 py-2 rounded-xl border border-white/5"
              >
                <i className="fas fa-trash-alt"></i>
                Nettoyer le studio
              </button>
            </header>
            {history.length === 0 ? (
              <div className="py-32 flex flex-col items-center justify-center border-2 border-dashed border-gray-800 rounded-[2.5rem]">
                <i className="fas fa-images text-gray-800 text-5xl mb-6"></i>
                <p className="text-gray-600 font-medium">Aucune création à l'horizon.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {history.map((img) => (
                  <div key={img.id} onClick={() => { setLastImage(img); setActiveTab('studio'); }} className="group relative aspect-square rounded-[1.5rem] overflow-hidden bg-gray-900 border border-gray-800 hover:border-indigo-500 transition-all shadow-lg cursor-pointer">
                    <img src={img.url} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all p-4 flex flex-col justify-end">
                      <p className="text-[10px] text-white/60 line-clamp-2 italic mb-2">"{img.prompt}"</p>
                      <span className="text-[9px] font-bold text-indigo-400 tracking-widest uppercase">Restaurer</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'settings':
        return <Settings config={config} setConfig={setConfig} />;

      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#0b0e14]">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 overflow-y-auto p-4 md:p-10 relative">
        <div className="max-w-7xl mx-auto h-full relative z-10">
          {renderContent()}
        </div>
        {/* Décoration d'arrière-plan */}
        <div className="fixed top-[-10%] right-[-5%] w-[40%] h-[40%] bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="fixed bottom-[-5%] left-[-5%] w-[30%] h-[30%] bg-indigo-900/5 blur-[100px] rounded-full pointer-events-none"></div>
      </main>
    </div>
  );
};

export default App;
