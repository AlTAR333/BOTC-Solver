from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models import SolveRequest, PossibleWorld

app = FastAPI()

# Allow React (localhost:5173) to communicate with this Python server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/solve")
async def solve_grimoire(request: SolveRequest):
    # --- HERE IS WHERE OUR LOGIC WILL GO ---
    print(f"Received data for Day {request.globalTime.day}")
    for p in request.players:
        if p.claimedRole:
            print(f"Player {p.id} ({p.name}) claims {p.claimedRole} with claims: {p.claims}")
    
    # --- MOCK RESPONSE FOR FRONTEND BUILDING ---
    # We will generate fake possible worlds to test the UI filters
    mock_worlds = [
        PossibleWorld(
            id="world_1",
            roles={1: "Washerwoman", 2: "Imp", 3: "Poisoner", 4: "Empath", 5: "Monk", 6: "Recluse", 7: "Virgin"},
            evil_team=[2, 3]
        ),
        PossibleWorld(
            id="world_2",
            roles={1: "Poisoner", 2: "Chef", 3: "Imp", 4: "Empath", 5: "Monk", 6: "Recluse", 7: "Virgin"},
            evil_team=[1, 3]
        )
    ]
    
    return {"possible_worlds": mock_worlds}