"""AI Agent interaction routes."""

from fastapi import APIRouter, HTTPException
from agents.sampleagent import run_agent


router = APIRouter()



@router.get("/test")
async def test_agent():
    """Test the agent."""
    try:
        result = run_agent()
        return {"message": result}
    except Exception as e:
        raise HTTPException(500, f"Failed to fetch interactions: {str(e)}")
