import type { Player } from '../types';
import { TB_ROLES } from '../constants';

interface Props {
  player: Player;
  updatePlayer: (player: Player) => void;
  activePlayers: Player[];
  globalDay: number;
}

const ROLES_WITH_INFO = ["Washerwoman", "Librarian", "Investigator", "Chef", "Empath", "Fortune Teller", "Undertaker", "Ravenkeeper"];

export default function PlayerEditor({ player, updatePlayer, activePlayers, globalDay }: Props) {
  
  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updatePlayer({ ...player, claimedRole: e.target.value, claims: {} });
  };

  const updateClaimData = (night: number, field: string, value: any) => {
    const currentNightData = player.claims[night] || {};
    updatePlayer({
      ...player,
      claims: { ...player.claims, [night]: { ...currentNightData, [field]: value } }
    });
  };

  const tokenImgSrc = player.claimedRole 
    ? `/tokens/${player.claimedRole.toLowerCase().replace(/\s+/g, '-')}.png` 
    : '';

  const playerOptions = activePlayers
    .filter(p => p.id !== player.id)
    .map(p => <option key={p.id} value={p.id} className="text-purple-200">{p.name}</option>);

  // Component to render color-coded role options
  const ColoredRoleOptions = () => (
    <>
      <optgroup label="Townsfolk" className="bg-black text-blue-400">
        {TB_ROLES.TOWNSFOLK.map(r => <option key={r} value={r} className="text-blue-400">{r}</option>)}
      </optgroup>
      <optgroup label="Outsiders" className="bg-black text-blue-200">
        {TB_ROLES.OUTSIDERS.map(r => <option key={r} value={r} className="text-blue-200">{r}</option>)}
      </optgroup>
      <optgroup label="Minions" className="bg-black text-orange-500">
        {TB_ROLES.MINIONS.map(r => <option key={r} value={r} className="text-orange-500">{r}</option>)}
      </optgroup>
      <optgroup label="Demons" className="bg-black text-red-600">
        {TB_ROLES.DEMONS.map(r => <option key={r} value={r} className="text-red-600">{r}</option>)}
      </optgroup>
    </>
  );

  let validNights: number[] = [];
  if (player.claimedRole && ROLES_WITH_INFO.includes(player.claimedRole)) {
    let maxInfoNights = globalDay;
    if (player.isDead && player.deathDay) maxInfoNights = Math.min(globalDay, player.deathDay);
    validNights = Array.from({ length: maxInfoNights }, (_, i) => i + 1);

    if (player.claimedRole === "Undertaker") validNights = validNights.filter(n => n > 1);
    else if (["Washerwoman", "Librarian", "Investigator", "Chef"].includes(player.claimedRole)) validNights = globalDay >= 1 ? [1] : [];
    else if (player.claimedRole === "Ravenkeeper") validNights = (player.isDead && player.deathPhase === 'Night' && player.deathDay) ? [player.deathDay] : [];
  }

  const deathDayOptions = Array.from({ length: globalDay }, (_, i) => i + 1);

  return (
    <div className="h-full flex flex-col pb-10">
      
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6 border-b border-[#3a1d5e] pb-4">
        {player.claimedRole ? (
          <img 
            src={tokenImgSrc} 
            alt={player.claimedRole} 
            className="w-16 h-16 rounded-full border-2 border-[#6b3fa0] bg-[#1a0a26] object-cover flex-shrink-0 shadow-[0_0_15px_rgba(107,63,160,0.4)]"
            onError={(e) => { (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="%23221038"><circle cx="32" cy="32" r="32"/></svg>' }}
          />
        ) : (
          <div className="w-16 h-16 rounded-full border-2 border-[#3a1d5e] bg-[#0b0410] flex items-center justify-center text-xs text-[#3a1d5e] flex-shrink-0 font-serif text-xl">?</div>
        )}
        <div className="flex-1">
          <input 
            type="text" value={player.name}
            onChange={(e) => updatePlayer({ ...player, name: e.target.value })}
            className="w-full bg-transparent text-xl font-bold text-purple-200 border-b border-transparent hover:border-[#3a1d5e] focus:border-purple-400 focus:outline-none mb-2 px-1 transition-colors placeholder-[#3a1d5e]"
            placeholder="Enter player name"
          />
          <select 
            value={player.claimedRole || ""} onChange={handleRoleChange}
            className="w-full bg-black/60 border border-[#3a1d5e] rounded p-1.5 text-sm text-purple-100 focus:outline-none focus:border-purple-400"
          >
            <option value="" className="text-purple-300">-- Claim a Role --</option>
            <ColoredRoleOptions />
          </select>
        </div>
      </div>

      <div className="space-y-6">
        
        {/* DEATH SETTINGS */}
        <div className="bg-black/30 p-3 rounded-lg border border-[#3a1d5e] space-y-2">
          <div className="flex items-center space-x-3">
            <input 
              type="checkbox" id="isDead" checked={player.isDead}
              onChange={(e) => updatePlayer({ 
                ...player, isDead: e.target.checked, deathPhase: e.target.checked ? 'Day' : null, deathDay: e.target.checked ? globalDay : null, deathCause: e.target.checked ? 'Execution' : null 
              })}
              className="w-4 h-4 accent-red-600 cursor-pointer"
            />
            <label htmlFor="isDead" className="font-bold text-red-500 cursor-pointer">Player is Dead</label>
          </div>
          
          {player.isDead && (
            <div className="flex flex-col space-y-2 pl-7 mt-2">
              <div className="flex space-x-2">
                <span className="text-sm text-purple-400 self-center">Died on:</span>
                <select 
                  value={player.deathPhase || 'Day'} 
                  onChange={(e) => updatePlayer({...player, deathPhase: e.target.value as 'Day'|'Night', deathCause: e.target.value === 'Day' ? 'Execution' : null })}
                  className="bg-black/60 border border-red-900/50 rounded p-1 text-sm text-red-200"
                >
                  <option value="Day">Day</option>
                  <option value="Night">Night</option>
                </select>
                <select 
                  value={player.deathDay || globalDay} 
                  onChange={(e) => updatePlayer({...player, deathDay: parseInt(e.target.value)})}
                  className="bg-black/60 border border-red-900/50 rounded p-1 text-sm text-red-200"
                >
                  {deathDayOptions.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              {player.deathPhase === 'Day' && (
                <div className="flex space-x-2 mt-1">
                  <span className="text-sm text-purple-400 self-center">Cause:</span>
                  <select 
                    value={player.deathCause || 'Execution'} 
                    onChange={(e) => updatePlayer({...player, deathCause: e.target.value as any})}
                    className="flex-1 bg-black/60 border border-red-900/50 rounded p-1 text-sm text-red-200"
                  >
                    <option value="Execution">Execution by vote</option>
                    <option value="Slayer">Slayer shot</option>
                    <option value="Virgin">Virgin execution</option>
                  </select>
                </div>
              )}
            </div>
          )}
        </div>

        {/* INFO BOXES */}
        <div className="space-y-5">
          {validNights.map(night => {
            const isNightOfKill = player.isDead && player.deathPhase === 'Night' && player.deathDay === night;
            const claimData = player.claims[night] || {};
            const noInfo = claimData.noInfoReceived || false;

            return (
              <div key={night} className="bg-black/40 p-4 rounded-lg border border-[#3a1d5e] relative pt-5">
                <h3 className="font-bold text-xs text-purple-300 absolute top-[-10px] left-3 bg-[#11071c] px-3 py-0.5 rounded-full border border-[#3a1d5e] uppercase tracking-wider">
                  Night {night}
                </h3>
                
                {isNightOfKill && (
                  <div className="flex items-center space-x-2 mb-3 border-b border-[#3a1d5e] pb-3">
                    <input 
                      type="checkbox" checked={noInfo}
                      onChange={(e) => updateClaimData(night, 'noInfoReceived', e.target.checked)}
                      className="w-3 h-3 accent-red-600"
                    />
                    <label className="text-xs text-red-400 font-bold uppercase tracking-wider">Died before receiving info</label>
                  </div>
                )}

                {!noInfo && (
                  <div className="space-y-3">
                    {/* WASHERWOMAN / LIBRARIAN / INVESTIGATOR */}
                    {["Washerwoman", "Librarian", "Investigator"].includes(player.claimedRole || "") && (
                      <>
                        <select value={claimData.target1 || ""} onChange={(e) => updateClaimData(night, 'target1', parseInt(e.target.value))} className="w-full bg-black/60 border border-[#3a1d5e] rounded p-1.5 text-sm text-purple-100">
                          <option value="">- Target 1 -</option>{playerOptions}
                        </select>
                        <select value={claimData.target2 || ""} onChange={(e) => updateClaimData(night, 'target2', parseInt(e.target.value))} className="w-full bg-black/60 border border-[#3a1d5e] rounded p-1.5 text-sm text-purple-100">
                          <option value="">- Target 2 -</option>{playerOptions}
                        </select>
                        <select value={claimData.roleSeen || ""} onChange={(e) => updateClaimData(night, 'roleSeen', e.target.value)} className="w-full bg-black/60 border border-[#3a1d5e] rounded p-1.5 text-sm">
                          <option value="" className="text-purple-300">- Role Seen -</option>
                          <ColoredRoleOptions />
                        </select>
                      </>
                    )}

                    {/* FORTUNE TELLER */}
                    {player.claimedRole === "Fortune Teller" && (
                       <>
                        <select value={claimData.target1 || ""} onChange={(e) => updateClaimData(night, 'target1', parseInt(e.target.value))} className="w-full bg-black/60 border border-[#3a1d5e] rounded p-1.5 text-sm text-purple-100">
                          <option value="">- Target 1 -</option>{playerOptions}
                        </select>
                        <select value={claimData.target2 || ""} onChange={(e) => updateClaimData(night, 'target2', parseInt(e.target.value))} className="w-full bg-black/60 border border-[#3a1d5e] rounded p-1.5 text-sm text-purple-100">
                          <option value="">- Target 2 -</option>{playerOptions}
                        </select>
                        <select value={claimData.result || ""} onChange={(e) => updateClaimData(night, 'result', e.target.value)} className="w-full bg-black/60 border border-[#3a1d5e] rounded p-1.5 text-sm text-purple-100">
                          <option value="">- Saw Demon? -</option>
                          <option value="Yes" className="text-red-500 font-bold">Yes</option>
                          <option value="No" className="text-blue-400 font-bold">No</option>
                        </select>
                       </>
                    )}

                    {/* UNDERTAKER & RAVENKEEPER */}
                    {["Undertaker", "Ravenkeeper"].includes(player.claimedRole || "") && (
                      <>
                        {player.claimedRole === "Ravenkeeper" && (
                          <select value={claimData.target1 || ""} onChange={(e) => updateClaimData(night, 'target1', parseInt(e.target.value))} className="w-full bg-black/60 border border-[#3a1d5e] rounded p-1.5 text-sm text-purple-100 mb-2">
                            <option value="">- Player Targeted -</option>{playerOptions}
                          </select>
                        )}
                        <select value={claimData.roleSeen || ""} onChange={(e) => updateClaimData(night, 'roleSeen', e.target.value)} className="w-full bg-black/60 border border-[#3a1d5e] rounded p-1.5 text-sm">
                          <option value="" className="text-purple-300">- Role Seen -</option>
                          <ColoredRoleOptions />
                        </select>
                      </>
                    )}

                     {/* CHEF / EMPATH */}
                     {["Chef", "Empath"].includes(player.claimedRole || "") && (
                       <select value={claimData.number !== undefined ? claimData.number : ""} onChange={(e) => updateClaimData(night, 'number', parseInt(e.target.value))} className="w-full bg-black/60 border border-[#3a1d5e] rounded p-1.5 text-sm text-purple-100">
                          <option value="">- Evils / Pairs Seen -</option>
                          {[0,1,2,3,4].map(n => <option key={n} value={n} className="text-red-400 font-bold">{n}</option>)}
                        </select>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}