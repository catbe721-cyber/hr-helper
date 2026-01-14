import React, { useState, useRef } from 'react';
import Papa from 'papaparse';
import { Upload, FileText, Users, Trash2, Plus } from 'lucide-react';
import { Participant } from '../types';

interface DataInputProps {
  participants: Participant[];
  setParticipants: React.Dispatch<React.SetStateAction<Participant[]>>;
  onNext: () => void;
}

const DataInput: React.FC<DataInputProps> = ({ participants, setParticipants, onNext }) => {
  const [inputText, setInputText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      complete: (results) => {
        const newParticipants: Participant[] = [];
        results.data.forEach((row: any) => {
          // Assume the first column is the name, or try to find a column named "name"
          let name = '';
          if (Array.isArray(row)) {
            name = row[0];
          } else if (typeof row === 'object' && row !== null) {
            name = row.name || row['姓名'] || Object.values(row)[0];
          }

          if (name && typeof name === 'string' && name.trim() !== '') {
            newParticipants.push({
              id: crypto.randomUUID(),
              name: name.trim()
            });
          }
        });
        setParticipants(prev => [...prev, ...newParticipants]);
      },
      header: false // Auto-detect usually works better for simple lists, set true if specific column names needed
    });
    
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleManualAdd = () => {
    if (!inputText.trim()) return;
    
    const lines = inputText.split(/\n/);
    const newParticipants: Participant[] = lines
      .map(line => line.trim())
      .filter(line => line !== '')
      .map(name => ({
        id: crypto.randomUUID(),
        name
      }));

    setParticipants(prev => [...prev, ...newParticipants]);
    setInputText('');
  };

  const handleClear = () => {
    if (window.confirm('確定要清空所有名單嗎？')) {
      setParticipants([]);
    }
  };

  const removeParticipant = (id: string) => {
    setParticipants(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-800 mb-2">名單管理</h2>
          <p className="text-slate-500">請匯入 CSV 或手動貼上參加者姓名</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <div className="bg-slate-50 p-6 rounded-xl border-2 border-dashed border-slate-300 hover:border-indigo-400 transition-colors cursor-pointer text-center group" onClick={() => fileInputRef.current?.click()}>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                accept=".csv,.txt" 
                className="hidden" 
              />
              <Upload className="w-12 h-12 text-slate-400 group-hover:text-indigo-500 mx-auto mb-3 transition-colors" />
              <p className="font-medium text-slate-700">點擊上傳 CSV / TXT</p>
              <p className="text-xs text-slate-500 mt-1">支援每行一個名字的格式</p>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700">手動輸入 (一行一個)</label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full h-32 p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none transition-all"
                placeholder="王小明&#10;李大同&#10;張三"
              />
              <button
                onClick={handleManualAdd}
                className="w-full py-2.5 bg-white border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 flex items-center justify-center gap-2 transition-colors"
              >
                <Plus size={18} />
                加入名單
              </button>
            </div>
          </div>

          {/* List Section */}
          <div className="bg-slate-50 rounded-xl p-6 flex flex-col h-[500px]">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Users className="text-indigo-600" size={20} />
                <h3 className="font-bold text-slate-800">目前名單 ({participants.length} 人)</h3>
              </div>
              {participants.length > 0 && (
                <button 
                  onClick={handleClear}
                  className="text-xs text-red-500 hover:text-red-700 font-medium flex items-center gap-1 px-2 py-1 hover:bg-red-50 rounded"
                >
                  <Trash2 size={14} /> 清空
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
              {participants.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400">
                  <FileText size={48} className="mb-3 opacity-20" />
                  <p>尚無資料</p>
                </div>
              ) : (
                participants.map((p, idx) => (
                  <div key={p.id} className="bg-white p-3 rounded-lg shadow-sm flex justify-between items-center border border-slate-100 group hover:border-indigo-200 transition-all">
                    <span className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 text-xs flex items-center justify-center font-mono">
                        {idx + 1}
                      </span>
                      <span className="font-medium text-slate-700">{p.name}</span>
                    </span>
                    <button 
                      onClick={() => removeParticipant(p.id)}
                      className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
           {/* Only show next if there are people */}
           <button
             onClick={onNext}
             disabled={participants.length === 0}
             className={`px-8 py-3 rounded-xl font-bold text-lg shadow-lg transition-all transform hover:-translate-y-1 ${
               participants.length === 0 
                 ? 'bg-slate-300 text-white cursor-not-allowed' 
                 : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-indigo-500/30'
             }`}
           >
             開始使用功能 &rarr;
           </button>
        </div>
      </div>
    </div>
  );
};

export default DataInput;
