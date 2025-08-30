"""Game management routes."""

from fastapi import APIRouter, HTTPException
from database.client import get_supabase_client
from agents.creategame import create_murder_mystery_game
from datetime import datetime
import json
from agents.gamemaster import handle_query
from agents.updatecrew import analyze_for_updates
import asyncio
from agents.summarizer import summarize_game_state

router = APIRouter()



@router.post("/create/{user_id}")
async def create_game(game_request: dict, user_id: str):
    """Generate and store a complete murder mystery game using AI agent."""
    try:
        # Validation
        if not game_request.get("title") or not game_request.get("description") or not game_request.get("character_count"):
            raise HTTPException(400, "Missing required input fields")
        
            
        supabase = get_supabase_client()

        title = game_request["title"]
        description = game_request["description"] 
        character_count = game_request.get("character_count")
        
        
        # Generate game using agent
        agent_result = create_murder_mystery_game(title, description, character_count)
        game_data = json.loads(agent_result.raw)

        
        supabase.table("games").update({"is_active": False}).eq("user_id", user_id).execute()
        
        # 1. Create the game record first
        game_record = {
            "user_id": user_id,
            "title": title,
            "status": "CAST_READY",
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat(),
            "is_active": True,
        }
        
        game_response = supabase.table("games").insert(game_record).execute()
        if not game_response.data:
            raise HTTPException(500, "Failed to create game record")
        game_id = game_response.data[0]["id"]
        
        # 2. Insert characters (validate single killer)
        characters = game_data["characters"]

        
        killers = [char for char in characters if char.get("is_killer", False)]
        
        if len(killers) != 1:
            raise HTTPException(400, f"Exactly one character must be the killer, found {len(killers)}")
        
        for character in characters:
            char_record = {
                "game_id": game_id,
                "name": character.get("name"),
                "description": character.get("description"),
                "personality": character.get("personality", {}),
                "lie_policy": character.get("lie_policy", "honest"),
                "is_killer": character.get("is_killer", False),
                "is_alive": True if character.get("is_victim", False) else False,
                "is_victim": character.get("is_victim", False),
                "secrets": character.get("secrets", []),
                "relationships": character.get("relationships", {}),
                "observations": character.get("observations", {}),
                "metadata": character.get("metadata", {})
            }
            supabase.table("characters").insert(char_record).execute()
        
        # 3. Insert locations
        
        locations = game_data["locations"]
       
        for location in locations:
            loc_record = {
                "game_id": game_id,
                "name": location.get("name"),
                "description": location.get("description"),
                "is_accessible": location.get("is_accessible", True),
                "connected_locations": location.get("connected_locations", []),
                "atmosphere": location.get("atmosphere", "neutral"),
                "metadata": location.get("metadata", {})
            }

            
            supabase.table("locations").insert(loc_record).execute()
        
        # 4. Insert clues
        clues = game_data["clues"]
        for clue in clues:
            clue_record = {
                "game_id": game_id,
                "title": clue.get("title"),
                "description": clue.get("description"),
                "location_id": clue.get("location_id"),
                "is_revealed": clue.get("is_revealed", False),
                "discovered_by": clue.get("discovered_by"),
                "discovery_method": clue.get("discovery_method", "investigation"),
                "significance_level": clue.get("significance_level", 1),
                "points_to": clue.get("points_to", []),
                "metadata": clue.get("metadata", {})
            }
            supabase.table("clues").insert(clue_record).execute()
        
        # 5. Insert timeline events
        timeline_events = game_data["timeline_events"]
        for event in timeline_events:
            event_record = {
                "game_id": game_id,
                "event_time": event.get("event_time"),
                "event_description": event.get("event_description"),
                "location_id": event.get("location_id"),
                "character_ids": event.get("character_ids", []),
                "event_type": event.get("event_type", "general"),
                "is_public": event.get("is_public", True),
                "witness_ids": event.get("witness_ids", []),
                "metadata": event.get("metadata", {})
            }
            supabase.table("timeline_events").insert(event_record).execute()
        
        return {
            "message": "Game generated and stored successfully",
            "game_id": game_id,
            "summary": {
                "characters": len(characters),
                "locations": len(locations), 
                "clues": len(clues),
                "timeline_events": len(timeline_events),
                
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(e)
        raise HTTPException(500, f"Failed to create game: {str(e)}")






@router.post("/query/{game_id}")
async def query_game(game_id: str, query: dict):
    """Handle a player query in a game."""
    try:
        query_text = query.get("query") 
        print(game_id, query_text)
        
        # Fetch recent conversation history for context
        supabase = get_supabase_client()
        history_response = supabase.table("interactions").select("user_query, agent_response, created_at").eq("game_id", game_id).order("created_at", desc=True).limit(5).execute()
        
        conversation_history = history_response.data if history_response.data else []

        converstation_text=""
        for interaction in conversation_history:
            converstation_text += f"Player: {interaction['user_query']}\nAI: {interaction['agent_response']}\n"

        summary = summarize_game_state(conversation_history)
        
        # Get AI response with conversation context
        result = handle_query(game_id, query_text, summary)
        
        # Log this interaction
        supabase.table("interactions").insert({
            "game_id": game_id,
            "user_query": query_text,
            "agent_response": result,
            "created_at": datetime.now().isoformat()
        }).execute()
        
        # Analyze for updates and store game update in background DONT AWAIT THIS
        asyncio.create_task(bg_process(game_id, query_text, result)) 


        return {"response": result}
    except Exception as e:
        raise HTTPException(500, f"Failed to handle query: {str(e)}")


async def bg_process(game_id: str, query_text: str, result: str):
    """Background process for analyzing for updates and storing game update."""
    update_result = await analyze_for_updates(game_id, query_text, result)
    print("Gotten Analysis")
    await store_game_update(game_id, update_result)

async def store_game_update(game_id: str, update_result: str):
    """Store game update in database."""
    print(f"🔍 DEBUG: store_game_update STARTED with game_id: {game_id}")
    
    try:
        
        supabase = get_supabase_client()
        print(update_result)
        updates = json.loads(update_result)
       

        for i, update in enumerate(updates.get("updates", [])):
            print(f"🔍 DEBUG: Processing update {i+1} - {update['action']} on {update['table']}")
            
            table = update["table"]
            action = update["action"]
            data = update["data"]
            
            if "id" in data:
                del data["id"]  

            if action == "insert":
                data["game_id"] = game_id
                
                result = supabase.table(table).insert(data).execute()
                
                
            elif action == "update":
                if(data.get("name")):
                    name = data.get("name")
                    result = supabase.table(table).update(data).eq("game_id", game_id).eq("name", name).execute()
                elif(data.get("title")):
                    name = data.get("title")
                    result = supabase.table(table).update(data).eq("game_id", game_id).eq("title", name).execute()
               
                
            elif action == "delete":
                if(data.get("name")):
                    name = data.get("name")
                    result = supabase.table(table).delete().eq("game_id", game_id).eq("name", name).execute()
                elif(data.get("title")):
                    name = data.get("title")
                    result = supabase.table(table).delete().eq("game_id", game_id).eq("title", name).execute()
               
        
        print("🔍 DEBUG: store_game_update FINISHED successfully")

    except Exception as e:
        print(f"❌ ERROR in store_game_update: {str(e)}")
        import traceback
        print(f"❌ TRACEBACK: {traceback.format_exc()}")
