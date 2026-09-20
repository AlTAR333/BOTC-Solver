import type { Player } from '../types';

interface Props {
  player: Player;
  position: { x: number, y: number };
  onClick: (player: Player) => void;
}

export default function PlayerNode({ player, position, onClick }: Props) {
  
  const tokenImgSrc = player.claimedRole 
    ? `/tokens/${player.claimedRole.toLowerCase().replace(/\s+/g, '-')}.png` 
    : '';

  return (
    <div 
      className={`absolute w-20 h-20 rounded-full flex items-center justify-center cursor-pointer transition-all hover:scale-110 z-10
        ${player.isDead ? 'border-[3px] border-red-900 bg-[#1a0a10] opacity-80' : 'border-[3px] border-[#6b3fa0] bg-[#221038] shadow-[0_0_20px_rgba(107,63,160,0.5)]'}
      `}
      style={{ left: position.x, top: position.y }}
      onClick={() => onClick(player)}
    >
      {/* Token Image inside the board circle */}
      {player.claimedRole ? (
        <img 
          src={tokenImgSrc} 
          className={`w-full h-full object-cover rounded-full p-[2px] ${player.isDead ? 'grayscale opacity-60' : ''}`} 
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
        />
      ) : (
        <span className="text-[#6b3fa0] font-serif text-2xl font-bold">?</span>
      )}

      {/* Dead Indicator Slash */}
      {player.isDead && (
        <div className="absolute w-[110%] h-[4px] bg-red-600 shadow-md -rotate-45 z-20 rounded-full opacity-80"></div>
      )}

      {/* Ultra-readable Name Badge */}
      <div className={`absolute -bottom-4 px-3 py-1 rounded-md text-xs font-bold border truncate max-w-[130%] z-30 shadow-lg
        ${player.isDead ? 'bg-red-950 border-red-900 text-red-200' : 'bg-black border-[#6b3fa0] text-purple-100'}
      `}>
        {player.name}
      </div>
    </div>
  );
}