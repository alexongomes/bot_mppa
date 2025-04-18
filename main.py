from fastapi import FastAPI, Request
from fastapi.templating import Jinja2Templates
from api.routes.customer import router as router_customer
from api.routes.employer import router as router_employer
from api.routes.sale import router as router_sale
from api.routes.text import router as router_text
from api.routes.vision import router as router_vision
from api.routes.audio import router as router_audio
from fastapi.staticfiles import StaticFiles
from openai import OpenAI


app = FastAPI()

app.include_router(router_customer)
app.include_router(router_employer)
app.include_router(router_sale)
app.include_router(router_text)
app.include_router(router_vision)
app.include_router(router_audio)

templates = Jinja2Templates(directory="./templates")

app.mount("/static", StaticFiles(directory="./static"), name="static")

@app.get("/")
async def home(request: Request):
    return templates.TemplateResponse("home.html", {"request": request, "title" : "Conheça o MPPA"})





