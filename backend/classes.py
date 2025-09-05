from pydantic import BaseModel, Field
from typing import Optional, Literal
from database.client import get_supabase_client
from crewai.tools import BaseTool
from typing import Type
import json
import openai
import requests
import os
from huggingface_hub import InferenceClient
import io

class Character(BaseModel):
    """Character data for agent creation - matches database schema."""
    name: str
    description: str = Field(default=None, description="Brief description of the character")
    personality: dict = Field(default={}, description="Character's personality, background, and traits as JSON object")
    lie_policy: str = Field(
        default="honest", 
        description="How the character behaves when questioned. Options: honest, evasive, deceptive, pathological"
    )
    is_killer: bool = Field(default=False, description="Whether this character is the murderer")
    is_alive: bool = Field(default=True, description="Whether the character is alive or dead")
    is_victim: bool = Field(default=False, description="Whether the character is the victim")
    secrets: list = Field(default=[], description="Array of secrets the character is hiding")
    relationships: dict = Field(default={}, description="Character's relationships with others as JSON object")
    observations: dict = Field(default={}, description="Character's observations of the scene and other characters as JSON object")
    metadata: dict = Field(description="Additional character data as JSON object")


class Location(BaseModel):
    """Location data for agent creation - matches database schema."""
    name: str
    description: str = Field(description="Detailed description of the location")
    is_accessible: bool = Field(default=True, description="Whether players can currently access this location")
    connected_locations: list = Field(default=[], description="Array of location names that connect to this location")
    atmosphere: str = Field(default="neutral", description="The mood/feeling of the location (e.g., dark, cozy, mysterious, neutral)")
    metadata: dict = Field(description="Additional location data as JSON object")


class Clue(BaseModel):
    """Clue data for agent creation - matches database schema."""
    title: str = Field(description="Short name/title for the clue")
    description: str = Field(description="Detailed description of what the clue is and reveals")
    location_id: str = Field(default=None, description="Name of location where clue is found")
    is_revealed: bool = Field(default=False, description="Whether the clue has been discovered by players")
    discovered_by: str = Field(default=None, description="Who discovered this clue")
    discovery_method: str = Field(
        default="investigation", 
        description="How the clue was found. Options: investigation, witness, forensics, confession, accident"
    )
    significance_level: int = Field(default=1, description="Importance of clue on scale 1-5 (1=minor, 5=crucial)")
    points_to: list = Field(default=[], description="Array of character names this clue implicates or relates to")
    metadata: dict = Field(description="Additional clue data as JSON object")


class TimelineEvent(BaseModel):
    """Timeline event data - matches database schema."""
    event_time: str = Field(description="When the event occurred (e.g., '9:00 PM', '2025-01-01T21:00:00')")
    event_description: str = Field(description="What happened during this event")
    location_id: str = Field(default=None, description="Name of location where event occurred")
    character_ids: list = Field(default=[], description="Array of character names involved in this event")
    event_type: str = Field(
        default="general", 
        description="Type of event. Options: murder, discovery, conversation, movement, general"
    )
    is_public: bool = Field(default=True, description="Whether this event is known to all characters")
    witness_ids: list = Field(default=[], description="Array of character names who witnessed this event")
    metadata: dict = Field(description="Additional event data as JSON object")


class GameSetup(BaseModel):
    """Complete game setup data for agent creation."""
    title: str = Field(description="Title of the murder mystery game")
    description: str = Field(description="Description of the murder mystery game setting the scene for the narrative")
    characters: list[Character] = Field(description="List of all characters in the game (3-6 characters recommended)")
    locations: list[Location] = Field(description="List of all locations in the game (4-8 locations recommended)")
    clues: list[Clue] = Field(description="List of all clues in the game (5-10 clues recommended)")
    timeline_events: list[TimelineEvent] = Field(description="Chronological sequence of events that occurred")
    opening_summary: str = Field(description="A one paragraph summary of the game setting the scene for the narrative")



class CharacterDataInput(BaseModel):
    game_id: str = Field(..., description="The game ID to search in")
    character_name: str = Field(..., description="Name of the character to retrieve")

