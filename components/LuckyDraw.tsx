import React, { useState, useEffect, useCallback } from 'react';
import { Participant } from '../types';
import Confetti from 'react-confetti';
import { Trophy, RefreshCw, Settings, Trash, History } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LuckyDrawProps {
  participants: Participant[];
}

const LuckyDraw: React.FC<LuckyDrawProps> = ({ participants }) => {
  const [winners, setWinners] = useState<Participant[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentDisplay, setCurrentDisplay] = useState("準備抽獎");
  const [allowDuplicates, setAllowDuplicates] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  // Update window size for confetti
  useEffect(() => {
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const availableParticipants = useCallback(() => {
    if (allowDuplicates) return participants;
    const winnerIds = new Set(winners.map(w => w.id));
    return participants.filter(p => !winnerIds.has(p.id));
  }, [participants, winners, allowDuplicates]);

  const handleDraw = () => {
    const pool = availableParticipants();
    if (pool.length === 0) {
      alert("所有人都已中獎，或名單為空！");
      return;
    }

    setIsSpinning(true);
    setShowConfetti(false);
    
    let counter = 0;
    const speed = 50; // Initial speed in ms

    const spinInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * pool.length);
      setCurrentDisplay(pool[randomIndex].name);
      counter++;
    }, speed);

    // Stop logic
    setTimeout(() => {
      clearInterval(spinInterval);
      
      // Final selection (secure random)
      const finalPool = availableParticipants(); // Re-fetch to be safe
      const winnerIndex = Math.floor(Math.random() * finalPool.length);
      const winner = finalPool[winnerIndex];
      
      setCurrentDisplay(winner.name);
      setWinners(prev => [winner, ...prev]);
      setIsSpinning(false);
      setShowConfetti(true);
      
      // Stop confetti after 5 seconds
      setTimeout(() => setShowConfetti(false), 5000);
      
    }, 2500); // 2.5 seconds duration
  };

  const resetWinners = () => {
    if (window.confirm("確定要清除所有中獎名單嗎？")) {
      setWinners([]);
      setCurrentDisplay("準備抽獎");
      setShowConfetti(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {showConfetti && <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={500} />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Draw Area */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center justify-center min-h-[500px] border border-slate-100 relative overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-100 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-100 rounded-full blur-3xl opacity-50"></div>

          <motion.div 
            className="text-center z-10 w-full"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className="mb-12">
               <h3 className="text-xl text-slate-500 font-medium mb-4 uppercase tracking-widest">
                 {isSpinning ? '抽獎進行中...' : '幸運得主'}
               </h3>
               <div className="relative h-48 flex items-center justify-center">
                 <AnimatePresence mode='wait'>
                    <motion.div
                      key={currentDisplay}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      transition={{ duration: 0.1 }}
                      className={`text-6xl md:text-8xl font-black bg-clip-text text-transparent bg-gradient-to-br from-slate-800 to-slate-600 ${!isSpinning && winners.length > 0 ? 'from-indigo-600 to-purple-600 scale-110 transform' : ''}`}
                    >
                      {currentDisplay}
                    </motion.div>
                 </AnimatePresence>
               </div>
            </div>

            <button
              onClick={handleDraw}
              disabled={isSpinning || availableParticipants().length === 0}
              className={`group relative inline-flex items-center justify-center px-12 py-5 text-2xl font-bold text-white transition-all duration-200 rounded-full focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-indigo-500 ${
                isSpinning || availableParticipants().length === 0
                  ? 'bg-slate-300 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg hover:shadow-indigo-500/40 hover:-translate-y-1'
              }`}
            >
              {isSpinning ? (
                <RefreshCw className="animate-spin mr-3" />
              ) : (
                <Trophy className="mr-3 group-hover:rotate-12 transition-transform" />
              )}
              {isSpinning ? '抽出中...' : '開始抽獎'}
            </button>
            
            <p className="mt-4 text-slate-400 text-sm">
              剩餘候選人: {availableParticipants().length} 人
            </p>
          </motion.div>
        </div>

        {/* Sidebar: Settings & History */}
        <div className="space-y-6">
          
          {/* Settings Card */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-slate-100">
            <div className="flex items-center gap-2 mb-4 text-slate-800 font-bold border-b border-slate-100 pb-3">
              <Settings size={20} className="text-slate-500" />
              設定
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600 font-medium">允許重複中獎</span>
              <button 
                onClick={() => setAllowDuplicates(!allowDuplicates)}
                className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${allowDuplicates ? 'bg-indigo-500' : 'bg-slate-300'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-300 ${allowDuplicates ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>

          {/* History Card */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-slate-100 flex flex-col h-[400px]">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-slate-800 font-bold">
                <History size={20} className="text-slate-500" />
                中獎名單
              </div>
              {winners.length > 0 && (
                <button onClick={resetWinners} className="text-red-400 hover:text-red-600 transition-colors" title="清除紀錄">
                  <Trash size={18} />
                </button>
              )}
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
              {winners.length === 0 ? (
                <div className="text-center text-slate-400 py-10">
                  尚未有中獎者
                </div>
              ) : (
                winners.map((winner, idx) => (
                  <motion.div 
                    key={`${winner.id}-${idx}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center p-3 bg-slate-50 rounded-lg border-l-4 border-indigo-500"
                  >
                    <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm mr-3">
                      {winners.length - idx}
                    </span>
                    <span className="font-semibold text-slate-700">{winner.name}</span>
                    <span className="ml-auto text-xs text-slate-400">
                      {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </motion.div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LuckyDraw;