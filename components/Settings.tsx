
import React from 'react';
import { UserConfig } from '../types';

interface SettingsProps {
  config: UserConfig;
  setConfig: React.Dispatch<React.SetStateAction<UserConfig>>;
}

const Settings: React.FC<SettingsProps> = ({ config, setConfig }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn pb-20">
      <header>
        <h2 className="text-3xl font-bold mb-2">Configuration SaaS Backend</h2>
        <p className="text-gray-400">Liez votre interface à votre workflow n8n personnalisé.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-[#151921] border border-gray-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-semibold text-lg">Statut du Connecteur</h3>
                <p className="text-xs text-gray-400">Activez n8n pour passer en mode production.</p>
              </div>
              <button
                onClick={() => setConfig(prev => ({ ...prev, useN8n: !prev.useN8n }))}
                className={`w-14 h-7 rounded-full transition-colors relative ${
                  config.useN8n ? 'bg-indigo-600' : 'bg-gray-700'
                }`}
              >
                <div className={`absolute top-1 left-1 bg-white w-5 h-5 rounded-full transition-transform ${
                  config.useN8n ? 'translate-x-7' : 'translate-x-0'
                }`} />
              </button>
            </div>

            <div className={`space-y-4 ${!config.useN8n && 'opacity-40 grayscale pointer-events-none'}`}>
              <label className="block text-sm font-medium text-gray-400">URL du Webhook Production (n8n)</label>
              <div className="relative">
                <i className="fas fa-link absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"></i>
                <input
                  type="text"
                  value={config.n8nWebhookUrl}
                  onChange={(e) => setConfig(prev => ({ ...prev, n8nWebhookUrl: e.target.value }))}
                  placeholder="https://votre-n8n.com/webhook/generate-image"
                  className="w-full bg-[#0b0e14] border border-gray-800 rounded-xl pl-11 pr-4 py-4 text-sm focus:ring-2 focus:ring-indigo-600 outline-none transition-all"
                />
              </div>
              <p className="text-[10px] text-gray-500 italic">
                Note: Assurez-vous d'utiliser l'URL de <b>Production</b> pour éviter les erreurs de timeout.
              </p>
            </div>
          </section>

          <section className="bg-[#151921] border border-gray-800 rounded-2xl p-6 shadow-xl">
            <h3 className="font-semibold mb-6 flex items-center gap-2">
              <i className="fas fa-check-double text-green-400"></i>
              Validation de votre Workflow n8n
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-green-500/5 border border-green-500/10 rounded-xl">
                <p className="text-xs font-bold text-green-400 uppercase mb-2">Structure détectée :</p>
                <ul className="text-sm space-y-3 text-gray-300">
                  <li className="flex gap-3">
                    <i className="fas fa-arrow-right mt-1 text-gray-600"></i>
                    <span><b>Format de réponse :</b> L'app attend <code className="bg-black/40 px-1 rounded text-indigo-300">data.result_url</code></span>
                  </li>
                  <li className="flex gap-3">
                    <i className="fas fa-check text-green-500 mt-1"></i>
                    <span><b>Détection Automatique :</b> L'app scanne aussi <code className="bg-black/40 px-1 rounded text-gray-400">imageUrl</code> par sécurité.</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
              <i className="fas fa-info-circle text-xl"></i>
            </div>
            <h3 className="font-bold text-lg mb-2">Note sur l'affichage</h3>
            <p className="text-sm opacity-90 leading-relaxed">
              Une fois que n8n renvoie l'URL, l'interface l'affiche directement. Si l'image ne s'affiche pas, vérifiez que l'URL S3 est accessible publiquement sans authentification supplémentaire.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
