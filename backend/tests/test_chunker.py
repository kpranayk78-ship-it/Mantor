import unittest
from app.core.config import settings
from app.models.parsed_document import ParsedDocument, ParsedPage
from app.services.chunk_service import chunk_document, ChunkingError


class TestDocumentChunker(unittest.TestCase):

    def setUp(self):
        # Override settings for deterministic testing
        self.original_chunk_size = settings.CHUNK_SIZE
        self.original_chunk_overlap = settings.CHUNK_OVERLAP
        settings.CHUNK_SIZE = 100
        settings.CHUNK_OVERLAP = 20

    def tearDown(self):
        # Restore original settings
        settings.CHUNK_SIZE = self.original_chunk_size
        settings.CHUNK_OVERLAP = self.original_chunk_overlap

    def test_single_page_document(self):
        # Create page text that is long enough to trigger multiple chunks
        # 100 characters per chunk, overlap 20.
        # "a" * 150 characters
        text = "a" * 150
        page = ParsedPage(page_number=1, text=text)
        doc = ParsedDocument(
            document_id="doc-123",
            original_filename="test.pdf",
            total_pages=1,
            full_text=text,
            pages=[page]
        )

        chunked_doc = chunk_document(doc)

        self.assertEqual(chunked_doc.document_id, "doc-123")
        self.assertEqual(chunked_doc.original_filename, "test.pdf")
        self.assertGreater(chunked_doc.total_chunks, 1)
        self.assertEqual(len(chunked_doc.chunks), chunked_doc.total_chunks)

        # Verify all chunk attributes
        for idx, chunk in enumerate(chunked_doc.chunks):
            self.assertEqual(chunk.document_id, "doc-123")
            self.assertEqual(chunk.page_number, 1)
            self.assertEqual(chunk.chunk_index, idx)
            # Check character indexing offsets are valid
            self.assertGreaterEqual(chunk.start_char, 0)
            self.assertLessEqual(chunk.end_char, len(text))
            self.assertEqual(chunk.text, text[chunk.start_char:chunk.end_char])

    def test_multi_page_document(self):
        page1 = ParsedPage(page_number=1, text="Hello page one. This is some text.")
        page2 = ParsedPage(page_number=2, text="Hello page two. This is some other text.")
        doc = ParsedDocument(
            document_id="doc-456",
            original_filename="multi.pdf",
            total_pages=2,
            full_text="Hello page one. This is some text.\nHello page two. This is some other text.",
            pages=[page1, page2]
        )

        chunked_doc = chunk_document(doc)

        # Ensure chunks belong to their respective pages and pages don't merge
        for chunk in chunked_doc.chunks:
            if "one" in chunk.text:
                self.assertEqual(chunk.page_number, 1)
            elif "two" in chunk.text:
                self.assertEqual(chunk.page_number, 2)

        self.assertEqual(chunked_doc.total_chunks, len(chunked_doc.chunks))

    def test_empty_document(self):
        # Scenario 1: Document has no pages
        doc_no_pages = ParsedDocument(
            document_id="doc-empty",
            original_filename="empty.pdf",
            total_pages=0,
            full_text="",
            pages=[]
        )
        with self.assertRaises(ChunkingError) as context1:
            chunk_document(doc_no_pages)
        self.assertIn("no pages", str(context1.exception).lower())

        # Scenario 2: Document has pages but they are all empty
        page_empty = ParsedPage(page_number=1, text="   ")
        doc_empty_pages = ParsedDocument(
            document_id="doc-empty-pages",
            original_filename="empty_pages.pdf",
            total_pages=1,
            full_text="   ",
            pages=[page_empty]
        )
        with self.assertRaises(ChunkingError) as context2:
            chunk_document(doc_empty_pages)
        self.assertIn("empty document", str(context2.exception).lower())

    def test_empty_page_in_multipage(self):
        # Document has an empty page and a non-empty page
        page1 = ParsedPage(page_number=1, text="")
        page2 = ParsedPage(page_number=2, text="This is valid text on page two.")
        doc = ParsedDocument(
            document_id="doc-mixed",
            original_filename="mixed.pdf",
            total_pages=2,
            full_text="This is valid text on page two.",
            pages=[page1, page2]
        )

        chunked_doc = chunk_document(doc)
        # It should skip page 1 (no chunks generated for page 1) and only chunk page 2
        self.assertGreater(chunked_doc.total_chunks, 0)
        for chunk in chunked_doc.chunks:
            self.assertEqual(chunk.page_number, 2)
            self.assertIn("valid text", chunk.text)

    def test_metadata_correctness(self):
        text = "Sample text for checking metadata structure."
        page = ParsedPage(page_number=3, text=text)
        doc = ParsedDocument(
            document_id="doc-789",
            original_filename="meta_test.pdf",
            total_pages=1,
            full_text=text,
            pages=[page]
        )

        chunked_doc = chunk_document(doc)
        self.assertGreater(chunked_doc.total_chunks, 0)

        for idx, chunk in enumerate(chunked_doc.chunks):
            self.assertIsNotNone(chunk.chunk_id)
            self.assertEqual(chunk.metadata["original_filename"], "meta_test.pdf")
            self.assertEqual(chunk.metadata["page_number"], 3)
            self.assertEqual(chunk.metadata["chunk_index"], idx)

    def test_chunk_overlap_correctness(self):
        # We set CHUNK_SIZE = 50 and CHUNK_OVERLAP = 15
        settings.CHUNK_SIZE = 50
        settings.CHUNK_OVERLAP = 15

        # Create text to split into multiple chunks with overlap
        text = "This is a long sentence with many words that will be split into multiple chunks with some overlap."
        page = ParsedPage(page_number=1, text=text)
        doc = ParsedDocument(
            document_id="doc-overlap",
            original_filename="overlap.pdf",
            total_pages=1,
            full_text=text,
            pages=[page]
        )

        chunked_doc = chunk_document(doc)
        self.assertGreaterEqual(len(chunked_doc.chunks), 2)

        # Check overlap: find common characters
        chunk1_text = chunked_doc.chunks[0].text
        chunk2_text = chunked_doc.chunks[1].text

        # Verify start_char and end_char offsets indicate overlap
        self.assertLess(chunked_doc.chunks[1].start_char, chunked_doc.chunks[0].end_char)

        # Verify the overlapping text matches
        overlap_len = chunked_doc.chunks[0].end_char - chunked_doc.chunks[1].start_char
        overlap_from_chunk1 = chunk1_text[-overlap_len:]
        overlap_from_chunk2 = chunk2_text[:overlap_len]
        self.assertEqual(overlap_from_chunk1, overlap_from_chunk2)


if __name__ == "__main__":
    unittest.main()
