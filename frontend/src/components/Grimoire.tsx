import PlayerNode from './PlayerNode';
import type { Player } from '../types';

interface Props {
  players: Player[];
  onPlayerSelect: (player: Player) => void;
}

export default function Grimoire({ players, onPlayerSelect }: Props) {
  const getPlayerPosition = (index: number, total: number) => {
    const angle = (index / total) * (2 * Math.PI) - (Math.PI / 2);
    const radius = 230; 
    const center = 300; 
    return {
      x: center + radius * Math.cos(angle) - 40,
      y: center + radius * Math.sin(angle) - 40,
    };
  };

  return (
    <div className="relative w-[600px] h-[600px] bg-[#160a26]/40 rounded-full shadow-[0_0_80px_rgba(42,18,69,0.4)] border-4 border-[#3a1d5e] backdrop-blur-md">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[#3a1d5e] font-serif font-bold text-3xl tracking-[0.3em] opacity-40 select-none">
        TOWN SQUARE
      </div>

      {players.map((player, index) => (
        <PlayerNode 
          key={player.id} 
          player={player} 
          position={getPlayerPosition(index, players.length)}
          onClick={onPlayerSelect}
        />
      ))}
    </div>
  );
}