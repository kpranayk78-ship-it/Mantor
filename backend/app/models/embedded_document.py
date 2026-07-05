from typing import List
from pydantic import BaseModel, Field
from app.models.embedded_chunk import EmbeddedChunk


class EmbeddedDocument(BaseModel):
    """
    Model representing a complete document where all its chunks have been embedded.
    """
    document_id: str = Field(..., description="The unique identifier of the document")
    total_chunks: int = Field(..., description="The total number of embedded chunks in this document")
    embedded_chunks: List[EmbeddedChunk] = Field(..., description="The list of embedded chunk objects")