class LocationDataInput(BaseModel):
    game_id: str = Field(..., description="The game ID to search in")
    location_name: str = Field(..., description="Name of the location to retrieve")

class CluesInLocationInput(BaseModel):
    game_id: str = Field(..., description="The game ID to search in")
    location_name: str = Field(..., description="Name of the location to get clues from")

class SearchCharactersInput(BaseModel):
    game_id: str = Field(..., description="The game ID to search in")
    search_term: str = Field(..., description="Partial or full character name to search for")

class TimelineEventsInput(BaseModel):
    game_id: str = Field(..., description="The game ID to get timeline events for")

class AllCluesInput(BaseModel):
    game_id: str = Field(..., description="The game ID to get all clues for")

class AllLocationDataInput(BaseModel):
    game_id: str = Field(..., description="The game ID to search in")

class ImageGenerationInput(BaseModel):
    prompt: str = Field(description="Detailed image generation prompt for DALL-E")
    image_type: Literal["character", "location" , "clue"] = Field(description="Type of image being generated")
    subject_name: str = Field(description="Name of the character or location being generated")
    game_id: str = Field(..., description="The game ID to create the image for")




class GameUpdate(BaseModel):
    """Single database update instruction."""
    table: str = Field(..., description="Database table to update (clues, timeline_events, characters, locations)")
    action: str = Field(..., description="Action to perform (discover, add, update, change_status)")
    data: dict = Field(..., description="Data to insert/update in the specified table")
    reasoning: str = Field(..., description="Why this update is needed")

class GameUpdateAnalysis(BaseModel):
    """Analysis of what database updates are needed after a game interaction."""
    updates: list[GameUpdate] = Field(default=[], description="List of database updates to perform")
    has_changes: bool = Field(..., description="Whether any game state changes occurred")
    summary: str = Field(..., description="Brief summary of what changed in the game")


class ImageGenerationOutput(BaseModel):
    name: str = Field(..., description="Name of the resource being generated")
    image_url: str = Field(..., description="URL of the generated image")   


# Database tools for Master Agent
class GetCharacterDataTool(BaseTool):
    name: str = "get_character_data"
    description: str = "Get character information from database by name and game_id"
    args_schema: Type[BaseModel] = CharacterDataInput
    
    def _run(self, game_id: str, character_name: str) -> str:
        """Get character data from database."""
        try:
            supabase = get_supabase_client()
            response = supabase.table("characters").select("*").eq("game_id", game_id).ilike("name", f"%{character_name}%").execute()
            
            if response.data:
                character = response.data[0]
                return json.dumps({
                    "name": character["name"],
                    "description": character["description"],
                    "personality": character["personality"],
                    "lie_policy": character["lie_policy"],
                    "is_killer": character["is_killer"],
                    "secrets": character["secrets"],
                    "relationships": character["relationships"],
                    "observations": character["observations"]
                })
            return "Character not found"
        except Exception as e:
            return f"Error retrieving character: {str(e)}"

class GetLocationDataTool(BaseTool):
    name: str = "get_location_data"
    description: str = "Get location information from database by name and game_id"
    args_schema: Type[BaseModel] = LocationDataInput
    
    def _run(self, game_id: str, location_name: str) -> str:
        """Get location data from database."""
        try:
            
            supabase = get_supabase_client()
            
         
            response = supabase.table("locations").select("*").eq("game_id", game_id).ilike("name", f"%{location_name}%").execute() #partial match
            
            if response.data:
                location = response.data[0]
                return json.dumps({
                    "name": location["name"],
                    "description": location["description"],
                    "is_accessible": location["is_accessible"],
                    "connected_locations": location["connected_locations"],
                    "atmosphere": location["atmosphere"]
                })
            return "Location not found"
        except Exception as e:
            return f"Error retrieving location: {str(e)}"




