from crewai import Agent, Task, Crew


agent = Agent(
    role="Game Summarizer",
    goal="Summarize the recent game state",
    backstory="You are an expert in summarizing interaction history. You will be given the recent interactions so far. You will need to summarize them in a way that is easy to understand and use.",
    verbose=True,
)



def summarize_game_state(interactions: list):
    """Summarize the recent game state."""
    task = Task(
    description=f"""Summarize the recent game state concisely without missing any important information on who said what. The summary should be in a way that is easy to understand and use.
    Interactions: {interactions}""",
    expected_output="A summary of the recent game state",
    agent=agent,
)
    crew = Crew(agents=[agent], tasks=[task])
    result = crew.kickoff()
    return result.raw






