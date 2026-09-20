import type { Player } from '../types';
import { ALL_IN_GAME_ROLES, TB_ROLES } from '../constants';

interface Props {
  player: Player;
  updatePlayer: (player: Player) => void;
  activePlayers: Player[];
  globalDay: number;
}

// Only these roles actually receive info. If they aren't on this list, no night boxes render.
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
    .map(p => <option key={p.id} value={p.id}>{p.name}</option>);

  // --- INFO VISIBILITY MATH ---
  let validNights: number[] = [];
  
  // Only calculate info nights if the claimed role actually gets information
  if (player.claimedRole && ROLES_WITH_INFO.includes(player.claimedRole)) {
    let maxInfoNights = globalDay;
    if (player.isDead && player.deathDay) {
      maxInfoNights = Math.min(globalDay, player.deathDay);
    }

    validNights = Array.from({ length: maxInfoNights }, (_, i) => i + 1);

    if (player.claimedRole === "Undertaker") {
      validNights = validNights.filter(n => n > 1);
    } else if (["Washerwoman", "Librarian", "Investigator", "Chef"].includes(player.claimedRole)) {
      validNights = globalDay >= 1 ? [1] : [];
    } else if (player.claimedRole === "Ravenkeeper") {
      validNights = (player.isDead && player.deathPhase === 'Night' && player.deathDay) 
        ? [player.deathDay] : [];
    }
  }

  // Dynamic dropdown options for the day the player died (cannot exceed global game day)
  const deathDayOptions = Array.from({ length: globalDay }, (_, i) => i + 1);

  return (
    <div className="h-full flex flex-col pb-10">
      
      {/* Header & Token Image */}
      <div className="flex items-center space-x-4 mb-6 border-b border-slate-700 pb-4">
        {player.claimedRole ? (
          <img 
            src={tokenImgSrc} 
            alt={player.claimedRole} 
            className="w-16 h-16 rounded-full border-2 border-slate-600 bg-slate-800 object-cover"
            onError={(e) => { (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="%231e293b"><circle cx="32" cy="32" r="32"/></svg>' }}
          />
        ) : (
          <div className="w-16 h-16 rounded-full border-2 border-slate-600 bg-slate-800 flex items-center justify-center text-xs text-slate-500 text-center leading-tight">No<br/>Role</div>
        )}
        <div>
          <h2 className="text-xl font-bold text-blue-400">{player.name}</h2>
          <select 
            value={player.claimedRole || ""} onChange={handleRoleChange}
            className="w-full bg-slate-800 border border-slate-600 rounded p-1 text-sm text-white mt-1"
          >
            <option value="">-- Claim a Role --</option>
            {ALL_IN_GAME_ROLES.map((role: string) => <option key={role} value={role}>{role}</option>)}
          </select>
        </div>
      </div>

      <div className="space-y-6">
        
        {/* TIME OF DEATH SETTINGS */}
        <div className="bg-slate-800 p-3 rounded border border-slate-700 space-y-2">
          <div className="flex items-center space-x-3">
            <input 
              type="checkbox" id="isDead" checked={player.isDead}
              onChange={(e) => updatePlayer({ 
                ...player, 
                isDead: e.target.checked, 
                deathPhase: e.target.checked ? 'Day' : null, 
                deathDay: e.target.checked ? globalDay : null,
                deathCause: e.target.checked ? 'Execution' : null 
              })}
              className="w-4 h-4 cursor-pointer"
            />
            <label htmlFor="isDead" className="font-bold text-red-400 cursor-pointer">Player is Dead</label>
          </div>
          
          {player.isDead && (
            <div className="flex flex-col space-y-2 pl-7 mt-2">
              <div className="flex space-x-2">
                <span className="text-sm text-slate-400 self-center">Died on:</span>
                <select 
                  value={player.deathPhase || 'Day'} 
                  onChange={(e) => updatePlayer({
                    ...player, 
                    deathPhase: e.target.value as 'Day'|'Night',
                    deathCause: e.target.value === 'Day' ? 'Execution' : null 
                  })}
                  className="bg-slate-900 border border-slate-600 rounded p-1 text-sm text-white"
                >
                  <option value="Day">Day</option>
                  <option value="Night">Night</option>
                </select>
                <select 
                  value={player.deathDay || globalDay} 
                  onChange={(e) => updatePlayer({...player, deathDay: parseInt(e.target.value)})}
                  className="bg-slate-900 border border-slate-600 rounded p-1 text-sm text-white"
                >
                  {deathDayOptions.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              {/* SECONDARY DROPDOWN FOR DAY CAUSES */}
              {player.deathPhase === 'Day' && (
                <div className="flex space-x-2 mt-1">
                  <span className="text-sm text-slate-400 self-center">Cause:</span>
                  <select 
                    value={player.deathCause || 'Execution'} 
                    onChange={(e) => updatePlayer({...player, deathCause: e.target.value as any})}
                    className="flex-1 bg-slate-900 border border-slate-600 rounded p-1 text-sm text-white"
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

        {/* DYNAMIC ROLE TEMPLATES - ONLY SHOWS FOR INFO ROLES */}
        <div className="space-y-4">
          {validNights.map(night => {
            const isNightOfKill = player.isDead && player.deathPhase === 'Night' && player.deathDay === night;
            const claimData = player.claims[night] || {};
            const noInfo = claimData.noInfoReceived || false;

            return (
              <div key={night} className="bg-slate-800 p-4 rounded border border-slate-700 relative">
                <h3 className="font-bold text-sm text-blue-400 absolute top-[-10px] left-3 bg-slate-900 px-2 rounded-full border border-slate-700">
                  Night {night}
                </h3>
                
                {isNightOfKill && (
                  <div className="flex items-center space-x-2 mb-3 mt-2 border-b border-slate-700 pb-2">
                    <input 
                      type="checkbox" checked={noInfo}
                      onChange={(e) => updateClaimData(night, 'noInfoReceived', e.target.checked)}
                      className="w-3 h-3 cursor-pointer"
                    />
                    <label className="text-xs text-red-300">Died before receiving info</label>
                  </div>
                )}

                {!noInfo && (
                  <div className="mt-4 space-y-3">
                    {/* WASHERWOMAN / LIBRARIAN / INVESTIGATOR */}
                    {["Washerwoman", "Librarian", "Investigator"].includes(player.claimedRole || "") && (
                      <>
                        <select value={claimData.target1 || ""} onChange={(e) => updateClaimData(night, 'target1', parseInt(e.target.value))} className="w-full bg-slate-900 border border-slate-600 rounded p-1 text-sm">
                          <option value="">- Target 1 -</option>{playerOptions}
                        </select>
                        <select value={claimData.target2 || ""} onChange={(e) => updateClaimData(night, 'target2', parseInt(e.target.value))} className="w-full bg-slate-900 border border-slate-600 rounded p-1 text-sm">
                          <option value="">- Target 2 -</option>{playerOptions}
                        </select>
                        <select value={claimData.roleSeen || ""} onChange={(e) => updateClaimData(night, 'roleSeen', e.target.value)} className="w-full bg-slate-900 border border-slate-600 rounded p-1 text-sm">
                          <option value="">- Role Seen -</option>
                          {ALL_IN_GAME_ROLES.map((r: string) => <option key={r} value={r}>{r}</option>)}
                        </select>
                      </>
                    )}

                    {/* FORTUNE TELLER */}
                    {player.claimedRole === "Fortune Teller" && (
                       <>
                        <select value={claimData.target1 || ""} onChange={(e) => updateClaimData(night, 'target1', parseInt(e.target.value))} className="w-full bg-slate-900 border border-slate-600 rounded p-1 text-sm">
                          <option value="">- Target 1 -</option>{playerOptions}
                        </select>
                        <select value={claimData.target2 || ""} onChange={(e) => updateClaimData(night, 'target2', parseInt(e.target.value))} className="w-full bg-slate-900 border border-slate-600 rounded p-1 text-sm">
                          <option value="">- Target 2 -</option>{playerOptions}
                        </select>
                        <select value={claimData.result || ""} onChange={(e) => updateClaimData(night, 'result', e.target.value)} className="w-full bg-slate-900 border border-slate-600 rounded p-1 text-sm">
                          <option value="">- Saw Demon? -</option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                       </>
                    )}

                    {/* UNDERTAKER & RAVENKEEPER */}
                    {["Undertaker", "Ravenkeeper"].includes(player.claimedRole || "") && (
                      <>
                        {player.claimedRole === "Ravenkeeper" && (
                          <select value={claimData.target1 || ""} onChange={(e) => updateClaimData(night, 'target1', parseInt(e.target.value))} className="w-full bg-slate-900 border border-slate-600 rounded p-1 text-sm mb-2">
                            <option value="">- Player Targeted -</option>{playerOptions}
                          </select>
                        )}
                        <select value={claimData.roleSeen || ""} onChange={(e) => updateClaimData(night, 'roleSeen', e.target.value)} className="w-full bg-slate-900 border border-slate-600 rounded p-1 text-sm">
                          <option value="">- Role Seen -</option>
                          {ALL_IN_GAME_ROLES.map((r: string) => <option key={r} value={r}>{r}</option>)}
                        </select>
                      </>
                    )}

                     {/* CHEF / EMPATH */}
                     {["Chef", "Empath"].includes(player.claimedRole || "") && (
                       <select value={claimData.number !== undefined ? claimData.number : ""} onChange={(e) => updateClaimData(night, 'number', parseInt(e.target.value))} className="w-full bg-slate-900 border border-slate-600 rounded p-1 text-sm">
                          <option value="">- Evils / Pairs Seen -</option>
                          {[0,1,2,3,4].map(n => <option key={n} value={n}>{n}</option>)}
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