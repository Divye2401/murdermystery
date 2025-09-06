from crewai import Agent, Task, Crew, Process   
from classes import GameUpdateAnalysis, GetCharacterDataTool, GetLocationDataTool, GetCluesInLocationTool, SearchCharactersTool, GetTimelineEventsTool, GetAllCluesTool, GetAllLocationDataTool, ImageTool

# Update Analysis Agent with database tools
update_agent = Agent(
    role="Game State Analyzer",
    goal="Analyze game interactions against current game state to determine what database updates are needed",
    allow_delegation=False,
    tools=[GetCharacterDataTool(), GetLocationDataTool(), GetCluesInLocationTool(), SearchCharactersTool(), GetTimelineEventsTool(), GetAllCluesTool(), GetAllLocationDataTool(),ImageTool()],
    backstory="""You are a specialized analyst for murder mystery games. Your job is to:

    1. CHECK CURRENT GAME STATE using your database tools
    2. COMPARE with what happened in the player interaction
    3. DETERMINE what actually changed and needs updating
    
    YOUR TOOLS:
    - get_character_data: Get current character information
    - get_location_data: Get current location information  
    - get_clues_in_location: See what clues already exist in a location
    - search_characters: Find characters by name
    - get_timeline_events: See all events that have happened in the game so far
    - get_all_clues: See all clues that have been discovered in the game
    - get_all_location_data: See all location data for the game
    - generate_mystery_image: Generate a mystery image for a clue/location/character

    ANALYSIS PROCESS:
    1. Use tools to check current state of relevant game elements
    2. Compare current state with what the interaction suggests happened
    3. Identify genuine changes that need database updates
    4. Avoid duplicate updates for things that already exist
    
    WHAT TO LOOK FOR:
    - NEW clues discovered or current clues updated to is_revealed: true(check if clue already exists first)
    - Character status changes (check current status first)
    - Location accessibility changes (check current state first)
    - Important events for timeline (check if similar event exists)
    - Character relationships/conversations (check if character has relationship with another character)
    - Character personality/secrets/motivations updates (check if character speaks about their personality, secrets, or motivations)
    
    IMPORTANT:
    - Always check current state before suggesting updates
    - Don't suggest updates for things that already exist
    - Be conservative - when in doubt, don't update
    - Provide clear reasoning for each suggested update""",
    verbose=True,
    memory=False
)

async def analyze_for_updates(game_id: str, player_query: str, ai_response: str) -> GameUpdateAnalysis:
    """Analyze a game interaction to determine what database updates are needed."""
    
    analysis_task = Task(
        description=f"""Analyze this game interaction to determine what database updates are needed.

        GAME ID: {game_id}
        PLAYER QUERY: {player_query}
        AI RESPONSE: {ai_response}
        
        STEP 1: MANDATORY - Use your tools to check current game state BEFORE suggesting any updates
        - If interaction mentions characters, use get_character_data or search_characters
        - If interaction mentions locations, use get_location_data
        - If interaction mentions finding something, ALWAYS use get_all_clues FIRST to see what already exists
        - Use get_timeline_events to see what events have already been recorded
        - CRITICAL: Use get_all_clues to see all discovered clues and prevent duplicates
        
        STEP 2: Compare interaction with current state
        Examine BOTH the player query AND AI response to determine:
        1. Did the player discover any NEW clues? (check if already exists)
        2. Did the player reveal any information worth recording?
        3. Did any character status change?
        4. Did any locations become accessible/inaccessible?
        5. Should any timeline events be recorded?
        6. Were any character secrets/traits revealed?
        7. Were any character relationships/conversations revealed?
        
        STEP 3: Only suggest updates for actual changes between the current state and the interaction
        DUPLICATE PREVENTION EXAMPLES:
        - AI says "You find a bloody knife" → FIRST check get_all_clues for "knife" → If knife already exists, DO NOT INSERT, just UPDATE is_revealed if needed
        - AI says "You discover a letter" → FIRST check get_all_clues for "letter" → If letter already exists, DO NOT INSERT
        - Player says "I think John is the killer" → Check timeline_events for similar theory → If similar exists, DO NOT INSERT
        
        ONLY INSERT NEW RECORDS IF:
        1. You used get_all_clues and confirmed the clue title does NOT exist
        2. You used get_timeline_events and confirmed similar event does NOT exist
        
        For each update:
        - Specify exact table (clues, timeline_events, characters, locations)
        - Specify action (insert, update, delete)
        - Provide data to insert/update/delete 
        - Give clear reasoning based on your tool checks

        In your image generation, make sure to include to create realistic, high definition images, detailed charcteristics, related to game setting.
        
        IMPORTANT: If providing New Locations, make sure to generate an image for the location using generate_mystery_image.
        IMPORTANT: If providing New Characters or asked to provide character images, make sure to generate an image for the character using generate_mystery_image.
        IMPORTANT: If providing Newclues, make sure to generate an image for the clue using generate_mystery_image.

        IMPORTANT: If providing timeline events, make sure event_time is the latest chronologically.
        IMPORTANT: Provide data strictly in the format of GameUpdateAnalysis, nothing extra.
        CRITICAL: ALWAYS use get_all_clues tool BEFORE inserting any clue. Do NOT INSERT if it already exists, JUST UPDATE!
        CRITICAL: ALWAYS use get_timeline_events tool BEFORE inserting any timeline event. Do NOT INSERT duplicates!
        IMPORTANT: Only provide existing columns in the database, do not make up columns.
        IMPORTANT: For updates/deletes, provide the actual database 'id' field (UUID) from your tool queries, NOT the name. 

       
        """,
        expected_output="Structured analysis of required database updates in the format of GameUpdateAnalysis",
        agent=update_agent,
        output_pydantic=GameUpdateAnalysis
    )
    
    crew = Crew(
        agents=[update_agent],
        tasks=[analysis_task],
        process=Process.sequential,
        verbose=True
    )
    
    result = await crew.kickoff_async()
    return result.raw
