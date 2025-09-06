import json
from typing import List, Dict
from classes import ImageTool
import asyncio

# Initialize the image generation tool directly
image_tool = ImageTool()

async def generate_character_images(characters: List[Dict], game_id: str, game_title: str) -> Dict:
    """Generate images for all characters using direct API calls."""
    print(f"🎨 Starting character image generation for {len(characters)} characters")
    
    results = {}
    
    # Generate images for each character
    for character in characters:
        character_name = character.get("name", "Unknown")
        character_description = character.get("description", "")
        
        # Create detailed prompt for character
        prompt = f"Portrait of {character_name}, {character_description}, realistic style, good lighting, detailed facial features, unique appearance, high quality digital art, {game_title} setting"
        
        try:
            print(f"🎨 Generating image for character: {character_name}")
            
            # Call the image tool directly
            image_url = image_tool._run(
                prompt=prompt,
                image_type="character",
                subject_name=character_name,
                game_id=game_id
            )
            
            if image_url:
                results[character_name] = image_url
                print(f"✅ Generated image for {character_name}")
            else:
                print(f"❌ Failed to generate image for {character_name}")
                
        except Exception as e:
            print(f"❌ Error generating image for {character_name}: {str(e)}")
    
    print(f"🎨 Completed character image generation. Generated {len(results)} images.")
    return results

async def generate_location_images(locations: List[Dict], game_id: str, game_title: str) -> Dict:
    """Generate images for all locations using direct API calls."""
    print(f"🎨 Starting location image generation for {len(locations)} locations")
    
    results = {}
    
    # Generate images for each location
    for location in locations:
        location_name = location.get("name", "Unknown")
        location_description = location.get("description", "")
        atmosphere = location.get("atmosphere", "mysterious")
        
        # Create detailed prompt for location (most risky to safest)
        prompt1 = f"{location_name}, {location_description}, {atmosphere} atmosphere, murder mystery setting, dramatic shadows, detailed architecture, realistic style, high quality digital art, {game_title} setting"
        prompt2 = f"{location_name}, {location_description}, {atmosphere} atmosphere, investigation scene, dramatic lighting, detailed architecture, realistic style, high quality digital art, {game_title} setting"
        prompt3 = f"{location_name}, {location_description}, {atmosphere} atmosphere, mysterious location photography, vintage aesthetic, dramatic lighting, detailed architecture, high quality digital art, {game_title} setting"
        

            
         
        for index, prompt in enumerate([prompt1, prompt2, prompt3]):

            try:
                image_url = image_tool._run(
                    prompt=prompt,
                    image_type="location",
                    subject_name=location_name,
                    game_id=game_id
                )
                
                if image_url:
                    results[location_name] = image_url
                    print(f"✅ Generated image for {location_name}")
                    break
                else:
                    print(f"❌ Failed to generate image for {location_name} with prompt no. {index+1}")
                
            except Exception as e:
                print(f"❌ Error generating image for {location_name} with prompt no. {index+1}: {str(e)}")

    
    print(f"🎨 Completed location image generation. Generated {len(results)} images.")
    return results

async def generate_clue_images(clues: List[Dict], game_id: str, game_title: str) -> Dict:
    """Generate images for all clues using direct API calls."""
    print(f"🎨 Starting clue image generation for {len(clues)} clues")
    
    results = {}
    
    # Generate images for each clue
    for clue in clues:
        clue_name = clue.get("title", "Unknown")
        clue_description = clue.get("description", "")
        
        
        # Create detailed prompt for clue/evidence
        prompt1 = f"{clue_name}, {clue_description}, evidence photo, crime scene style, realistic detailed close-up, forensic photography style, high quality digital art, {game_title} setting"
        prompt2 = f"{clue_name}, {clue_description}, investigation documentation, detective scene style, realistic detailed close-up, professional photography style, high quality digital art, {game_title} setting"
        prompt3 = f"{clue_name}, {clue_description}, mysterious object photography, vintage mystery aesthetic, dramatic lighting, detailed close-up, high quality digital art, {game_title} setting"
        
        for index, prompt in enumerate([prompt1, prompt2, prompt3]):
            try:
                print(f"🎨 Generating image for clue: {clue_name} (attempt {index+1})")
                
                # Call the image tool directly
                image_url = image_tool._run(
                    prompt=prompt,
                    image_type="clue",
                    subject_name=clue_name,
                    game_id=game_id
                )
                
                if image_url:
                    results[clue_name] = image_url
                    print(f"✅ Generated image for {clue_name}")
                    break
                else:
                    print(f"❌ Failed to generate image for {clue_name} with prompt no. {index+1}")
                    
            except Exception as e:
                print(f"❌ Error generating image for {clue_name} with prompt no. {index+1}: {str(e)}")
        
    print(f"🎨 Completed clue image generation. Generated {len(results)} images.")
    return results