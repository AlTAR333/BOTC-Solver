import type { Player } from '../types';

interface Props {
  player: Player;
  position: { x: number, y: number };
  onClick: (player: Player) => void;
}

export default function PlayerNode({ player, position, onClick }: Props) {
  return (
    <div 
      className={`absolute w-20 h-20 rounded-full flex items-center justify-center cursor-pointer border-4 ${player.isDead ? 'bg-gray-700 border-red-500' : 'bg-slate-200 border-blue-500'}`}
      style={{ left: position.x, top: position.y }}
      onClick={() => onClick(player)}
    >
      <span className="text-center text-sm font-bold truncate p-1">
        {player.name || `Player ${player.id}`}
      </span>
    </div>
  );
}