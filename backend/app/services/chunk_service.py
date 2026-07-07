import logging
from app.core.config import settings
from app.models.parsed_document import ParsedDocument
from app.models.chunk import Chunk
from app.models.chunked_document import ChunkedDocument
from langchain_text_splitters import RecursiveCharacterTextSplitter

# Configure logger
logger = logging.getLogger("app.services.chunk_service")


class ChunkingError(Exception):
    """
    Custom exception raised when the chunking process fails due to
    invalid input structure or processing errors.
    """
    pass


def chunk_document(parsed_document: ParsedDocument) -> ChunkedDocument:
    """
    Chunk a ParsedDocument into smaller structured chunks using RecursiveCharacterTextSplitter.

    Each page of the document is chunked independently.

    Args:
        parsed_document (ParsedDocument): The parsed document containing page text.

    Returns:
        ChunkedDocument: A new object containing all generated Chunk models.

    Raises:
        ChunkingError: If the document has no pages, contains only empty pages, or splitting fails.
    """
    logger.info(
        f"Started chunking document '{parsed_document.original_filename}' "
        f"(ID: {parsed_document.document_id})"
    )

    if not parsed_document.pages:
        logger.error(
            f"Chunking failed: Document '{parsed_document.original_filename}' "
            f"has no pages."
        )
        raise ChunkingError("ParsedDocument has no pages.")

    # Check if the entire document is empty (has no extractable text)
    is_empty_doc = True
    for page in parsed_document.pages:
        if page.text and page.text.strip():
            is_empty_doc = False
            break

    if is_empty_doc:
        logger.error(
            f"Chunking failed: Document '{parsed_document.original_filename}' "
            f"is empty."
        )
        raise ChunkingError("Empty document: no extractable text found across all pages.")

    try:
        splitter = RecursiveCharacterTextSplitter(
            chunk_size=settings.CHUNK_SIZE,
            chunk_overlap=settings.CHUNK_OVERLAP,
            length_function=len
        )
    except Exception as exc:
        logger.error(f"Failed to initialize text splitter: {str(exc)}")
        raise ChunkingError(f"Failed to initialize text splitter: {str(exc)}") from exc

    chunks = []
    global_chunk_idx = 0

    for page in parsed_document.pages:
        page_text = page.text
        # Skip empty or pure-whitespace pages, but log them
        if not page_text or not page_text.strip():
            logger.info(f"Page {page.page_number} is empty. Skipping.")
            continue

        try:
            page_chunks_texts = splitter.split_text(page_text)
        except Exception as split_err:
            logger.error(
                f"Failed to split page {page.page_number} text: {str(split_err)}"
            )
            raise ChunkingError(
                f"Failed to split page {page.page_number} text: {str(split_err)}"
            ) from split_err

        page_chunks_count = 0
        current_search_index = 0

        for chunk_text in page_chunks_texts:
            # Find offsets for start_char and end_char
            stripped_chunk = chunk_text.strip()
            if stripped_chunk:
                found_idx = page_text.find(stripped_chunk, current_search_index)
                if found_idx != -1:
                    start_char = found_idx
                    end_char = found_idx + len(stripped_chunk)
                else:
                    # Fallback if find fails
                    start_char = current_search_index
                    end_char = current_search_index + len(chunk_text)
            else:
                start_char = current_search_index
                end_char = current_search_index + len(chunk_text)

            # Update the search index for the next chunk to the mathematical lower bound.
            # Since the splitter overlaps chunks, the next chunk can start before the current end_char.
            # Lower bound: start_char + len(chunk_text) - CHUNK_OVERLAP
            # We enforce progress by at least start_char + 1 to prevent matching the same position.
            next_search_lower_bound = start_char + len(chunk_text) - settings.CHUNK_OVERLAP
            current_search_index = max(start_char + 1, next_search_lower_bound)

            metadata = {
                "original_filename": parsed_document.original_filename,
                "page_number": page.page_number,
                "chunk_index": global_chunk_idx
            }

            chunk = Chunk(
                document_id=parsed_document.document_id,
                page_number=page.page_number,
                chunk_index=global_chunk_idx,
                text=chunk_text,
                start_char=start_char,
                end_char=end_char,
                metadata=metadata
            )

            chunks.append(chunk)
            global_chunk_idx += 1
            page_chunks_count += 1

        logger.info(f"Chunked page {page.page_number} into {page_chunks_count} chunks")

    logger.info(f"Total chunks generated: {global_chunk_idx}")

    return ChunkedDocument(
        document_id=parsed_document.document_id,
        original_filename=parsed_document.original_filename,
        total_chunks=len(chunks),
        chunks=chunks
    )
