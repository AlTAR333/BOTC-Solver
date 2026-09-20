import { useState } from 'react';
import Grimoire from './components/Grimoire';
import PlayerEditor from './components/PlayerEditor';
import Controls from './components/Controls';
import type { Player } from './types';

// Function to generate fresh players
const generateInitialPlayers = (): Player[] => 
  Array.from({ length: 15 }, (_, i) => ({
    id: i + 1,
    name: `Player ${i + 1}`,
    isDead: false,
    deathPhase: null,
    deathCause: null,
    deathDay: null,
    claimedRole: null,
    claims: {},
    constraints: { mustBeEvil: false, mustBeGood: false, hasFalseInfo: false },
  }));

export default function App() {
  const [allPlayers, setAllPlayers] = useState<Player[]>(generateInitialPlayers());
  const [playerCount, setPlayerCount] = useState<number>(7);
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);
  
  const [globalPhase, setGlobalPhase] = useState<'Day'|'Night'>('Day');
  const [globalDay, setGlobalDay] = useState<number>(1);

  const activePlayers = allPlayers.slice(0, playerCount);
  const selectedPlayer = activePlayers.find(p => p.id === selectedPlayerId) || null;

  const handleUpdatePlayer = (updatedPlayer: Player) => {
    setAllPlayers(allPlayers.map(p => p.id === updatedPlayer.id ? updatedPlayer : p));
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to reset the entire grimoire?")) {
      setAllPlayers(generateInitialPlayers());
      setGlobalPhase('Day');
      setGlobalDay(1);
      setSelectedPlayerId(null);
    }
  };

  const handleRunSolver = () => {
    console.log("Sending to Python...", {
      globalTime: { phase: globalPhase, day: globalDay },
      players: activePlayers
    });
  };

  return (
    <div className="min-h-screen bg-slate-800 text-white flex">
      <div className="flex-1 p-10 flex flex-col items-center">
        <div className="w-full max-w-2xl flex justify-between bg-slate-900 p-4 rounded-lg shadow-lg border border-slate-700 mb-8">
          <div className="flex flex-col">
            <label className="text-sm text-slate-400 font-bold mb-1">Player Count: {playerCount}</label>
            <input 
              type="range" min="5" max="15" value={playerCount}
              onChange={(e) => setPlayerCount(parseInt(e.target.value))}
              className="w-48 cursor-pointer"
            />
          </div>
          
          <div className="flex space-x-4 items-center">
            <label className="text-sm text-slate-400 font-bold">Current Time:</label>
            <select value={globalPhase} onChange={(e) => setGlobalPhase(e.target.value as 'Day'|'Night')} className="bg-slate-800 border border-slate-600 rounded p-1">
              <option value="Night">Night</option>
              <option value="Day">Day</option>
            </select>
            <select value={globalDay} onChange={(e) => setGlobalDay(parseInt(e.target.value))} className="bg-slate-800 border border-slate-600 rounded p-1">
              {[1,2,3,4,5,6,7,8,9,10].map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>

        <Grimoire players={activePlayers} onPlayerSelect={(p) => setSelectedPlayerId(p.id)} />
        <Controls onRunSolver={handleRunSolver} onReset={handleReset} />
      </div>

      <div className="w-[450px] bg-slate-900 border-l border-slate-700 p-6 shadow-xl overflow-y-auto">
        {selectedPlayer ? (
           <PlayerEditor 
              player={selectedPlayer} 
              updatePlayer={handleUpdatePlayer} 
              activePlayers={activePlayers}
              globalDay={globalDay}
           />
        ) : (
           <p className="text-slate-400 text-center mt-10">Click a player in the Grimoire to edit their claims.</p>
        )}
      </div>
    </div>
  );
}