class GetCluesInLocationTool(BaseTool):
    name: str = "get_clues_in_location"
    description: str = "Get all clues available in a specific location"
    args_schema: Type[BaseModel] = CluesInLocationInput
    
    def _run(self, game_id: str, location_name: str) -> str:
        """Get clues in specific location."""
        try:
            supabase = get_supabase_client()
            response = supabase.table("clues").select("*").eq("game_id", game_id).eq("location_id", location_name).execute()
            
            clues = []
            for clue in response.data:
                clues.append({
                    "title": clue["title"],
                    "description": clue["description"],
                    "is_revealed": clue["is_revealed"],
                    "significance_level": clue["significance_level"],
                    "discovery_method": clue["discovery_method"]
                })
            return json.dumps(clues)
        except Exception as e:
            return f"Error retrieving clues: {str(e)}"

class SearchCharactersTool(BaseTool):
    name: str = "search_characters"
    description: str = "Search for characters by partial name match - handles typos and partial names"
    args_schema: Type[BaseModel] = SearchCharactersInput
    
    def _run(self, game_id: str, search_term: str) -> str:
        """Search characters with fuzzy matching."""
        try:
            supabase = get_supabase_client()
            response = supabase.table("characters").select("name").eq("game_id", game_id).execute()
            
            if not response.data:
                return "No characters found in this game"
            
            search_lower = search_term.lower().strip()
            matches = []
            
            for character in response.data:
                char_name = character["name"]
                char_lower = char_name.lower()
                
                # Exact match
                if search_lower == char_lower:
                    return f"Found exact match: {char_name}"
                
                # Partial matches
                if search_lower in char_lower:
                    matches.append(char_name)
                
                # First name or last name match
                name_parts = char_lower.split()
                search_parts = search_lower.split()
                
                for search_part in search_parts:
                    for name_part in name_parts:
                        if search_part in name_part:
                            if char_name not in matches:
                                matches.append(char_name)
            
            if matches:
                if len(matches) == 1:
                    return f"Found match: {matches[0]}"
                else:
                    return f"Multiple matches found: {', '.join(matches[:5])}"  # Limit to 5 results
            
            return f"No characters found matching '{search_term}'. Available characters: {', '.join([c['name'] for c in response.data])}"
            
        except Exception as e:
            return f"Error searching characters: {str(e)}"


class GetTimelineEventsTool(BaseTool):
    name: str = "get_timeline_events"
    description: str = "Get all timeline events for a game to see what has happened so far"
    args_schema: Type[BaseModel] = TimelineEventsInput
    
    def _run(self, game_id: str) -> str:
        try:
            supabase = get_supabase_client()
            
            response = supabase.table("timeline_events").select("*").eq("game_id", game_id).order("created_at", desc=False).execute()
            
            if not response.data:
                return json.dumps({"message": "No timeline events found for this game yet"})
            
            return json.dumps({"timeline_events": response.data})
            
        except Exception as e:
            return json.dumps({"error": f"Database error: {str(e)}"})

class GetAllCluesTool(BaseTool):
    name: str = "get_all_clues"
    description: str = "Get all clues in the game to see what has been discovered"
    args_schema: Type[BaseModel] = AllCluesInput
    
    def _run(self, game_id: str) -> str:
        try:
            supabase = get_supabase_client()
            
            response = supabase.table("clues").select("*").eq("game_id", game_id).execute()
            
            if not response.data:
                return json.dumps({"message": "No clues found for this game yet"})
            
            return json.dumps({"clues": response.data})
            
        except Exception as e:
            return json.dumps({"error": f"Database error: {str(e)}"})

class GetAllLocationDataTool(BaseTool):
    name: str = "get_location_data"
    description: str = "Get all location information from database by game_id"
    args_schema: Type[BaseModel] = AllLocationDataInput
    
    def _run(self, game_id: str) -> str:
        """Get location data from database."""
        try:
            supabase = get_supabase_client()
            response = supabase.table("locations").select("*").eq("game_id", game_id).execute()
            
            if response.data:
                location = response.data
                return json.dumps({
                    "name": location["name"],
                    "description": location["description"],
                    "is_accessible": location["is_accessible"],
                    "connected_locations": location["connected_locations"],
                    "atmosphere": location["atmosphere"]
                })
            return "No location data found for this game"
        except Exception as e:
            return f"Error retrieving location: {str(e)}"



