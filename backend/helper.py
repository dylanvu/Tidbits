# Load environment variables
from dotenv import load_dotenv

load_dotenv()

# Standard library imports
import asyncio
import base64
import json
import os
import re
import tempfile
from datetime import datetime, timedelta
from io import BytesIO
from textwrap import wrap
from concurrent.futures import ThreadPoolExecutor
from xml.sax.saxutils import escape

# Third-party library imports for asynchronous operations
import aiohttp
import asyncio
import nest_asyncio

nest_asyncio.apply()
import contextlib


# Data handling and visualization imports
import numpy as np
import matplotlib.pyplot as plt
from PIL import Image

# Moviepy for video editing and handling
from moviepy.editor import (
    AudioFileClip,
    CompositeAudioClip,
    CompositeVideoClip,
    ColorClip,
    ImageClip,
    TextClip,
    VideoFileClip,
    concatenate_videoclips,
    concatenate_audioclips,
)

# AI and Machine Learning APIs
from openai import AsyncOpenAI
from anthropic import AsyncAnthropic

# Additional utilities
from suno import SongsGen
import time


# Constants:
img_urls = [
    """https://cdn.discordapp.com/attachments/1212193794494042202/1223728760948523190/jas1.jpg?ex=661ae938&is=66087438&hm=a2661c174ebec9afba3265e3eb6bb86832f732f66d88195a5faa293a09839654&""",
    """https://cdn.discordapp.com/attachments/1221634008656642048/1223822939875704904/IMG_2084.jpg?ex=661b40ee&is=6608cbee&hm=ec453c6196ea2b6fc3bfa3e9fcb7f14a438f955f69198d937ea079da55a2afd6&""",
]
voice_ids = ["jA3XNbtepbUtYOz5Q5bI", "UCHQN7CfyPSQTpOZoSvi"]
bearer = os.environ.get("DID_API_KEY")
encoded = base64.b64encode(bearer.encode("utf-8")).decode("utf-8")
eleven = os.environ.get("ELEVENLABS_API_KEY")


prompt = """\n\n
The above is a transcript of a lecture video with timestamps for each sentence in seconds.

Your task is to create a 30 second engaging and educational tiktok script for one topic in the video. 
Choose one of the more obscure and interesting topics from the transcript that most people dont know about.
The tiktok should incorporate an engaging story or example.
Do not have any emojis or hashtags in the script.
The script should be in ssml format. But do not change voices, only add pauses and emphasis.
The script should sound passionate, excited, and happy.
"""

music_prompt = """
The above is a script for a tiktok video.
Please generate a short one sentence description of the music that should be playing in the background of the video.
Include genre and mood
Example:
"A short upbeat EDM tune with a catchy melody"
"""


transcript_prompt = """
You are given a transcript of a short video with timestamps
You are in charge of making a list of pictures that will be used to create a video
The video will be a slideshow of the pictures
The pictures should be relevant to the text
Make sure to include how long each picture should be displayed as well as the description of the picture

Example output
[{"description": "A picture of a cat", "start": 1, "end": 3}, {"description": "A picture of a dog", "start": 3, "end": 5}]
"""


def convert_audio_to_chunks(
    input_file_path, binary_chunk_size=18 * 1024 * 1024
):  # 18MB of binary data
    chunks = []

    with tempfile.NamedTemporaryFile(
        suffix=".mp3", mode="wb", delete=False
    ) as temp_audio_file:
        # Extract audio from MP4 or directly use MP3
        if input_file_path.endswith(".mp4"):
            video = AudioFileClip(input_file_path)
            video.write_audiofile(temp_audio_file.name, codec="mp3")
        else:
            with open(input_file_path, "rb") as audio_file:
                temp_audio_file.write(audio_file.read())
                temp_audio_file.flush()

        temp_audio_file_name = temp_audio_file.name

    # Reopen the temporary file in read-binary mode to read the audio data
    with open(temp_audio_file_name, "rb") as temp_audio_file_rb:
        audio_data = temp_audio_file_rb.read()

    # Split the binary audio data into chunks and encode to Base64
    for i in range(0, len(audio_data), binary_chunk_size):
        chunk = audio_data[i : i + binary_chunk_size]
        chunks.append(chunk)

    # Ensure to clean up the temporary file manually since delete=False
    os.remove(temp_audio_file_name)

    return chunks


async def transcribe_chunk(client, chunk, index):
    with tempfile.NamedTemporaryFile(
        suffix=".mp3", mode="wb", delete=True
    ) as temp_audio_file:
        temp_audio_file.write(chunk)
        temp_audio_file.flush()
        temp_audio_file.seek(0)

        with open(temp_audio_file.name, "rb") as audio_file:
            transcript_obj = await client.audio.transcriptions.create(
                model="whisper-1", file=audio_file, response_format="verbose_json"
            )

    # Include the chunk index to help with ordering and timestamp adjustments later
    return index, transcript_obj


