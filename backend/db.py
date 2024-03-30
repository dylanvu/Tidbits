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


async def get_reel_metadata(uid: str) -> list:
    data = await client.table("user_reels").select("*").eq("uid", uid).execute()
    return data.data


async def download_thumbnail(vid: str):
    path = f"{vid}.jpeg"
    return await client.storage.from_(bucket).download(path)


async def download_reel(vid: str):
    path = f"{vid}.mp4"
    return await client.storage.from_(bucket).download(path)


async def upload_reel(vid: str, file: BufferedReader | bytes | FileIO | str | Path):
    path = f"{vid}.mp4"
    res = await client.storage.from_(bucket).upload(path, file)
    # TODO: update table
    return res


async def delete_reel(vid: str):
    thumbnail = f"{vid}.jpeg"
    reel = f"{vid}.mp4"
    data = await client.storage.from_(bucket).remove([thumbnail, reel])
    # TODO: update table
    return data
