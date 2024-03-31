# Load environment variables
from dotenv import load_dotenv

load_dotenv()

# Standard library imports
import asyncio
import os


# Third-party library imports for asynchronous operations
import asyncio

import time
from helper import *


async def generate(file_path):
    input_file_path = file_path
    client = AsyncAnthropic(
        # This is the default and can be omitted
        api_key=os.environ.get("ANTHROPIC_API_KEY"),
    )

    # Initialize the data dictionary
    script = None
    music = None
    images = None
    pictures = None
    captions = None

    # This section transcribes the audio from the input file
    cur_time = time.time()
    chunks = convert_audio_to_chunks(input_file_path)
    transcripts = await transcribe_audio_chunks(chunks)
    text = ""
    for transcript in transcripts:
        text += "(" + str(transcript["start"]) + "): " + transcript["text"] + " "

    print("Transcription took: ", time.time() - cur_time)

    # This section uses the text to generate a script
    cur_time = time.time()

    async def generate_text(text, script):
        message = await client.messages.create(
            temperature=0,
            max_tokens=512,
            messages=[
                {
                    "role": "user",
                    "content": text + script,
                },
                {"role": "assistant", "content": "<"},
            ],
            model="claude-3-opus-20240229",
        )

        return message.content

    response = await generate_text(text, prompt)
    script = f"<{response[0].text}"

    async def generate_text(text, script):
        message = await client.messages.create(
            temperature=0,
            max_tokens=64,
            messages=[
                {
                    "role": "user",
                    "content": text + script,
                },
            ],
            model="claude-3-opus-20240229",
        )

        return message.content

    response = await generate_text(script, music_prompt)
    music = response[0].text
    print("Script generation took: ", time.time() - cur_time)

    async def generate_helper(script):
        # Generating the talking head
        headshot = await post_talk(script)
        # Generates pictuers and captions for the video
        images, pictures, captions = await process_video_and_generate_images(headshot)
        return headshot, images, pictures, captions

    cur_time = time.time()
    music_result, headshot_result = await asyncio.gather(
        async_generate_music(music),
        generate_helper(script),
    )
    print("Music and headshot generation took: ", time.time() - cur_time)
    music = music_result
    headshot, images, pictures, captions = headshot_result

    # Edit the video
    cur_time = time.time()
    duration = edit_video(headshot, captions, pictures, images, music)
    print("Video editing took: ", time.time() - cur_time)
    return int(duration)


# await generate("data/short_dsa.mp4")
