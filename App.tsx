import React, { useState } from 'react';
import Navbar from './components/Navbar';
import DataInput from './components/DataInput';
import LuckyDraw from './components/LuckyDraw';
import GroupGenerator from './components/GroupGenerator';
import { Participant, AppView } from './types';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [currentView, setCurrentView] = useState<AppView>(AppView.INPUT);
  const [participants, setParticipants] = useState<Participant[]>([]);

  const renderContent = () => {
    switch (currentView) {
      case AppView.INPUT:
        return (
          <DataInput 
            participants={participants} 
            setParticipants={setParticipants} 
            onNext={() => setCurrentView(AppView.LUCKY_DRAW)}
          />
        );
      case AppView.LUCKY_DRAW:
        return <LuckyDraw participants={participants} />;
      case AppView.GROUPING:
        return <GroupGenerator participants={participants} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Navbar 
        currentView={currentView} 
        setView={setCurrentView} 
        participantCount={participants.length}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode='wait'>
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
