export interface Player {
  id: number;
  name: string;
  isDead: boolean;
  deathPhase: 'Day' | 'Night' | null;
  deathCause: 'Execution' | 'Slayer' | 'Virgin' | null;
  deathDay: number | null;
  claimedRole: string | null;
  claims: Record<number, any>;
  constraints: {
    mustBeEvil: boolean;
    mustBeGood: boolean;
    hasFalseInfo: boolean;
  };
}