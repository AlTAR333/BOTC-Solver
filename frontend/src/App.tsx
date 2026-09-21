import { useState } from 'react';
import Grimoire from './components/Grimoire';
import PlayerEditor from './components/PlayerEditor';
import Controls from './components/Controls';
import ResultsPanel from './components/ResultsPanel';
import type { Player } from './types';

// Plain helper function to generate 15 default players (NO hooks here)
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
  // ALL hooks MUST be inside the App() function component body:
  const [allPlayers, setAllPlayers] = useState<Player[]>(generateInitialPlayers());
  const [playerCount, setPlayerCount] = useState<number>(7);
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);
  
  const [globalPhase, setGlobalPhase] = useState<'Day'|'Night'>('Day');
  const [globalDay, setGlobalDay] = useState<number>(1);

  const [results, setResults] = useState<any[] | null>(null);
  const [isSolving, setIsSolving] = useState<boolean>(false);

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
      setResults(null);
    }
  };

  const handleRunSolver = async () => {
    setIsSolving(true);
    try {
      const response = await fetch("http://localhost:8000/solve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          globalTime: { phase: globalPhase, day: globalDay },
          players: activePlayers
        })
      });
      const data = await response.json();
      setResults(data.possible_worlds);
    } catch (error) {
      console.error("Failed to solve:", error);
      alert("Make sure your Python server is running on port 8000!");
    } finally {
      setIsSolving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0410] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#2a1245] via-[#0b0410] to-black text-slate-200 flex font-sans relative">
      
      {/* RESULTS OVERLAY */}
      {results && (
        <ResultsPanel 
          worlds={results} 
          players={activePlayers} 
          onClose={() => setResults(null)} 
        />
      )}

      {/* Main Grimoire Screen */}
      <div className="flex-1 p-10 flex flex-col items-center">
        
        {/* Game Header Controls */}
        <div className="w-full max-w-2xl flex justify-between bg-[#160a26]/80 backdrop-blur-md p-4 rounded-xl shadow-2xl border border-[#3a1d5e] mb-8">
          <div className="flex flex-col">
            <label className="text-sm text-purple-300 font-bold mb-1">Player Count: {playerCount}</label>
            <input 
              type="range" min="5" max="15" value={playerCount}
              onChange={(e) => setPlayerCount(parseInt(e.target.value))}
              className="w-48 cursor-pointer accent-purple-500"
            />
          </div>
          
          <div className="flex space-x-4 items-center">
            <label className="text-sm text-purple-300 font-bold">Current Time:</label>
            <select value={globalPhase} onChange={(e) => setGlobalPhase(e.target.value as 'Day'|'Night')} className="bg-black/50 border border-[#3a1d5e] rounded p-1 text-purple-200 focus:outline-none focus:border-purple-400">
              <option value="Night">Night</option>
              <option value="Day">Day</option>
            </select>
            <select value={globalDay} onChange={(e) => setGlobalDay(parseInt(e.target.value))} className="bg-black/50 border border-[#3a1d5e] rounded p-1 text-purple-200 focus:outline-none focus:border-purple-400">
              {[1,2,3,4,5,6,7,8,9,10].map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>

        <Grimoire players={activePlayers} onPlayerSelect={(p) => setSelectedPlayerId(p.id)} />
        <Controls onRunSolver={handleRunSolver} onReset={handleReset} />
        {isSolving && <p className="text-purple-400 mt-2 animate-pulse">Contacting Python solver...</p>}
      </div>

      {/* Sidebar Panel */}
      <div className="w-[450px] bg-[#11071c]/95 border-l border-[#3a1d5e] p-6 shadow-2xl overflow-y-auto backdrop-blur-xl">
        {selectedPlayer ? (
           <PlayerEditor 
              player={selectedPlayer} 
              updatePlayer={handleUpdatePlayer} 
              activePlayers={activePlayers}
              globalDay={globalDay}
           />
        ) : (
           <div className="h-full flex flex-col items-center justify-center opacity-50">
             <div className="w-24 h-24 rounded-full border-4 border-dashed border-[#3a1d5e] mb-4"></div>
             <p className="text-purple-300 text-center font-bold">Select a player from the<br/>Grimoire to edit claims.</p>
           </div>
        )}
      </div>
    </div>
  );
}