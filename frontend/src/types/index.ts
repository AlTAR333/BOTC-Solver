export interface Player {
  id: number;
  name: string;
  isDead: boolean;
  dayDied: number | null;
  claimedRole: string | null;
  claims: any; // We'll expand this later (e.g., Washerwoman saw X and Y as Z)
  constraints: {
    mustBeEvil: boolean;
    mustBeGood: boolean;
    hasFalseInfo: boolean;
  };
}