from crewai import Agent, Task, Crew
from classes import GameSetup
import json

# Define the game creation agent
game_creator_agent = Agent(
    role="Murder Mystery Game Creator",
    goal="Create engaging and well-structured murder mystery games with complex characters, interesting locations, and compelling clues",
    backstory="""You are a master storyteller and game designer specializing in murder mystery games. 
    You create intricate plots with believable characters, each with their own motives, secrets, and alibis.
    You design atmospheric locations that enhance the mystery, and you craft clues that lead players 
    through a logical but challenging investigation. Your games are known for their plot twists,
    red herrings, and satisfying conclusions.""",
    verbose=True,
    allow_delegation=False
)

def create_murder_mystery_game(title: str, description: str, character_count: str):
    """Create a complete murder mystery game using CrewAI."""
    
    # Create the task with detailed instructions
    creation_task = Task(
        description=f"""Create a complete murder mystery game with the following requirements:
        
        GAME DETAILS:
        - Title: {title}
        - Setting Description: {description}
        - Character Count: {character_count}

        REQUIREMENTS:
        1. Create {character_count} unique characters with distinct personalities, backgrounds, and motives (The victim has to be mandatorily included in the character count)
        2. Designate exactly ONE character as the killer (is_killer: true)
        3. Designate exactly ONE character as the victim (is_victim: true)
        4. Create 5-8 atmospheric locations that fit the setting
        5. Designate exactly ONE location as the murder location (is_murder_location: true)
        6. Generate 5-7 clues of varying importance (significance_level 1-5)
        7. Create a chronological timeline of events leading to and including the murder
        8. Ensure characters have believable relationships and secrets
        9. Make sure clues point to different characters to create red herrings
        
        CHARACTER GUIDELINES:
        - Victim cannot be the killer, Victim is always dead(is_alive: false), Killer is always alive(is_alive: true)
        - Each character needs a unique lie_policy: honest, evasive, deceptive, or pathological
        - Give characters realistic secrets and relationships
        - The killer should have a clear motive and opportunity
        - Create believable alibis and contradictions
        - Have 1-2 observations of the environment/other characters
        - Make sure the relationships clearly mention the characters by their names and not by reference to the character type
        - IMPORTANT: Also include the victim character within the characters list 

        
        CLUE GUIDELINES:
        - Mix significance levels: some crucial (4-5), some minor (1-2)
        - Use different discovery methods: investigation, witness, forensics, confession, accident
        - Make clues point to multiple characters for suspense
        
        TIMELINE GUIDELINES:
        - Include events leading up to the murder
        - Show character movements and interactions
        - Include the murder event itself
        - Add discovery of the body
        - Use realistic timestamps (in ISO Format YYYY-MM-DDTHH:MM:SSZ)
        - Make sure the events are not duplicated
        - Characted Ids should containt the names of the characters
        - Make sure the timeline matches the victim correctly
        
        Return the complete game data following the GameSetup schema with all required fields properly structured.
        """,
        agent=game_creator_agent,
        expected_output="A complete GameSetup object containing title, description, characters, locations, clues, timeline_events, and opening_summary with all required fields",
        output_pydantic=GameSetup
    )
    
    # Create the crew and execute
    game_creation_crew = Crew(
        agents=[game_creator_agent],
        tasks=[creation_task],
        verbose=True
    )
    
    # Execute the task
    result = game_creation_crew.kickoff()
    
    return result










