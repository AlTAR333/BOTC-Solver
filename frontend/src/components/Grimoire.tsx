import PlayerNode from './PlayerNode';
import type { Player } from '../types';

interface Props {
  players: Player[];
  onPlayerSelect: (player: Player) => void;
}

export default function Grimoire({ players, onPlayerSelect }: Props) {
  // Math to arrange players in a circle
  const getPlayerPosition = (index: number, total: number) => {
    const angle = (index / total) * (2 * Math.PI) - (Math.PI / 2);
    const radius = 250; // Size of the circle
    const center = 300; 
    return {
      x: center + radius * Math.cos(angle) - 40, // 40 is half the node width
      y: center + radius * Math.sin(angle) - 40,
    };
  };

  return (
    <div className="relative w-[600px] h-[600px] mx-auto bg-slate-900 rounded-full shadow-2xl">
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