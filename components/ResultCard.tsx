import React, { useState } from 'react';
import { GeneratedOption, ResponseType } from '../types';
import { Copy, Check, MessageCircle, Zap, Coffee } from 'lucide-react';

interface ResultCardProps {
  option: GeneratedOption;
  index: number;
}

const ResultCard: React.FC<ResultCardProps> = ({ option, index }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(option.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStyle = (type: ResponseType) => {
    switch (type) {
      case ResponseType.STANDARD:
        return {
          bg: 'bg-emerald-50',
          border: 'border-emerald-200',
          icon: <MessageCircle className="text-emerald-500" size={18} />,
          titleColor: 'text-emerald-700',
          badge: 'bg-emerald-100 text-emerald-700'
        };
      case ResponseType.INTENSE:
        return {
          bg: 'bg-indigo-50',
          border: 'border-indigo-200',
          icon: <Zap className="text-indigo-500" size={18} />,
          titleColor: 'text-indigo-700',
          badge: 'bg-indigo-100 text-indigo-700'
        };
      case ResponseType.SHORT:
        return {
          bg: 'bg-orange-50',
          border: 'border-orange-200',
          icon: <Coffee className="text-orange-500" size={18} />,
          titleColor: 'text-orange-700',
          badge: 'bg-orange-100 text-orange-700'
        };
      default:
        return {
            bg: 'bg-gray-50',
            border: 'border-gray-200',
            icon: <MessageCircle className="text-gray-500" size={18} />,
            titleColor: 'text-gray-700',
            badge: 'bg-gray-100 text-gray-700'
        };
    }
  };

  const style = getStyle(option.type);

  return (
    <div
        className={`relative group rounded-2xl border ${style.border} ${style.bg} p-5 transition-all duration-500 ease-out hover:shadow-md animate-in slide-in-from-bottom-4 fade-in fill-mode-backwards`}
        style={{ animationDelay: `${index * 150}ms` }}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          {style.icon}
          <span className={`text-sm font-bold ${style.titleColor}`}>
            选项 {index + 1}: {option.label}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="p-2 -mr-2 -mt-2 rounded-full hover:bg-white/50 text-gray-400 hover:text-emerald-600 transition-colors"
          title="复制"
        >
          {copied ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
        </button>
      </div>

      <div className="bg-white/80 rounded-xl p-4 text-gray-800 font-medium text-lg leading-relaxed shadow-sm border border-black/5 selection:bg-emerald-100 selection:text-emerald-900">
        {option.content}
      </div>

      {option.explanation && (
        <div className="mt-3 text-xs text-gray-500 flex items-start gap-1 italic">
           <span className="not-italic">💭</span> 
           <span>{option.explanation}</span>
        </div>
      )}
    </div>
  );
};

export default ResultCard;
