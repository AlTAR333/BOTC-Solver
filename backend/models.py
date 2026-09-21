from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class GlobalTime(BaseModel):
    phase: str  # 'Day' or 'Night'
    day: int

class Constraints(BaseModel):
    mustBeGood: bool
    mustBeEvil: bool
    hasFalseInfo: bool

class PlayerData(BaseModel):
    id: int
    name: str
    isDead: bool
    deathPhase: Optional[str] = None
    deathCause: Optional[str] = None
    deathDay: Optional[int] = None
    claimedRole: Optional[str] = None
    claims: Dict[int, Dict[str, Any]]  # Maps Night number to their info payload
    constraints: Constraints

class SolveRequest(BaseModel):
    globalTime: GlobalTime
    players: List[PlayerData]

# The structure we will send back to React
class PossibleWorld(BaseModel):
    id: str
    roles: Dict[int, str]  # Maps Player ID to their actual Role in this scenario
    evil_team: List[int]   # List of Player IDs on the evil team