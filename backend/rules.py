# backend/rules.py

# Maps player count to (Townsfolk, Outsiders, Minions, Demons)
BASE_SETUP = {
    5:  {"T": 3, "O": 0, "M": 1, "D": 1},
    6:  {"T": 3, "O": 1, "M": 1, "D": 1},
    7:  {"T": 5, "O": 0, "M": 1, "D": 1},
    8:  {"T": 5, "O": 1, "M": 1, "D": 1},
    9:  {"T": 5, "O": 2, "M": 1, "D": 1},
    10: {"T": 7, "O": 0, "M": 2, "D": 1},
    11: {"T": 7, "O": 1, "M": 2, "D": 1},
    12: {"T": 7, "O": 2, "M": 2, "D": 1},
    13: {"T": 9, "O": 0, "M": 3, "D": 1},
    14: {"T": 9, "O": 1, "M": 3, "D": 1},
    15: {"T": 9, "O": 2, "M": 3, "D": 1},
}

TB_ROLES = {
    "Townsfolk": ["Washerwoman", "Librarian", "Investigator", "Chef", "Empath", 
                  "Fortune Teller", "Undertaker", "Monk", "Ravenkeeper", "Virgin", 
                  "Slayer", "Soldier", "Mayor"],
    "Outsiders": ["Butler", "Drunk", "Recluse", "Saint"],
    "Minions":   ["Poisoner", "Spy", "Scarlet Woman", "Baron"],
    "Demons":    ["Imp"]
}