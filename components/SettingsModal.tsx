import React, { useState } from 'react';
import { PersonaSettings } from '../types';
import { X, User, Users, HeartHandshake, Save } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSettings: PersonaSettings;
  onSave: (settings: PersonaSettings) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, currentSettings, onSave }) => {
  const [formData, setFormData] = useState<PersonaSettings>(currentSettings);

  if (!isOpen) return null;

  const handleChange = (key: keyof PersonaSettings, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl transform transition-all scale-100">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <span className="text-2xl">🎭</span> 设定当前人设
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* My Persona */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-600 flex items-center gap-2">
              <User size={16} className="text-emerald-500" /> 我的人设
            </label>
            <input
              type="text"
              value={formData.myPersona}
              onChange={(e) => handleChange('myPersona', e.target.value)}
              placeholder="例如：高冷总监、卑微乙方..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
            />
          </div>

          {/* Target Persona */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-600 flex items-center gap-2">
              <Users size={16} className="text-blue-500" /> 对方是谁
            </label>
            <input
              type="text"
              value={formData.targetPersona}
              onChange={(e) => handleChange('targetPersona', e.target.value)}
              placeholder="例如：经常改需求的老板..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            />
          </div>

          {/* Relationship */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-600 flex items-center gap-2">
              <HeartHandshake size={16} className="text-rose-500" /> 双方关系
            </label>
            <input
              type="text"
              value={formData.relationship}
              onChange={(e) => handleChange('relationship', e.target.value)}
              placeholder="例如：紧张、亲密、陌生..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 outline-none transition-all"
            />
          </div>
        </div>

        <div className="p-6 pt-2">
          <button
            onClick={handleSave}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold py-3.5 rounded-xl hover:shadow-lg hover:shadow-emerald-500/30 active:scale-[0.98] transition-all"
          >
            <Save size={20} />
            保存设定
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
