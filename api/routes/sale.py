from fastapi import APIRouter

router = APIRouter()

@router.get("/api/sale/list")
def listsale():
    return "printing sale list"

@router.get("/api/sale/create")
def createsale():
    return "creating new sale page"