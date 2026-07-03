from datetime import datetime
from pathlib import Path
from uuid import uuid4

from pydantic import BaseModel, Field

from app.models.document_status import DocumentStatus



class Document(BaseModel):
    document_id: str = Field(default_factory=lambda: str(uuid4()))

    original_filename: str

    stored_filename: str

    file_path: Path

    uploaded_at: datetime = Field(default_factory=datetime.utcnow)

    status: DocumentStatus = DocumentStatus.UPLOADED