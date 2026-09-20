import { useState } from 'react';
import Grimoire from './components/Grimoire';
import PlayerEditor from './components/PlayerEditor';
import type { Player } from './types';
import Controls from './components/Controls';

// Generate 7 default players
const initialPlayers: Player[] = Array.from({ length: 7 }, (_, i) => ({
  id: i + 1,
  name: `Player ${i + 1}`,
  isDead: false,
  dayDied: null,
  claimedRole: null,
  claims: {},
  constraints: {
    mustBeEvil: false,
    mustBeGood: false,
    hasFalseInfo: false,
  },
}));

export default function App() {
  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);

  // Find the currently selected player object
  const selectedPlayer = players.find(p => p.id === selectedPlayerId) || null;

  // This function updates a specific player in our array
  const handleUpdatePlayer = (updatedPlayer: Player) => {
    setPlayers(players.map(p => p.id === updatedPlayer.id ? updatedPlayer : p));
  };

  const handleRunSolver = () => {
    console.log("Sending to Python...", players);
  };

  return (
    <div className="min-h-screen bg-slate-800 text-white flex">
      {/* Left Side: The Grimoire */}
      <div className="flex-1 p-10 flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-8">BOTC Solver: Trouble Brewing</h1>
        <Grimoire players={players} onPlayerSelect={(p) => setSelectedPlayerId(p.id)} />
        <Controls onRunSolver={handleRunSolver} />
      </div>

      {/* Right Side: The Editor Panel */}
      <div className="w-96 bg-slate-900 border-l border-slate-700 p-6 shadow-xl">
        {selectedPlayer ? (
           <PlayerEditor player={selectedPlayer} updatePlayer={handleUpdatePlayer} />
        ) : (
           <p className="text-slate-400 text-center mt-10">Click a player in the Grimoire to edit their claims.</p>
        )}
      </div>
    </div>
  );
}