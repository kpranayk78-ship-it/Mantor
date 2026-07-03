from fastapi import APIRouter, UploadFile, File

from app.schemas.upload import UploadResponse
from app.services.upload_service import save_uploaded_file
from app.utils.file_validation import validate_uploaded_file

router = APIRouter(
    prefix="/upload",
    tags=["Upload"]
)


@router.post("/", response_model=UploadResponse)
def upload_document(file: UploadFile = File(...)):
    validate_uploaded_file(file)

    uploaded_file = save_uploaded_file(file)

    return uploaded_file