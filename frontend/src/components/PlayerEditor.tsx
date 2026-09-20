import type { Player } from '../types';

interface Props {
  player: Player;
  updatePlayer: (player: Player) => void;
}

export default function PlayerEditor({ player, updatePlayer }: Props) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-6 text-blue-400">Editing: {player.name}</h2>
      
      <div className="space-y-4">
        {/* Name Input */}
        <div>
          <label className="block text-sm font-medium mb-1 text-slate-300">Player Name</label>
          <input 
            type="text" 
            value={player.name}
            onChange={(e) => updatePlayer({ ...player, name: e.target.value })}
            className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-white focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Dead Toggle Placeholder */}
        <div className="flex items-center space-x-3 pt-2">
          <input 
            type="checkbox" 
            id="isDead"
            checked={player.isDead}
            onChange={(e) => updatePlayer({ ...player, isDead: e.target.checked })}
            className="w-4 h-4 cursor-pointer"
          />
          <label htmlFor="isDead" className="cursor-pointer text-slate-300">Player is Dead</label>
        </div>
        
      </div>
    </div>
  );
}