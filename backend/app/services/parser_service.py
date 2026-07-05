import fitz  # PyMuPDF
from app.models.document import Document
from app.models.parsed_document import ParsedDocument, ParsedPage


class PDFParserError(Exception):
    """
    Custom exception raised when PDF parsing fails due to open errors,
    formatting issues, or extraction failures.
    """
    pass


def parse_pdf(document: Document) -> ParsedDocument:
    """
    Parse the PDF document represented by the given Document model using PyMuPDF (fitz).

    Extracts text page-by-page, preserves 1-indexed page numbers, aggregates full text,
    and returns a structured ParsedDocument.

    Args:
        document (Document): The input Document object containing the file_path,
                             original_filename, and document_id.

    Returns:
        ParsedDocument: A structured representation of the parsed PDF document.

    Raises:
        PDFParserError: If the file does not exist, cannot be opened, or text extraction fails.
    """
    # Ensure the path exists before attempting to open it
    if not document.file_path.exists():
        raise PDFParserError(
            f"Failed to parse document '{document.original_filename}': "
            f"File does not exist at path '{document.file_path}'"
        )

    try:
        # Open PDF file using PyMuPDF (fitz)
        # Convert Path object to string for robust fitz compatibility
        with fitz.open(str(document.file_path)) as doc:
            pages = []
            page_texts = []

            # Iterate over each page in the PDF document
            for page in doc:
                try:
                    text = page.get_text()
                except Exception as text_err:
                    raise PDFParserError(
                        f"Failed to extract text from page {page.number + 1} "
                        f"of '{document.original_filename}': {str(text_err)}"
                    ) from text_err

                # Use 1-based indexing for the parsed pages
                page_number = page.number + 1

                parsed_page = ParsedPage(
                    page_number=page_number,
                    text=text
                )
                pages.append(parsed_page)
                page_texts.append(text)

            # Combine all pages' text into a single full_text string
            full_text = "\n".join(page_texts)
            total_pages = len(pages)

            return ParsedDocument(
                document_id=document.document_id,
                original_filename=document.original_filename,
                total_pages=total_pages,
                full_text=full_text,
                pages=pages
            )

    except PDFParserError:
        # Re-raise our custom PDFParserError
        raise
    except Exception as exc:
        # Catch any other fitz or filesystem related exceptions
        raise PDFParserError(
            f"An error occurred while opening or parsing the PDF "
            f"'{document.original_filename}': {str(exc)}"
        ) from exc
