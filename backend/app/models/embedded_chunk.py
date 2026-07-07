from uuid import UUID
from typing import List
from pydantic import BaseModel, Field


class EmbeddedChunk(BaseModel):
    """
    Model representing a text chunk along with its generated vector embedding.
    """
    chunk_id: UUID = Field(..., description="The unique identifier of the original chunk")
    document_id: str = Field(..., description="The unique identifier of the parsed document")
    page_number: int = Field(..., description="The page number where this chunk is located (1-indexed)")
    chunk_index: int = Field(..., description="The sequential index of this chunk within the document")
    text: str = Field(..., description="The text content of the chunk")
    embedding: List[float] = Field(..., description="The generated vector embedding representation of the chunk text")
    metadata: dict = Field(default_factory=dict, description="Metadata dictionary matching the original chunk metadata")
