import uvicorn
from fastapi import FastAPI, Response, HTTPException, UploadFile

from db import *
from events import lifespan

app = FastAPI(lifespan=lifespan)


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/courses")
async def courses_by_uid(uid: int):
    data = await get_courses(uid)
    return data


@app.get("/reels/info")
async def reel_info_by_uid(uid: int):
    data = await get_reel_metadata(uid)
    return data


@app.get("/thumbnail")
async def thumbnail_by_vid(vid: int):
    try:
        img_bytes = await download_thumbnail(vid)
        return Response(content=img_bytes, media_type="image/jpeg")
    except Exception as e:
        print(e)
        raise HTTPException(status_code=404)


@app.get("/reel")
async def reel_by_vid(vid: int):
    try:
        vid_bytes = await download_reel(vid)
        return Response(content=vid_bytes, media_type="video/mp4")
    except Exception as e:
        print(e)
        raise HTTPException(status_code=404)


@app.post("/prompt")
async def upload_prompt(file: UploadFile):
    res = await upload_video_prompt(file.file)
    return res


@app.delete("/reel")
async def delete_by_vid(vid: int):
    data = await delete_reel(vid)
    return data


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=10000)
