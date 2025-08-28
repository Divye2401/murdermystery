
import os
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Supabase configuration
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
    raise ValueError("Missing required Supabase environment variables: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY")

# Create admin Supabase client
supabase_admin= create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)


def get_supabase_client():
    """Get the admin Supabase client with service role privileges."""
    return supabase_admin
