from typing import Union
from io import FileIO, BufferedReader
from pathlib import Path
from supabase_py_async import create_client, AsyncClient

from config import settings
from generate import generate

client: AsyncClient = None
bucket: str = settings.SUPABASE_BUCKET


async def init_client() -> None:
    global client
    client = await create_client(
        settings.SUPABASE_URL,
        settings.SUPABASE_KEY,
    )


async def get_courses(uid: str):
    data = (
        await client.table("user_courses")
        .select("course", "instructor")
        .eq("uid", uid)
        .execute()
    )
    return data.data


async def get_reel_metadata(uid: str, course: str) -> list:
    query = client.table("user_reels").select("*").eq("uid", uid)
    if course:
        query.eq("course", course)
    data = await query.execute()
    return data.data


async def download_thumbnail(vid: int):
    path = f"{vid}.jpeg"
    return await client.storage.from_(bucket).download(path)


async def download_reel(vid: int):
    path = f"{vid}.mp4"
    return await client.storage.from_(bucket).download(path)


async def upload_prompt_and_generate_reel(file: bytes):
    path = "prompt.mp4"
    # upload to storage as fallback
    await client.storage.from_(bucket).upload(
        path, file, file_options={"content-type": "video/mp4", "upsert": "true"}
    )
    temp = "temp.mp4"
    with open(temp, "wb+") as f:
        f.write(file)
    duration = await generate(temp)
    reel_path = "data/final_video.mp4"
    await upload_reel(
        reel_path,
        duration=duration,
        tag="physics",
        name="Demo Reel",
        description="This is a trial reel on a non-CS topic.",
    )


async def upload_reel(file: Union[BufferedReader, bytes, FileIO, str, Path], **kwargs):
    res = (
        await client.table("reels")
        .upsert(
            {
                "duration_seconds": kwargs.get("duration"),
                "tag": kwargs.get("tag"),
                "name": kwargs.get("name"),
                "description": kwargs.get("description"),
            }
        )
        .execute()
    )
    vid = res.data[0]["id"]
    await client.table("main").upsert(
        {
            "uid": "test",
            "course": "Kinematics",
            "instructor": "Walter Lewin",
            "vid": vid,
        }
    ).execute()
    path = f"{vid}.mp4"
    res = await client.storage.from_(bucket).upload(path, file)
    return res


async def delete_reel(vid: int):
    thumbnail = f"{vid}.jpeg"
    reel = f"{vid}.mp4"
    await client.storage.from_(bucket).remove([thumbnail, reel])
    data = await client.table("reels").delete().eq("id", vid).execute()
    return data.data
