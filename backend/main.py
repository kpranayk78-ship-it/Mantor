from fastapi import FastAPI

from app.api.routes.health import router as health_router
from app.api.routes.upload import router as upload_router
from app.core.config import settings

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="AI-powered Industrial Knowledge Intelligence Platform",
)

app.include_router(health_router)
app.include_router(upload_router)