class ImageTool(BaseTool):  # TODO: Rename to DalleImageTool
    name: str = "generate_mystery_image"
    description: str = "Generate atmospheric images for murder mystery characters and locations using DALL-E 3"
    args_schema: Type[BaseModel] = ImageGenerationInput
    
    def _run(self, prompt: str, image_type: str, subject_name: str, game_id: str) -> str:
        """Generate image using DALL-E 3 via OpenAI and upload to Supabase Storage."""
        try:


            safe_name = f"{subject_name.lower().replace(" ", "-").replace("'", "")}.png"
            filename = f"{image_type}s/{game_id}/{safe_name}"
            supabase = get_supabase_client()

            #check if image already exists
            folder = f"{image_type}s/{game_id}"
            files = supabase.storage.from_("game-images2").list(folder)
            

            if any(f["name"] == safe_name for f in files):
                print(f"✅ Image already exists: {filename}")
                public_url = supabase.storage.from_("game-images2").get_public_url(filename)
                return public_url



            
            print(f"🎨 Generating {image_type} image for: {subject_name}")
            
            # DALL-E 3 via OpenAI API
            print(f"🎯 Calling DALL-E API")
            
            # Get OpenAI API key
            openai_key = os.getenv("OPENAI_API_KEY")
            if not openai_key:
                print("❌ OPENAI_API_KEY not found in environment variables")
                return None
            
            openai.api_key = openai_key
            
            # Call DALL-E 3
            response = openai.images.generate(
                model="dall-e-3",
                prompt=prompt,
                size="1024x1024",
                quality="standard",
                n=1
            )
            
            print(f"✅ DALL-E generated image successfully")
            
            # Download image from temporary URL
            temp_url = response.data[0].url
            img_response = requests.get(temp_url, timeout=30)
            img_response.raise_for_status()
            image_data = img_response.content
            
            # # COMMENTED FLUX CODE:
            # # Get HuggingFace API token
            # hf_token = os.getenv("HUGGINGFACE_API_TOKEN")
            # if not hf_token:
            #     print("❌ HUGGINGFACE_API_TOKEN not found in environment variables")
            #     return None
            # 
            # # Call Flux via Hugging Face Inference API
            # print(f"🎯 Calling Flux API ")
            # client = InferenceClient(api_key=hf_token)
            # image = client.text_to_image(
            #     prompt,
            #     model="black-forest-labs/FLUX.1-dev",
            #     width=1024,
            #     height=1024
            # )
            # 
            # print(f"✅ Flux generated image successfully")
            # 
            # # Convert PIL Image to bytes for upload
            # img_bytes = io.BytesIO()
            # image.save(img_bytes, format='PNG')
            # image_data = img_bytes.getvalue()
            
            # Upload directly to Supabase Storage
            permanent_url = self._upload_to_supabase(image_data, filename, subject_name)
            
            print(f"Returning permanent URL: {permanent_url}")
            return permanent_url
            
        except Exception as e:
            print(f"❌ Flux Error for {subject_name}: {str(e)}")
            return None
    
    def _upload_to_supabase(self, image_data: bytes, filename: str, subject_name: str) -> str:
        """Upload image bytes directly to Supabase Storage bucket."""
        try:
            
            
            # Upload to Supabase Storage
            supabase = get_supabase_client()
            try:
                storage_response = supabase.storage.from_("game-images2").upload(
                filename, 
                image_data, 
                {"content-type": "image/png"}
            )
                print(f"✅ Uploaded image in bucket")
            except Exception as e:
                    print(f"❌ Storage upload error: {str(e)}")
                    return None
            
            # Get public URL
            public_url = supabase.storage.from_("game-images2").get_public_url(filename)
            return public_url
            
        except Exception as e:
            print(f"❌ Upload error for {subject_name}: {str(e)}")
            return None










