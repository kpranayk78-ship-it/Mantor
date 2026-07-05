from uuid import UUID, uuid4
from pydantic import BaseModel, Field


class Chunk(BaseModel):
    """
    Model representing a single text chunk extracted from a parsed document page.
    """
    chunk_id: UUID = Field(default_factory=uuid4, description="The unique identifier of the chunk")
    document_id: str = Field(..., description="The unique identifier of the parsed document")
    page_number: int = Field(..., description="The page number where the chunk is located (1-indexed)")
    chunk_index: int = Field(..., description="The sequential index of this chunk within the document")
    text: str = Field(..., description="The text content of the chunk")
    start_char: int = Field(..., description="The starting character position of this chunk inside the page text")
    end_char: int = Field(..., description="The ending character position of this chunk inside the page text")
    metadata: dict = Field(default_factory=dict, description="Metadata dictionary containing original filename, page number, chunk index, etc.")
