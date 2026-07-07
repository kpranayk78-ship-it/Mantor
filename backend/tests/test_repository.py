import unittest
import tempfile
from pathlib import Path
from unittest.mock import patch

from app.models.document import Document
from app.models.document_status import DocumentStatus
from app.models.parsed_document import ParsedDocument, ParsedPage
from app.models.chunk import Chunk
from app.models.chunked_document import ChunkedDocument
from app.repositories.document_repository import DocumentRepository, DocumentRepositoryError
from app.services.document_pipeline import DocumentProcessingPipeline


class TestDocumentRepository(unittest.TestCase):

    def setUp(self):
        # Create a temporary directory for storing test JSON documents
        self.test_dir = tempfile.TemporaryDirectory()
        self.repo = DocumentRepository(storage_dir=self.test_dir.name)

        # Setup sample ChunkedDocument
        self.doc_id = "test-doc-123"
        self.chunk = Chunk(
            document_id=self.doc_id,
            page_number=1,
            chunk_index=0,
            text="Hello world chunk",
            start_char=0,
            end_char=17,
            metadata={"original_filename": "test.pdf", "page_number": 1, "chunk_index": 0}
        )
        self.chunked_doc = ChunkedDocument(
            document_id=self.doc_id,
            original_filename="test.pdf",
            total_chunks=1,
            chunks=[self.chunk]
        )

    def tearDown(self):
        self.test_dir.cleanup()

    def test_save_and_load(self):
        # Save document
        self.repo.save(self.chunked_doc)

        # Verify file exists
        file_path = Path(self.test_dir.name) / f"{self.doc_id}.json"
        self.assertTrue(file_path.exists())

        # Load document and verify fields
        loaded = self.repo.load(self.doc_id)
        self.assertEqual(loaded.document_id, self.chunked_doc.document_id)
        self.assertEqual(loaded.original_filename, self.chunked_doc.original_filename)
        self.assertEqual(loaded.total_chunks, 1)
        self.assertEqual(len(loaded.chunks), 1)
        self.assertEqual(loaded.chunks[0].text, "Hello world chunk")

    def test_delete(self):
        self.repo.save(self.chunked_doc)
        self.assertTrue(self.repo.exists(self.doc_id))

        self.repo.delete(self.doc_id)
        self.assertFalse(self.repo.exists(self.doc_id))

    def test_exists(self):
        self.assertFalse(self.repo.exists(self.doc_id))
        self.repo.save(self.chunked_doc)
        self.assertTrue(self.repo.exists(self.doc_id))

    def test_list_documents(self):
        # Initial list empty
        self.assertEqual(self.repo.list_documents(), [])

        # Save one doc
        self.repo.save(self.chunked_doc)
        self.assertEqual(self.repo.list_documents(), [self.doc_id])

        # Save another doc
        another_chunked_doc = ChunkedDocument(
            document_id="another-id",
            original_filename="another.pdf",
            total_chunks=0,
            chunks=[]
        )
        self.repo.save(another_chunked_doc)
        doc_ids = self.repo.list_documents()
        self.assertIn(self.doc_id, doc_ids)
        self.assertIn("another-id", doc_ids)
        self.assertEqual(len(doc_ids), 2)

    def test_missing_document(self):
        with self.assertRaises(DocumentRepositoryError) as context:
            self.repo.load("missing-id")
        self.assertIn("not found in storage", str(context.exception))

    def test_corrupted_json(self):
        # Write invalid JSON directly to the directory
        corrupt_file = Path(self.test_dir.name) / f"{self.doc_id}.json"
        corrupt_file.write_text("{invalid_json: true", encoding="utf-8")

        with self.assertRaises(DocumentRepositoryError) as context:
            self.repo.load(self.doc_id)
        self.assertIn("Corrupted JSON format", str(context.exception))

    @patch("app.services.document_pipeline.parse_pdf")
    @patch("app.services.document_pipeline.chunk_document")
    def test_pipeline_automatically_saves_processed_documents(self, mock_chunk, mock_parse):
        # Arrange
        doc = Document(
            original_filename="test.pdf",
            stored_filename="unique.pdf",
            file_path=Path("fake/path/test.pdf")
        )

        parsed_doc = ParsedDocument(
            document_id=doc.document_id,
            original_filename=doc.original_filename,
            total_pages=1,
            full_text="Parsed text",
            pages=[ParsedPage(page_number=1, text="Parsed text")]
        )

        chunked_doc = ChunkedDocument(
            document_id=doc.document_id,
            original_filename=doc.original_filename,
            total_chunks=1,
            chunks=[self.chunk]
        )

        mock_parse.return_value = parsed_doc
        mock_chunk.return_value = chunked_doc

        # Mock embedding and vector store services for pipeline test
        from unittest.mock import MagicMock
        from app.models.embedded_chunk import EmbeddedChunk
        from app.models.embedded_document import EmbeddedDocument

        mock_embedding_service = MagicMock()
        mock_vector_store_service = MagicMock()

        embedded_chunk = EmbeddedChunk(
            chunk_id=self.chunk.chunk_id,
            document_id=doc.document_id,
            page_number=1,
            chunk_index=0,
            text="Hello world chunk",
            embedding=[0.1] * 384,
            metadata={"original_filename": "test.pdf", "page_number": 1, "chunk_index": 0}
        )
        embedded_doc = EmbeddedDocument(
            document_id=doc.document_id,
            total_chunks=1,
            embedded_chunks=[embedded_chunk]
        )
        mock_embedding_service.embed_document.return_value = embedded_doc

        pipeline = DocumentProcessingPipeline(
            repository=self.repo,
            embedding_service=mock_embedding_service,
            vector_store_service=mock_vector_store_service
        )

        # Act
        result = pipeline.process_document(doc)

        # Assert
        # Verify returned matches
        self.assertEqual(result, embedded_doc)
        self.assertEqual(doc.status, DocumentStatus.INDEXED)

        # Verify repository has saved the document
        self.assertTrue(self.repo.exists(doc.document_id))

        # Load and verify it matches what we expected
        saved_doc = self.repo.load(doc.document_id)
        self.assertEqual(saved_doc.document_id, doc.document_id)


if __name__ == "__main__":
    unittest.main()
