from pathlib import Path
from fastapi import HTTPException, UploadFile

ALLOWED_EXTENSIONS = {".pdf"}


def validate_uploaded_file(file: UploadFile) -> None:
    """
    Validate the uploaded file before saving.
    """

    extension = Path(file.filename).suffix.lower()

    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type '{extension}'. Only PDF files are allowed."
        )