from crewai import Agent, Task, Crew, Process   
from classes import GameUpdateAnalysis, GetCharacterDataTool, GetLocationDataTool, GetCluesInLocationTool, SearchCharactersTool, GetTimelineEventsTool, GetAllCluesTool, GetAllLocationDataTool

# Update Analysis Agent with database tools
update_agent = Agent(
    role="Game State Analyzer",
    goal="Analyze game interactions against current game state to determine what database updates are needed",
    allow_delegation=False,
    tools=[GetCharacterDataTool(), GetLocationDataTool(), GetCluesInLocationTool(), SearchCharactersTool(), GetTimelineEventsTool(), GetAllCluesTool(), GetAllLocationDataTool()],
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

    ANALYSIS PROCESS:
    1. Use tools to check current state of relevant game elements
    2. Compare current state with what the interaction suggests happened
    3. Identify genuine changes that need database updates
    4. Avoid duplicate updates for things that already exist
    
    WHAT TO LOOK FOR:
    - NEW clues discovered (check if clue already exists first)
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
        
        STEP 1: Use your tools to check current game state
        - If interaction mentions characters, use get_character_data or search_characters
        - If interaction mentions locations, use get_location_data
        - If interaction mentions finding something, use get_clues_in_location or get_all_clues to see what's already there
        - Use get_timeline_events to see what events have already been recorded
        - Use get_all_clues to see all discovered clues and avoid duplicates
        
        STEP 2: Compare interaction with current state
        Examine BOTH the player query AND AI response to determine:
        1. Did the player discover any NEW clues? (check if already exists)
        2. Did the player reveal any information worth recording?
        3. Did any character status change?
        4. Did any locations become accessible/inaccessible?
        5. Should any timeline events be recorded?
        6. Were any character secrets revealed?
        7. Were any character relationships/conversations revealed?
        
        STEP 3: Only suggest updates for actual changes between the current state and the interaction
        EXAMPLES:
        - AI says "You find a bloody knife" → Check if knife already in clues → If not, ADD clue
        - Player says "I think John is the killer" → ADD timeline_event (player theory)
        - AI says "The door is now unlocked" → Check location accessibility → If changed, UPDATE location
        
        For each update:
        - Specify exact table (clues, timeline_events, characters, locations)
        - Specify action (insert, update, delete)
        - Provide data to insert/update/delete
        - Give clear reasoning based on your tool checks
        
        Use your database tools to avoid duplicate updates!
        """,
        expected_output="Structured analysis of required database updates",
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
