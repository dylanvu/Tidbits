import uuid
from io import FileIO, BufferedReader
from pathlib import Path
from httpx import Response
from supabase_py_async import create_client, AsyncClient

from config import settings

client: AsyncClient = None
bucket: str = settings.SUPABASE_BUCKET
download_dir = Path("downloads")
download_dir.mkdir(exist_ok=True)


async def init_client() -> None:
    global client
    client = await create_client(
        settings.SUPABASE_URL,
        settings.SUPABASE_KEY,
    )


async def get_file(path: Path) -> Path:
    destination = download_dir / f"{uuid.uuid4()}{path.suffix}"
    with open(destination, "wb+") as f:
        res = await client.storage.from_(bucket).download(path.as_posix())
        f.write(res)
    return destination


async def upload_file(
    destination_path: str, file: BufferedReader | bytes | FileIO | str | Path
) -> Response:
    res = await client.storage.from_(bucket).upload(destination_path, file)
    return res
