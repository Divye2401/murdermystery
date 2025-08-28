# Supabase Python Client Reference

## Setup

```python
from supabase import create_client, Client

supabase: Client = create_client(url, key)
```

## Basic CRUD Operations

| Operation  | Supabase Python | Example                                                                    |
| ---------- | --------------- | -------------------------------------------------------------------------- |
| **Select** | `.select()`     | `supabase.table("games").select("*").execute()`                            |
| **Insert** | `.insert()`     | `supabase.table("games").insert({"title": "Mystery"}).execute()`           |
| **Update** | `.update()`     | `supabase.table("games").update({"status": "done"}).eq("id", 1).execute()` |
| **Delete** | `.delete()`     | `supabase.table("games").delete().eq("id", 1).execute()`                   |

## Filtering

| Filter           | Supabase  | Example                                 |
| ---------------- | --------- | --------------------------------------- |
| **Equal**        | `.eq()`   | `.eq("status", "active")`               |
| **Not equal**    | `.neq()`  | `.neq("status", "deleted")`             |
| **Greater than** | `.gt()`   | `.gt("score", 100)`                     |
| **Less than**    | `.lt()`   | `.lt("age", 18)`                        |
| **Like**         | `.like()` | `.like("name", "%john%")`               |
| **In**           | `.in_()`  | `.in_("status", ["active", "pending"])` |
| **Is null**      | `.is_()`  | `.is_("deleted_at", "null")`            |

## Advanced Queries

| Operation    | Supabase                  | Example                                 |
| ------------ | ------------------------- | --------------------------------------- |
| **Order by** | `.order()`                | `.order("created_at", desc=True)`       |
| **Limit**    | `.limit()`                | `.limit(10)`                            |
| **Range**    | `.range()`                | `.range(0, 9)` # First 10 rows          |
| **Count**    | `.execute(count="exact")` | `.select("*", count="exact").execute()` |

## Joins & Relations

| Type            | Supabase                 | Example                                        |
| --------------- | ------------------------ | ---------------------------------------------- |
| **Foreign key** | Select with relationship | `.select("*, characters(name)")`               |
| **Nested**      | Multiple levels          | `.select("*, characters(*, locations(name))")` |

## Real-time Subscriptions

```python
# Subscribe to changes
def handle_changes(payload):
    print(f"Change: {payload}")

supabase.table("games").on("INSERT", handle_changes).subscribe()
```

## Authentication

| Operation    | Supabase                        | Example                                                                    |
| ------------ | ------------------------------- | -------------------------------------------------------------------------- |
| **Sign up**  | `.auth.sign_up()`               | `supabase.auth.sign_up({"email": "...", "password": "..."})`               |
| **Sign in**  | `.auth.sign_in_with_password()` | `supabase.auth.sign_in_with_password({"email": "...", "password": "..."})` |
| **Sign out** | `.auth.sign_out()`              | `supabase.auth.sign_out()`                                                 |
| **Get user** | `.auth.get_user()`              | `supabase.auth.get_user()`                                                 |

## Error Handling

```python
try:
    response = supabase.table("games").select("*").execute()
    return response.data
except Exception as e:
    print(f"Error: {e}")
```

## Response Structure

```python
response = supabase.table("games").select("*").execute()

# Access data
data = response.data          # List of records
count = response.count        # Total count (if requested)
```

## Common Patterns

### Get all with filtering:

```python
games = (supabase.table("games")
         .select("*")
         .eq("user_id", user_id)
         .eq("status", "active")
         .order("created_at", desc=True)
         .execute())
```

### Insert with return:

```python
new_game = (supabase.table("games")
            .insert({"title": "New Mystery", "user_id": "123"})
            .execute())
game_id = new_game.data[0]["id"]
```

### Update with conditions:

```python
updated = (supabase.table("games")
           .update({"status": "completed", "updated_at": "now()"})
           .eq("id", game_id)
           .eq("user_id", user_id)  # Security check
           .execute())
```

### Batch operations:

```python
# Insert multiple
characters = [
    {"name": "Detective", "game_id": game_id},
    {"name": "Butler", "game_id": game_id}
]
supabase.table("characters").insert(characters).execute()
```

### Complex queries:

```python
# Get games with character count
games_with_chars = (supabase.table("games")
                    .select("*, characters(count)")
                    .eq("user_id", user_id)
                    .execute())
```

## Storage (Files)

| Operation    | Supabase                      | Example                                                           |
| ------------ | ----------------------------- | ----------------------------------------------------------------- |
| **Upload**   | `.storage.from_().upload()`   | `supabase.storage.from_("avatars").upload("file.jpg", file_data)` |
| **Download** | `.storage.from_().download()` | `supabase.storage.from_("avatars").download("file.jpg")`          |
| **Delete**   | `.storage.from_().remove()`   | `supabase.storage.from_("avatars").remove(["file.jpg"])`          |

## Environment Variables

```python
import os
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
SUPABASE_SERVICE_ROLE = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
```

## Murder Mystery App Examples

### Get game with all related data:

```python
game_data = (supabase.table("games")
             .select("*, characters(*), locations(*), clues(*)")
             .eq("id", game_id)
             .execute())
```

### Search clues by keyword:

```python
clues = (supabase.table("clues")
         .select("*")
         .eq("game_id", game_id)
         .ilike("description", f"%{keyword}%")
         .limit(10)
         .execute())
```

### Log interaction:

```python
interaction = {
    "game_id": game_id,
    "actor": "player",
    "user_query": "Ask Detective about the murder",
    "agent_response": "I was in the library...",
    "created_at": "now()"
}
supabase.table("interactions").insert(interaction).execute()
```
