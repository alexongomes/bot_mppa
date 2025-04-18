from fastapi import FastAPI

app = FastAPI()

@app.get("/firstrouter")

async def hello():
    return "Hello Word"


@app.get("/")

async def home():
    return "Aprendendo o Fast API"