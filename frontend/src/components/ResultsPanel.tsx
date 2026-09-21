import { useState } from 'react';
import type { Player } from '../types';
import { ALL_IN_GAME_ROLES } from '../constants';

interface World {
  id: string;
  roles: Record<number, string>;
  evil_team: number[];
}

interface Props {
  worlds: World[];
  players: Player[];
  onClose: () => void;
}

export default function ResultsPanel({ worlds, players, onClose }: Props) {
  const [filterPlayerId, setFilterPlayerId] = useState<number | "">("");
  const [filterRole, setFilterRole] = useState<string>("");

  // Filtering Logic
  const filteredWorlds = worlds.filter(world => {
    if (filterPlayerId && filterRole) {
      return world.roles[Number(filterPlayerId)] === filterRole;
    }
    if (filterPlayerId) {
      // Just check if they are evil (Minion/Demon) or something specific if needed
      // For now, if only player is selected, maybe we just want to see their role in all worlds? 
      // Let's enforce picking a role to filter by "Player X is Role Y"
      return true; 
    }
    return true;
  });

  return (
    <div className="absolute inset-0 bg-[#0b0410]/95 backdrop-blur-xl z-50 p-10 flex flex-col font-sans overflow-y-auto">
      
      {/* Header & Controls */}
      <div className="flex justify-between items-center mb-8 border-b border-[#3a1d5e] pb-4">
        <div>
          <h1 className="text-3xl font-bold text-purple-300 font-serif tracking-widest">POSSIBLE WORLDS</h1>
          <p className="text-purple-400 mt-2">Found {filteredWorlds.length} valid combinations.</p>
        </div>
        <button onClick={onClose} className="px-6 py-2 bg-slate-800 border border-[#3a1d5e] text-purple-200 rounded hover:bg-slate-700">
          Back to Grimoire
        </button>
      </div>

      {/* Filters */}
      <div className="flex space-x-4 mb-8 bg-black/40 p-4 rounded-lg border border-[#3a1d5e]">
        <div className="flex items-center space-x-3">
          <label className="text-purple-300 font-bold">Filter Worlds where:</label>
          <select 
            value={filterPlayerId} onChange={e => setFilterPlayerId(e.target.value === "" ? "" : Number(e.target.value))}
            className="bg-[#11071c] border border-[#3a1d5e] rounded p-2 text-purple-100"
          >
            <option value="">- Any Player -</option>
            {players.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <span className="text-purple-400">is</span>
          <select 
            value={filterRole} onChange={e => setFilterRole(e.target.value)}
            className="bg-[#11071c] border border-[#3a1d5e] rounded p-2 text-purple-100"
          >
            <option value="">- Any Role -</option>
            {ALL_IN_GAME_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        {(filterPlayerId || filterRole) && (
          <button onClick={() => { setFilterPlayerId(""); setFilterRole(""); }} className="text-sm text-red-400 hover:text-red-300 underline">
            Clear Filters
          </button>
        )}
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredWorlds.map(world => (
          <div key={world.id} className="bg-black/60 border border-[#3a1d5e] rounded-lg p-5 shadow-[0_0_20px_rgba(42,18,69,0.5)]">
            <h3 className="text-lg font-bold text-red-500 mb-3 border-b border-red-900/50 pb-2">
              Evil Team: {world.evil_team.map(id => players.find(p => p.id === id)?.name).join(", ")}
            </h3>
            <ul className="space-y-1 mt-3">
              {players.map(p => (
                <li key={p.id} className="flex justify-between text-sm">
                  <span className="text-purple-200">{p.name}:</span>
                  <span className={`font-bold ${world.evil_team.includes(p.id) ? 'text-red-400' : 'text-blue-300'}`}>
                    {world.roles[p.id] || "Unknown"}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}