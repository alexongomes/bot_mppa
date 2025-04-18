from openai import OpenAI
import openai
from fastapi import APIRouter, Request, Response, UploadFile, File
from fastapi.responses import StreamingResponse
from pathlib import Path
from time import time
import os
import io
from dotenv import load_dotenv


load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
router = APIRouter()

@router.post("/speak")
async def speak(request: Request):
    data = await request.json()
    text = data.get("text", "")
    
    if not text:
        return {"error": "Texto não fornecido."}
    
    response = openai.audio.speech.create(
        model="tts-1",
        input=text,
        voice="onyx"
    )
    
    audio_stream = io.BytesIO(response.content)
    return StreamingResponse(audio_stream, media_type="audio/mpeg")



@router.post('/api/audio/whisper')
async def transcription(file_upload: UploadFile = File(...)):
    audio_read = await file_upload.read()
    audio_byte = io.BytesIO(audio_read)
    audio_byte.name = "transcription.mp3"
    transcript = client.audio.transcriptions.create(
        model= "whisper-1",
        file = audio_byte,
    )

    return transcript.text

@router.post('/speechtotext')
async def transcription(file: UploadFile = File(...)):
    audio_stream = await file.read()
    audio_bytes = io.BytesIO(audio_stream)
    audio_bytes.name = "transcription.mp3"

    transcript = client.audio.transcriptions.create(
        model="whisper-1",
        file=audio_bytes,
    )
    
    return {"text": transcript.text}



