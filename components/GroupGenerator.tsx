import React, { useState } from 'react';
import { Participant, Group } from '../types';
import { Users, Shuffle, Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface GroupGeneratorProps {
  participants: Participant[];
}

const GroupGenerator: React.FC<GroupGeneratorProps> = ({ participants }) => {
  const [groupSize, setGroupSize] = useState<number>(4);
  const [groups, setGroups] = useState<Group[]>([]);
  const [isGenerated, setIsGenerated] = useState(false);
  const [copiedGroup, setCopiedGroup] = useState<string | null>(null);

  const generateGroups = () => {
    if (participants.length === 0) return;

    // Fisher-Yates Shuffle
    const shuffled = [...participants];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    const newGroups: Group[] = [];
    const numberOfGroups = Math.ceil(shuffled.length / groupSize);

    for (let i = 0; i < numberOfGroups; i++) {
      const start = i * groupSize;
      const end = start + groupSize;
      const members = shuffled.slice(start, end);
      
      newGroups.push({
        id: `group-${i + 1}`,
        name: `第 ${i + 1} 組`,
        members
      });
    }

    setGroups(newGroups);
    setIsGenerated(true);
  };

  const copyGroupToClipboard = (group: Group) => {
    const text = `${group.name}\n${group.members.map(m => m.name).join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopiedGroup(group.id);
    setTimeout(() => setCopiedGroup(null), 2000);
  };

  const copyAll = () => {
    const text = groups.map(g => `${g.name}:\n${g.members.map(m => m.name).join(', ')}`).join('\n\n');
    navigator.clipboard.writeText(text);
    setCopiedGroup('all');
    setTimeout(() => setCopiedGroup(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100 mb-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Users className="text-indigo-600" />
              自動分組
            </h2>
            <p className="text-slate-500 mt-1">
              總人數: <span className="font-bold text-indigo-600">{participants.length}</span> 人
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl">
            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-500 uppercase mb-1">每組人數</label>
              <input
                type="number"
                min="2"
                max={participants.length || 100}
                value={groupSize}
                onChange={(e) => setGroupSize(parseInt(e.target.value) || 2)}
                className="w-24 p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none text-center font-bold text-lg"
              />
            </div>
            
            <button
              onClick={generateGroups}
              disabled={participants.length < 2}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-lg shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Shuffle size={20} />
              立即分組
            </button>
          </div>
        </div>
      </div>

      {/* Results Display */}
      {isGenerated && groups.length > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="flex justify-between items-center px-2">
            <h3 className="text-xl font-bold text-slate-700">分組結果 ({groups.length} 組)</h3>
            <button 
              onClick={copyAll}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1 bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors"
            >
              {copiedGroup === 'all' ? <Check size={16} /> : <Copy size={16} />}
              複製全部分組
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {groups.map((group, index) => (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-slate-200 overflow-hidden flex flex-col"
              >
                <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex justify-between items-center">
                  <h4 className="font-bold text-slate-700">{group.name}</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                      {group.members.length} 人
                    </span>
                    <button
                      onClick={() => copyGroupToClipboard(group)}
                      className="text-slate-400 hover:text-indigo-600 transition-colors"
                      title="複製此組"
                    >
                      {copiedGroup === group.id ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>
                <div className="p-4 flex-1">
                  <ul className="space-y-2">
                    {group.members.map(member => (
                      <li key={member.id} className="flex items-center gap-2 text-slate-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
                        {member.name}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State hint */}
      {!isGenerated && participants.length > 0 && (
        <div className="text-center py-20 text-slate-400 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
          <Shuffle size={48} className="mx-auto mb-4 opacity-20" />
          <p>設定每組人數並點擊「立即分組」</p>
        </div>
      )}
    </div>
  );
};

export default GroupGenerator;
