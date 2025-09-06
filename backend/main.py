from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

# Import routers
from routes.games import router as games_router
from routes.agents import router as agents_router

# Load environment variables
load_dotenv()

app = FastAPI(title="Murder Mystery AI Backend", version="1.0.0")

# Configure CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000","https://murder-mystery-app.vercel.app"],  # Next.js frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(games_router, prefix="/api/games", tags=["games"])
app.include_router(agents_router, prefix="/api/agents", tags=["agents"])

@app.get("/")
async def root():
    return {"message": "Murder Mystery AI Backend is running!"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "murder-mystery-backendddddd"}


@app.exception_handler(404)
async def custom_404_handler(request: Request, exc):
    return JSONResponse(
        status_code=404,
        content={
            "error": "Endpoint not found",
            "path": str(request.url.path),
            "method": request.method
        }
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
