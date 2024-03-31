from io import FileIO, BufferedReader
from pathlib import Path
from supabase_py_async import create_client, AsyncClient

from config import settings

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


async def get_reel_metadata(uid: int) -> list:
    data = await client.table("user_reels").select("*").eq("uid", uid).execute()
    return data.data


async def download_thumbnail(vid: int):
    path = f"{vid}.jpeg"
    return await client.storage.from_(bucket).download(path)


async def download_reel(vid: int):
    path = f"{vid}.mp4"
    return await client.storage.from_(bucket).download(path)


async def upload_video_prompt(file: BufferedReader | bytes | FileIO | str | Path):
    path = "prompt.mp4"
    res = await client.storage.from_(bucket).upload(path, file)
    return res


async def upload_reel(file: BufferedReader | bytes | FileIO | str | Path):
    # TODO: insert all fields: duration, tag, name, description
    res = await client.table("reels").insert({}).execute()
    vid = res.data[0]["id"]
    path = f"{vid}.mp4"
    res = await client.storage.from_(bucket).upload(path, file)
    return res


async def delete_reel(vid: int):
    thumbnail = f"{vid}.jpeg"
    reel = f"{vid}.mp4"
    await client.storage.from_(bucket).remove([thumbnail, reel])
    data = await client.table("reels").delete().eq("vid", vid).execute()
    return data