async def transcribe_all_chunks(chunks):
    client = AsyncOpenAI()
    tasks = [transcribe_chunk(client, chunk, i) for i, chunk in enumerate(chunks)]
    results = await asyncio.gather(*tasks)

    # Ensure the results are ordered by the original chunk index
    ordered_results = sorted(results, key=lambda x: x[0])

    return ordered_results


def adjust_timestamps_and_combine(transcripts):
    combined_transcript = []
    total_duration = 0

    for _, transcript_obj in transcripts:
        segments = transcript_obj.segments
        for segment in segments:
            # Adjust timestamps
            segment["start"] += total_duration
            segment["end"] += total_duration
            combined_transcript.append(
                {
                    "text": segment["text"],
                    "start": segment["start"],
                    "end": segment["end"],
                }
            )

        # Update total duration for the next chunk
        last_segment = segments[-1]
        total_duration = last_segment["end"]

    return combined_transcript


async def transcribe_audio_chunks(chunks):
    # Define the chunk size (18MB of decoded data is a safe estimate to stay under 25MB when encoded)
    ordered_transcripts = await transcribe_all_chunks(chunks)
    combined_transcript = adjust_timestamps_and_combine(ordered_transcripts)

    return combined_transcript


async def post_talk(script):
    url = "https://api.d-id.com/talks"
    # Randomly select one of the two voice IDs
    randInt = np.random.randint(0, 2)
    headers = {
        "accept": "application/json",
        "authorization": f"Basic {encoded}",
        "Content-Type": "application/json",
        "x-api-key-external": json.dumps({"elevenlabs": eleven}),
    }
    data = {
        "script": {
            "type": "text",
            "subtitles": "false",
            "provider": {
                "type": "elevenlabs",
                "voice_id": voice_ids[randInt],
                "voice_config": {"stability": 0.3, "similarity_boost": 0.75},
            },
            "model_id": "eleven_multilingual_v2",
            "input": script,
            "ssml": True,
        },
        "config": {"fluent": "false", "pad_audio": "0.0"},
        "source_url": img_urls[randInt],
    }

    async with aiohttp.ClientSession() as session:
        async with session.post(url, headers=headers, json=data) as response:
            # Check if the request was successful
            if response.status == 201:
                # Process the response here
                response_data = await response.json()
                id = response_data["id"]

            else:
                # Handle request errors here
                print(f"Failed to post data, status code: {response.status}")
                print(await response.text())
                return ""

        # Loop to check the status
        while True:
            async with session.get(f"{url}/{id}", headers=headers) as status_response:
                if status_response.status == 200:
                    status_data = await status_response.json()
                    if status_data["status"] == "done":
                        result_url = status_data["result_url"]
                        break
                    else:
                        # Wait for some time before checking the status again
                        await asyncio.sleep(5)
                else:
                    print(f"Failed to get data, status code: {status_response.status}")
                    return ""

        # Download the video
        async with session.get(result_url) as video_response:
            if video_response.status == 200:
                mp4_data = (
                    await video_response.read()
                )  # This is the binary data of the MP4 file
                return mp4_data
            else:
                print(f"Failed to download video, status code: {video_response.status}")
                return ""


async def async_generate_music(text):
    i = SongsGen(os.environ.get("SUNO_COOKIE"))
    print(i.get_limit_left())
    loop = asyncio.get_running_loop()

    result = None
    # Use a ThreadPoolExecutor to run synchronous functions in threads
    with ThreadPoolExecutor() as pool:
        result = await loop.run_in_executor(
            pool,
            lambda: i.get_songs(text, make_instrumental=True),
        )

    if not result:
        return None

    link = result["song_url"]
    print("Link: ", link)

    attempt = 0
    retry_delay = 5
    async with aiohttp.ClientSession() as session:
        while attempt < 5:
            async with session.get(link) as response:
                if response.status == 200:
                    data = await response.read()
                    # Check if data is not empty
                    if data:
                        return data
                    else:
                        print("No data received, retrying in 5 seconds...")
                else:
                    print(
                        f"Failed to fetch the song, status code: {response.status}, retrying in 5 seconds..."
                    )
            await asyncio.sleep(retry_delay)  # Async sleep for retry_delay seconds
            attempt += 1

    print("Failed to fetch the song after retries")
    return None


def format_time(seconds):
    """Convert seconds to a time string in HH:MM:SS,MS format."""
    hours, remainder = divmod(seconds, 3600)
    minutes, seconds = divmod(remainder, 60)
    return f"{int(hours):02}:{int(minutes):02}:{int(seconds):02},000"


async def transcribe_audio_file(audio_file_path):
    client = AsyncOpenAI()
    with open(audio_file_path, "rb") as audio_file:
        transcript_obj = await client.audio.transcriptions.create(
            model="whisper-1", file=audio_file, response_format="verbose_json"
        )
    return transcript_obj


