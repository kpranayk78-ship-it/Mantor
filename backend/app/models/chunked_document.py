from typing import List
from pydantic import BaseModel, Field
from app.models.chunk import Chunk


class ChunkedDocument(BaseModel):
    """
    Model representing a parsed document that has been split into chunks.
    """
    document_id: str = Field(..., description="The unique identifier of the parsed document")
    original_filename: str = Field(..., description="The original filename of the document")
    total_chunks: int = Field(..., description="The total number of chunks generated for this document")
    chunks: List[Chunk] = Field(..., description="The list of extracted text chunks")
