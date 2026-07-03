from fastapi import APIRouter

router = APIRouter()


@router.get("/", tags=["Root"])
def root():
    return {
        "message": "Welcome to Mantor API"
    }


@router.get("/health", tags=["Health"])
def health():
    return {
        "status": "healthy"
    }