async def fetch_image_binary(url):
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            # Make sure the request was successful
            if response.status == 200:
                # Read and return the binary content of the image
                return await response.read()
            else:
                # Handle possible HTTP errors (e.g., 404 Not Found) here if needed
                return None


async def generate_image(description):
    client = AsyncOpenAI()
    response = await client.images.generate(
        model="dall-e-3",
        prompt=description,
        size="1024x1024",
        quality="standard",
        n=1,
    )
    image_binary = await fetch_image_binary(response.data[0].url)
    return image_binary


async def generate_images(pictures):
    tasks = [generate_image(picture["description"]) for picture in pictures]
    imgs = await asyncio.gather(*tasks)
    return imgs


async def process_video_and_generate_images(video_binary):
    transcript = ""
    srt_content = ""
    # Save the video binary to a temporary file to process
    with tempfile.NamedTemporaryFile(suffix=".mp4", delete=True) as tmp_video_file:
        tmp_video_file.write(video_binary)
        transcript_obj = await transcribe_audio_file(tmp_video_file.name)
        segments = transcript_obj.segments
        for index, segment in enumerate(segments, start=1):
            # Convert start and end times from seconds to the SRT time format
            # Use the custom format_time function for start and end times
            start_time = format_time(round(segment["start"]))
            end_time = format_time(round(segment["end"]))

            # Append the formatted segment to the SRT content string
            srt_content += (
                f"{index}\n{start_time} --> {end_time}\n{segment['text']}\n\n"
            )
            transcript += f"{segment['text']} | start: {round(segment['start'],2)} | end: {round(segment['end'],2)}\n"

    async def generate_text(text, script):
        client = AsyncAnthropic(
            # This is the default and can be omitted
            api_key=os.environ.get("ANTHROPIC_API_KEY"),
        )

        message = await client.messages.create(
            temperature=0,
            max_tokens=1024,
            messages=[
                {
                    "role": "user",
                    "content": text + script,
                },
                {"role": "assistant", "content": "["},
            ],
            model="claude-3-opus-20240229",
        )

        return message.content

    pictures = await generate_text(transcript, transcript_prompt)
    pictures = json.loads(f"[{pictures[0].text}")

    images = []
    images = await generate_images(pictures)

    return images, pictures, srt_content


import re
from datetime import datetime, timedelta


def parse_srt(srt_content):
    """Parse an SRT file into a list of dictionaries with 'start', 'end', and 'text'."""

    # Split into segments based on double line breaks
    segments = re.split(r"\n\n+", srt_content)

    subtitles = []
    for segment in segments:
        lines = segment.split("\n")
        if len(lines) >= 3:
            # Extract start and end times
            times = re.findall(r"(\d{2}:\d{2}:\d{2},\d{3})", lines[1])

            start_time = str_to_timedelta(times[0])
            end_time = str_to_timedelta(times[1])

            # The remaining lines are subtitle text
            text = "\n".join(lines[2:])

            subtitles.append({"start": start_time, "end": end_time, "text": text})

    return subtitles


def str_to_timedelta(time_str):
    """Convert a time string from SRT format to a timedelta object."""
    datetime_obj = datetime.strptime(time_str, "%H:%M:%S,%f")
    return timedelta(
        hours=datetime_obj.hour,
        minutes=datetime_obj.minute,
        seconds=datetime_obj.second,
        microseconds=datetime_obj.microsecond,
    )


def wrap_text(text, max_width):
    # Wrap text to the specified width and join with newline to form up to 3 lines
    return "\n".join(wrap(text, max_width))


