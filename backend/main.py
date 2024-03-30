import uvicorn
from fastapi import FastAPI

from db import get_file, upload_file
from events import lifespan

app = FastAPI(lifespan=lifespan)


@app.get("/")
async def root():
    return {"message": "Hello World"}


if __name__ == "__main__":
    uvicorn.run(app, port=8000)
