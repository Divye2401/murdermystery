"""AI Agent interaction routes."""

from fastapi import APIRouter, HTTPException



router = APIRouter()



@router.get("/test")
async def test_agent():
    """Test the agent."""
    try:
        
        return {"message": "Agent test successful"}
    except Exception as e: #Equvalent to Error class in JS
        raise HTTPException(500, f"Failed to fetch interactions: {str(e)}")
        #Could equally do
        #JSONResponse(status_code=500, content={"message": result})
