import itertools
from typing import List, Dict, Any
from models import PlayerData
from rules import BASE_SETUP, TB_ROLES

def generate_base_worlds(players: List[PlayerData]):
    """
    Yields "Base Worlds". A base world defines EXACTLY who the Evil team is,
    what their roles are, and who the Good players are.
    """
    player_count = len(players)
    if player_count not in BASE_SETUP:
        return # Invalid player count

    setup = BASE_SETUP[player_count]
    num_minions = setup["M"]
    
    player_ids = [p.id for p in players]

    # 1. Iterate over every possible player to be the Demon
    for demon_id in player_ids:
        # Check constraints: If UI says this player MUST be Good, skip them
        demon_player = next(p for p in players if p.id == demon_id)
        if demon_player.constraints.mustBeGood:
            continue

        remaining_for_minions = [pid for pid in player_ids if pid != demon_id]

        # 2. Iterate over every combination of players to be the Minions
        for minion_ids in itertools.combinations(remaining_for_minions, num_minions):
            
            # Check constraints: If any selected minion MUST be Good, skip this combo
            invalid_minion = False
            for mid in minion_ids:
                if next(p for p in players if p.id == mid).constraints.mustBeGood:
                    invalid_minion = True
                    break
            if invalid_minion:
                continue

            # 3. Now we have the Evil *players*. What are their *roles*?
            # We must iterate through all combinations of Minion characters (e.g. Poisoner+Baron)
            for minion_roles in itertools.permutations(TB_ROLES["Minions"], num_minions):
                
                # Check for Baron to calculate expected Outsiders
                has_baron = "Baron" in minion_roles
                expected_outsiders = setup["O"] + (2 if has_baron else 0)

                # 4. Build the Evil Team dictionary
                world_roles = {demon_id: "Imp"}
                for i, mid in enumerate(minion_ids):
                    world_roles[mid] = minion_roles[i]

                # The rest are Good players.
                good_player_ids = [pid for pid in player_ids if pid not in minion_ids and pid != demon_id]
                
                # Quick Constraint Check: Did any Good player have a "Must Be Evil" flag?
                invalid_good = False
                for gid in good_player_ids:
                    if next(p for p in players if p.id == gid).constraints.mustBeEvil:
                        invalid_good = True
                        break
                if invalid_good:
                    continue

                yield {
                    "evil_players": [demon_id] + list(minion_ids),
                    "good_players": good_player_ids,
                    "roles": world_roles,
                    "expected_outsiders": expected_outsiders
                }