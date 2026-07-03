from pathlib import Path
from uuid import uuid4
import shutil

from fastapi import UploadFile

from app.core.config import settings
from app.models.document import Document


def save_uploaded_file(file: UploadFile) -> Document:
    """
    Save an uploaded file and return a Document object.
    """

    upload_dir = Path(settings.UPLOAD_DIRECTORY)
    upload_dir.mkdir(parents=True, exist_ok=True)

    extension = Path(file.filename).suffix

    unique_filename = f"{uuid4()}{extension}"

    destination = upload_dir / unique_filename

    with destination.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return Document(
        original_filename=file.filename,
        stored_filename=unique_filename,
        file_path=destination,
    )