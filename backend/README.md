# Murder Mystery AI Backend

Python FastAPI backend for the Murder Mystery game with CrewAI agents.

## Setup

1. Create a virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Create `.env` file with your keys:

```
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
OPENAI_API_KEY=your_openai_api_key
```

4. Run the server:

```bash
python main.py
```

The backend will run on http://localhost:8000

## Project Structure

- `main.py` - FastAPI application entry point
- `agents/` - CrewAI agents (Master, Narrator, Character, Location, Clue)
- `models/` - Pydantic models for API contracts
- `database/` - Supabase client and database utilities
- `tools/` - Master agent tools for database operations
