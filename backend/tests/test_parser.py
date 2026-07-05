import unittest
from pathlib import Path
import tempfile
import fitz

from app.models.document import Document
from app.services.parser_service import parse_pdf, PDFParserError


class TestPDFParser(unittest.TestCase):

    def setUp(self):
        # Create a temporary directory for test PDFs
        self.test_dir = tempfile.TemporaryDirectory()
        self.test_dir_path = Path(self.test_dir.name)

    def tearDown(self):
        # Clean up temporary directory
        self.test_dir.cleanup()

    def create_dummy_pdf(self, filename: str, pages_content: list[str]) -> Path:
        pdf_path = self.test_dir_path / filename
        doc = fitz.open()
        for content in pages_content:
            page = doc.new_page()
            # Insert text at a generic coordinate (x=50, y=50)
            page.insert_text((50, 50), content)
        doc.save(str(pdf_path))
        doc.close()
        return pdf_path

    def test_parse_valid_pdf(self):
        # Arrange
        pages_content = [
            "This is the first page of the document.",
            "Here is the second page text."
        ]
        pdf_path = self.create_dummy_pdf("valid_test.pdf", pages_content)

        doc_model = Document(
            original_filename="valid_test.pdf",
            stored_filename="unique_name.pdf",
            file_path=pdf_path
        )

        # Act
        parsed_doc = parse_pdf(doc_model)

        # Assert
        self.assertEqual(parsed_doc.document_id, doc_model.document_id)
        self.assertEqual(parsed_doc.original_filename, doc_model.original_filename)
        self.assertEqual(parsed_doc.total_pages, 2)
        self.assertEqual(len(parsed_doc.pages), 2)

        # Verify 1-based page indexing
        self.assertEqual(parsed_doc.pages[0].page_number, 1)
        self.assertIn("first page", parsed_doc.pages[0].text)

        self.assertEqual(parsed_doc.pages[1].page_number, 2)
        self.assertIn("second page", parsed_doc.pages[1].text)

        # Verify aggregated full_text
        self.assertIn("first page", parsed_doc.full_text)
        self.assertIn("second page", parsed_doc.full_text)
        expected_full_text = "\n".join(f"{content}\n" for content in pages_content)
        self.assertEqual(parsed_doc.full_text, expected_full_text)

    def test_parse_non_existent_file(self):
        # Arrange
        non_existent_path = self.test_dir_path / "does_not_exist.pdf"
        doc_model = Document(
            original_filename="non_existent.pdf",
            stored_filename="unique_non_existent.pdf",
            file_path=non_existent_path
        )

        # Act & Assert
        with self.assertRaises(PDFParserError) as context:
            parse_pdf(doc_model)

        self.assertIn("File does not exist", str(context.exception))

    def test_parse_invalid_pdf_format(self):
        # Arrange
        corrupt_path = self.test_dir_path / "corrupt.pdf"
        # Write dummy corrupt bytes
        corrupt_path.write_bytes(b"invalid pdf content")

        doc_model = Document(
            original_filename="corrupt.pdf",
            stored_filename="unique_corrupt.pdf",
            file_path=corrupt_path
        )

        # Act & Assert
        with self.assertRaises(PDFParserError) as context:
            parse_pdf(doc_model)

        self.assertIn("An error occurred while opening or parsing the PDF", str(context.exception))


if __name__ == "__main__":
    unittest.main()
