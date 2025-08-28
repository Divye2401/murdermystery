from crewai import Agent, Task, Crew

# Define the agent
agent = Agent(
    role="A detective",
    goal="Investigate the murder of the victim",
    backstory="You are a detective investigating a murder. You are given a case file and you need to investigate the murder.",
    
)

def run_agent():
    return agent.kickoff("What is the murder weapon?")






