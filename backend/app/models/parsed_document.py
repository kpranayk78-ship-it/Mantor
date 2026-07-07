from typing import List
from pydantic import BaseModel, Field


class ParsedPage(BaseModel):
    """
    Model representing a single parsed page from a document.
    """
    page_number: int = Field(..., description="The page number (1-indexed)")
    text: str = Field(..., description="The text extracted from the page")


class ParsedDocument(BaseModel):
    """
    Model representing a completely parsed document.
    """
    document_id: str = Field(..., description="The unique identifier of the parsed document, matching the original Document ID")
    original_filename: str = Field(..., description="The original filename of the document")
    total_pages: int = Field(..., description="The total number of pages in the document")
    full_text: str = Field(..., description="The aggregated full text of all pages in the document")
    pages: List[ParsedPage] = Field(..., description="The list of individual parsed pages")
