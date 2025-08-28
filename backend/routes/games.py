"""Game management routes."""

from fastapi import APIRouter, HTTPException
from database.client import get_supabase_client

router = APIRouter()

@router.get("/")
async def get_games():
    """Get all games for the current user."""
    try:
        supabase = get_supabase_client()
        response = supabase.table("games").select("*").execute()
        return {"games": response.data} #Automatically sets status code to 200
    except Exception as e:
        raise HTTPException(500, f"Failed to fetch games: {str(e)}")