def create_circular_mask(clip, radius=None):
    """
    Applies a circular mask to the given clip, making the exterior of the circle transparent.
    """
    if radius is None:
        radius = min(clip.size) // 2

    def mask_frame(frame):
        h, w = frame.shape[:2]
        Y, X = np.ogrid[:h, :w]
        center = (h // 2, w // 2)
        dist_from_center = np.sqrt((X - center[1]) ** 2 + (Y - center[0]) ** 2)

        mask = dist_from_center <= radius
        new_frame = frame.copy()
        for i in range(3):  # Apply mask to each channel
            new_frame[:, :, i] = frame[:, :, i] * mask

        return new_frame

    masked_clip = clip.fl_image(mask_frame)

    # Create a mask clip
    mask_clip = clip.fl_image(lambda frame: 255 * (mask_frame(frame) > 0))
    masked_clip = masked_clip.set_mask(mask_clip.to_mask())

    return masked_clip


def edit_video(headshot, subtitles, pictures, images, music):
    fade_duration = 0.5
    image_clips = []

    # Use contextlib.ExitStack to manage multiple context managers
    with contextlib.ExitStack() as stack:
        # Create temporary files for headshot and music
        tmp_headshot_file = stack.enter_context(
            tempfile.NamedTemporaryFile(suffix=".mp4", delete=True)
        )
        tmp_music_file = stack.enter_context(
            tempfile.NamedTemporaryFile(suffix=".mp3", delete=True)
        )

        # Write headshot and music binary data to their respective temporary files
        tmp_headshot_file.write(headshot)
        tmp_headshot_file.flush()  # Ensure data is written

        tmp_music_file.write(music)
        tmp_music_file.flush()  # Ensure data is written

        # headshot is binary data of the headshot
        headshot_clip = VideoFileClip(tmp_headshot_file.name).resize(height=500)
        headshot_duration = headshot_clip.duration
        headshot_audio = headshot_clip.audio

        # Make audio slightly louder
        headshot_audio = headshot_audio.volumex(1.5)

        # Apply circular mask and position the headshot clip
        headshot_clip = create_circular_mask(headshot_clip)
        headshot_clip = headshot_clip.set_position(("right", "bottom")).margin(
            right=50, bottom=50, opacity=0
        )

        for i, picture in enumerate(pictures):
            img = Image.open(BytesIO(images[i]))
            img_np = np.array(img)
            img_clip = ImageClip(img_np)
            # Resize the image to fit the width of the canvas
            img_clip = img_clip.resize(width=1080)

            # Create a black background clip with the same size as the canvas
            black_bg = ColorClip(size=(1080, 1920), color=(0, 0, 0))

            # Composite the image clip onto the black background clip
            img_clip = CompositeVideoClip(
                [black_bg, img_clip.set_position("center")], size=(1080, 1920)
            )

            # Dynamically adjust the duration to extend to the start of the next picture, if applicable
            if i < len(pictures) - 1:  # Check if there is a next picture
                next_picture_start = pictures[i + 1]["start"]
                img_clip_duration = next_picture_start - picture["start"]
            else:  # For the last picture, use its original end time
                img_clip_duration = picture["end"] - picture["start"]
            img_clip = img_clip.set_duration(img_clip_duration)
            img_clip = img_clip.set_start(picture["start"])

            # Add fade-in effect to all but the first clip
            if i > 0:
                img_clip = img_clip.crossfadein(fade_duration)
            # Add fade-out effect to all but the last clip
            if i < len(pictures) - 1:
                img_clip = img_clip.crossfadeout(fade_duration)

            image_clips.append(img_clip)

        # Concatenate image clips
        video_clip = concatenate_videoclips(
            image_clips, method="compose", padding=-fade_duration
        )

        # Adjust the final image clip to match the headshot video's duration if necessary
        if video_clip.duration < headshot_duration:
            # Extend the last clip
            last_clip = image_clips[-1].set_end(headshot_duration)
            image_clips[-1] = last_clip
            video_clip = concatenate_videoclips(image_clips, method="chain")
        elif video_clip.duration > headshot_duration:
            # Truncate the video_clip to match the headshot_duration
            video_clip = video_clip.subclip(0, headshot_duration)

        # Processing subtitle clips
        subtitle_clips = []
        subtitles = parse_srt(subtitles)
        for subtitle in subtitles:
            # Create a TextClip for this subtitle
            wrapped_text = wrap_text(subtitle["text"], 40)
            txt_clip = TextClip(
                wrapped_text,
                fontsize=48,
                color="white",
                font="Arial-Bold",
                align="West",
            )

            # Set the duration and start time for the TextClip
            start_seconds = subtitle["start"].total_seconds()
            end_seconds = subtitle["end"].total_seconds()
            txt_clip = txt_clip.set_start(start_seconds).set_duration(
                end_seconds - start_seconds
            )

            # Set the position of the TextClip in the top middle of the screen
            txt_clip = txt_clip.set_position(("center", "top")).margin(
                top=50, opacity=0
            )

            subtitle_clips.append(txt_clip)

        background_music = AudioFileClip(tmp_music_file.name)
        repeat_count = int(headshot_duration // background_music.duration) + 1
        # Create a list with the audio clip repeated
        repeated_clips = [background_music] * repeat_count

        # Concatenate the repeated clips
        looped_background_music = concatenate_audioclips(repeated_clips)

        # Trim the concatenated audio to match the headshot_duration
        looped_background_music = looped_background_music.subclip(0, headshot_duration)

        final_audio = CompositeAudioClip([headshot_audio, looped_background_music])

        # Create the final composite clip
        final_clip = CompositeVideoClip(
            [
                video_clip.set_duration(headshot_duration),
                *subtitle_clips,
                headshot_clip.set_duration(headshot_duration),
            ],
            size=(1080, 1920),
        ).set_audio(final_audio)

        # Write the final video to a file
        final_clip.write_videofile("data/final_video.mp4", threads=8, fps=24)
