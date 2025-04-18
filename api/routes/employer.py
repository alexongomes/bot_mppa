from fastapi import APIRouter

router = APIRouter()

@router.get("/api/employer/list")
def listemploer():
    return "printing customer list"

@router.get("/api/employer/create")
def createemployer():
    return "creating new employer page"