// src/constants/index.ts

export const TB_ROLES = {
  TOWNSFOLK: [
    "Washerwoman", "Librarian", "Investigator", "Chef", "Empath",
    "Fortune Teller", "Undertaker", "Monk", "Ravenkeeper", "Virgin",
    "Slayer", "Soldier", "Mayor"
  ],
  OUTSIDERS: ["Butler", "Drunk", "Recluse", "Saint"],
  MINIONS: ["Poisoner", "Spy", "Scarlet Woman", "Baron"],
  DEMONS: ["Imp"]
};

// Flattened list for the dropdown
export const ALL_IN_GAME_ROLES = [
  ...TB_ROLES.TOWNSFOLK,
  ...TB_ROLES.OUTSIDERS,
  ...TB_ROLES.MINIONS,
  ...TB_ROLES.DEMONS
].sort();

// Roles that gather info once (First Night or Day)
export const SINGLE_INFO_ROLES = ["Washerwoman", "Librarian", "Investigator", "Chef", "Ravenkeeper"];

// Roles that wake up every night
export const MULTI_NIGHT_ROLES = ["Empath", "Fortune Teller", "Undertaker"];