from crewai import Agent, Task, Crew, Process, LLM
import os
from pathlib import Path
from classes import GetCharacterDataTool, GetLocationDataTool, GetCluesInLocationTool, SearchCharactersTool, GetTimelineEventsTool, GetAllCluesTool, GetAllLocationDataTool



# Master Agent
llm = LLM(model="gpt-4o")

master_agent = Agent(
    role="Game Master Orchestrator",
    goal="Coordinate murder mystery game interactions and maintain game state consistency",
    allow_delegation=True, # Manager cannot have tools
    backstory="""You are the Game Master of a murder mystery game. You coordinate all interactions between 
    players and the game world. 


    Available Team Members:
    - Database Query Specialist (database_agent)
    - Character Roleplay Specialist (character_agent)
    Follow the correct tool usage format when delegating tasks.

    Provide output strictly in the format of GameResponse.
    Follow the correct tool usage format when delegating tasks.
    Use the exact role names above when delegating tasks.
    Only use the approriate members needed to complete the task.
    When sending to roleplay, send relevant information about the characters personality, secrets, lying policy, and motivations also to the character agent. Respond IN FIRST PERSON IF roleplaying.
    If the character is dead, say so and do not roleplay.

    
    
    Very important: If you cannot find the information, say so and do not make up information.


    You coordinate the entire game experience and ensure all interactions are realistic and consistent 
    with the murder mystery story.""",
    verbose=True,
    max_iter=20,
    llm=llm
    )

database_agent = Agent(
    role="Database Query Specialist",
    goal="Retrieve accurate game data from the database when requested by the Game Master",
    allow_delegation=False,
    tools=[GetCharacterDataTool(), GetLocationDataTool(), GetCluesInLocationTool(), SearchCharactersTool(), GetTimelineEventsTool(), GetAllCluesTool(), GetAllLocationDataTool()],
    backstory="""You are a database specialist for the murder mystery game. You have access to all game data 
    and can retrieve information about characters, locations, clues, and timeline events.
    

    SearchCharactersTool is used to search for characters by partial name match - handles typos and partial names.
    GetCharacterDataTool is used to get character data by name and game_id.
    GetLocationDataTool is used to get location data by name and game_id. (Accepts location name as a string)
    GetCluesInLocationTool is used to get clues in a specific location.
    GetTimelineEventsTool is used to get all timeline events for the game.
    GetAllCluesTool is used to get all clues discovered in the game.
    GetAllLocationDataTool is used to get all location data for the game.

    

    Always provide the retrieved data in a clear, structured format that the Game Master can use to 
    coordinate the game experience.
    IMPORTANT: If you cannot find the information, say so and do not make up information.""",
    verbose=True,
   
    
)

character_agent = Agent(
    role="Character Roleplay Specialist",
    goal="Authentically roleplay murder mystery characters based on their personality, secrets, and motivations",
    allow_delegation=False,
    backstory="""You are a master of character roleplay in murder mystery games. You bring characters to life 
    by embodying their personalities, speaking in their voice, and reacting according to their secrets and motivations.
    
    

    1. Respond AS the character in first person
    2. Consider their personality and background
    3. Be influenced by their lie_policy (honest characters tell truth, evasive avoid topics, deceptive mislead, pathological lie constantly)
    4. Keep secrets hidden unless there's strong reason to reveal
    5. React authentically to the situation
    6. Stay in character throughout the interaction
    
    Your responses should be realistic dialogue and actions that this character would actually say and do.""",
    verbose=True,
   
)

# Database Agent - handles all tool-based data retrieval  


def handle_query(game_id: str, player_query: str, conversation_history: list = None):
    """Handle a player query in the game along with the conversation history."""


    
    # Task for character interaction
    interaction_task = Task(
        description=f"""Handle player interaction in game 
        Use the game_id: {game_id} to get the game data.
        Player query: {player_query}
        Conversation history: {conversation_history}- Use this to figure out the current context in relation to the players query.
        
        Analyze the player query to determine:
        1. What the player wants to do
        2. Who they want to interact with (if any)
        3. What location they're referencing (if any)
        4. What information you need from the database
        5. Delegate to appropriate specialist agents with proper formatting
        
        Use the database agent to get information about the game and the characters.
        Use the character agent to roleplay the characters.
        Use the correct ID {game_id} when using the tools.

        Remeber to format the requests to the delegated agents properly.
        task (string): The task to delegate 
        context (string): The context for the task
        coworker (string): The role/name of the coworker to delegate to

        Do not include game_id or any image urls in the final output to the player.
        Do not answer any direct questions about the killer to the player.
        If u feel the game has been solved via player query, respond with "SOLVED" as the last word and provide a summary of the solved game.
        


        """,
        expected_output="Complete response to player query with authentic game world interaction",
        
        max_retries=3
    )
    
    # Create the crew
    crew = Crew(
        agents=[database_agent, character_agent],
        tasks=[interaction_task],
        process=Process.hierarchical,
        manager_agent=master_agent,
        verbose=True,
        
    )


    
    
    result = crew.kickoff()
    return result.raw
