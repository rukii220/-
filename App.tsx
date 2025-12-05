import React, { useState } from 'react';
import { PersonaSettings, GeneratedOption } from './types';
import { DEFAULT_PERSONA } from './constants';
import { generateReplies } from './services/geminiService';
import SettingsModal from './components/SettingsModal';
import ResultCard from './components/ResultCard';
import { Settings2, Send, Sparkles, AlertCircle, Loader2, MessageCircle } from 'lucide-react';

const App: React.FC = () => {
  const [settings, setSettings] = useState<PersonaSettings>(DEFAULT_PERSONA);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [incomingMessage, setIncomingMessage] = useState('');
  const [intent, setIntent] = useState('');
  const [results, setResults] = useState<GeneratedOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!incomingMessage.trim()) return;

    setIsLoading(true);
    setError(null);
    setResults([]); // Clear previous results

    try {
      const options = await generateReplies(settings, incomingMessage, intent);
      setResults(options);
    } catch (err) {
      setError("Failed to generate replies. Please try again or check your API key.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.metaKey) {
      handleGenerate();
    }
  };

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-500/20">
              C
            </div>
            <h1 className="font-bold text-gray-800 text-lg tracking-tight">Chat Copilot</h1>
          </div>
          
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-medium transition-all"
          >
            <Settings2 size={16} />
            <span className="hidden sm:inline">设定人设</span>
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 pt-6 space-y-8">
        
        {/* Context Status Bar */}
        <div 
          onClick={() => setIsSettingsOpen(true)}
          className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md hover:border-emerald-300 cursor-pointer transition-all group"
        >
          <div className="text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">Current Context</div>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 px-3 py-1 rounded-lg border border-emerald-100">
               <span className="font-semibold">我:</span> {settings.myPersona}
            </div>
            <span className="text-gray-300">→</span>
            <div className="flex items-center gap-1.5 bg-blue-50 text-blue-800 px-3 py-1 rounded-lg border border-blue-100">
               <span className="font-semibold">对方:</span> {settings.targetPersona}
            </div>
            <span className="text-gray-300 hidden sm:inline">|</span>
             <div className="flex items-center gap-1.5 bg-rose-50 text-rose-800 px-3 py-1 rounded-lg border border-rose-100 w-full sm:w-auto">
               <span className="font-semibold">关系:</span> {settings.relationship}
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="space-y-4">
          <div className="relative">
            <textarea
              value={incomingMessage}
              onChange={(e) => setIncomingMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="粘贴对方的消息..."
              className="w-full h-32 px-5 py-4 bg-white rounded-2xl border border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none resize-none shadow-sm text-lg placeholder:text-gray-400 transition-all"
            />
             <div className="absolute top-4 right-4 text-gray-300 pointer-events-none">
              <MessageCircle size={20} />
            </div>
          </div>

          <div className="relative">
             <input
              type="text"
              value={intent}
              onChange={(e) => setIntent(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
              placeholder="我的小心思 (可选，例如：我想拖延一下 / 想要委婉拒绝)..."
              className="w-full pl-5 pr-4 py-3 bg-white rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none shadow-sm text-sm text-gray-700 placeholder:text-gray-400 transition-all"
             />
          </div>

          <button
            onClick={handleGenerate}
            disabled={!incomingMessage.trim() || isLoading}
            className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold text-white shadow-lg transition-all transform active:scale-[0.99] ${
              !incomingMessage.trim() || isLoading
                ? 'bg-gray-300 cursor-not-allowed shadow-none'
                : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:shadow-emerald-500/30'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                正在思考高情商回复...
              </>
            ) : (
              <>
                <Sparkles size={20} />
                生成回复
              </>
            )}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
            <AlertCircle size={20} />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        {/* Results */}
        <div className="space-y-4 pb-8">
            {results.map((option, index) => (
                <ResultCard key={index} option={option} index={index} />
            ))}
            
            {results.length > 0 && (
                <div className="text-center pt-8">
                     <p className="text-gray-400 text-xs">AI Generated content. Adjust before sending.</p>
                </div>
            )}
        </div>
      </main>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentSettings={settings}
        onSave={setSettings}
      />
    </div>
  );
};

export default App;