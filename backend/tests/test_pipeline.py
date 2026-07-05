import unittest
from unittest.mock import patch, MagicMock
from pathlib import Path

from app.models.document import Document
from app.models.document_status import DocumentStatus
from app.models.parsed_document import ParsedDocument, ParsedPage
from app.models.chunk import Chunk
from app.models.chunked_document import ChunkedDocument
from app.models.embedded_chunk import EmbeddedChunk
from app.models.embedded_document import EmbeddedDocument
from app.services.document_pipeline import DocumentProcessingPipeline, DocumentPipelineError
from app.services.parser_service import PDFParserError
from app.services.chunk_service import ChunkingError
from app.services.embedding_service import EmbeddingServiceError
from app.services.vector_store_service import VectorStoreError


class TestDocumentProcessingPipeline(unittest.TestCase):

    def setUp(self):
        self.mock_repo = MagicMock()
        self.mock_embedding_service = MagicMock()
        self.mock_vector_store_service = MagicMock()

        self.pipeline = DocumentProcessingPipeline(
            repository=self.mock_repo,
            embedding_service=self.mock_embedding_service,
            vector_store_service=self.mock_vector_store_service
        )

        self.doc = Document(
            original_filename="manual.pdf",
            stored_filename="unique.pdf",
            file_path=Path("fake/path/manual.pdf")
        )

    @patch("app.services.document_pipeline.parse_pdf")
    @patch("app.services.document_pipeline.chunk_document")
    def test_successful_pipeline_execution(self, mock_chunk, mock_parse):
        # Arrange
        parsed_doc = ParsedDocument(
            document_id=self.doc.document_id,
            original_filename=self.doc.original_filename,
            total_pages=1,
            full_text="Test page",
            pages=[ParsedPage(page_number=1, text="Test page")]
        )

        chunk = Chunk(
            document_id=self.doc.document_id,
            page_number=1,
            chunk_index=0,
            text="Test page",
            start_char=0,
            end_char=9,
            metadata={"original_filename": "manual.pdf", "page_number": 1, "chunk_index": 0}
        )

        chunked_doc = ChunkedDocument(
            document_id=self.doc.document_id,
            original_filename=self.doc.original_filename,
            total_chunks=1,
            chunks=[chunk]
        )

        embedded_chunk = EmbeddedChunk(
            chunk_id=chunk.chunk_id,
            document_id=self.doc.document_id,
            page_number=1,
            chunk_index=0,
            text="Test page",
            embedding=[0.1] * 384,
            metadata={"original_filename": "manual.pdf", "page_number": 1, "chunk_index": 0}
        )

        embedded_doc = EmbeddedDocument(
            document_id=self.doc.document_id,
            total_chunks=1,
            embedded_chunks=[embedded_chunk]
        )

        mock_parse.return_value = parsed_doc
        mock_chunk.return_value = chunked_doc
        self.mock_embedding_service.embed_document.return_value = embedded_doc

        # Track status transitions as the pipeline executes
        statuses = []

        def record_parse_status(*args, **kwargs):
            statuses.append(self.doc.status)
            return parsed_doc

        def record_chunk_status(*args, **kwargs):
            statuses.append(self.doc.status)
            return chunked_doc

        def record_save_status(*args, **kwargs):
            statuses.append(self.doc.status)
            return None

        def record_embed_status(*args, **kwargs):
            statuses.append(self.doc.status)
            return embedded_doc

        def record_store_status(*args, **kwargs):
            statuses.append(self.doc.status)
            return None

        mock_parse.side_effect = record_parse_status
        mock_chunk.side_effect = record_chunk_status
        self.mock_repo.save.side_effect = record_save_status
        self.mock_embedding_service.embed_document.side_effect = record_embed_status
        self.mock_vector_store_service.store_document.side_effect = record_store_status

        # Act
        result = self.pipeline.process_document(self.doc)

        # Assert
        self.assertEqual(result, embedded_doc)
        self.assertEqual(self.doc.status, DocumentStatus.INDEXED)

        # Verify intermediate status transitions
        expected_statuses = [
            DocumentStatus.PARSING,
            DocumentStatus.PARSED,
            DocumentStatus.CHUNKED,
            DocumentStatus.CHUNKED,
            DocumentStatus.EMBEDDED
        ]
        self.assertEqual(statuses, expected_statuses)

    @patch("app.services.document_pipeline.parse_pdf")
    def test_parser_failure_transitions_to_failed(self, mock_parse):
        # Arrange
        mock_parse.side_effect = PDFParserError("Cannot open PDF")

        # Act & Assert
        with self.assertRaises(DocumentPipelineError) as context:
            self.pipeline.process_document(self.doc)

        self.assertIn("Parser failed", str(context.exception))
        self.assertEqual(self.doc.status, DocumentStatus.FAILED)

    @patch("app.services.document_pipeline.parse_pdf")
    @patch("app.services.document_pipeline.chunk_document")
    def test_chunker_failure_transitions_to_failed(self, mock_chunk, mock_parse):
        # Arrange
        parsed_doc = ParsedDocument(
            document_id=self.doc.document_id,
            original_filename=self.doc.original_filename,
            total_pages=1,
            full_text="Test page",
            pages=[ParsedPage(page_number=1, text="Test page")]
        )
        mock_parse.return_value = parsed_doc
        mock_chunk.side_effect = ChunkingError("Chunking failed due to splitter error")

        # Act & Assert
        with self.assertRaises(DocumentPipelineError) as context:
            self.pipeline.process_document(self.doc)

        self.assertIn("Chunker failed", str(context.exception))
        self.assertEqual(self.doc.status, DocumentStatus.FAILED)

    @patch("app.services.document_pipeline.parse_pdf")
    @patch("app.services.document_pipeline.chunk_document")
    def test_repository_save_failure_transitions_to_failed(self, mock_chunk, mock_parse):
        # Arrange
        parsed_doc = ParsedDocument(
            document_id=self.doc.document_id,
            original_filename=self.doc.original_filename,
            total_pages=1,
            full_text="Test page",
            pages=[ParsedPage(page_number=1, text="Test page")]
        )
        chunked_doc = ChunkedDocument(
            document_id=self.doc.document_id,
            original_filename=self.doc.original_filename,
            total_chunks=0,
            chunks=[]
        )
        mock_parse.return_value = parsed_doc
        mock_chunk.return_value = chunked_doc
        self.mock_repo.save.side_effect = Exception("Disk full")

        # Act & Assert
        with self.assertRaises(DocumentPipelineError) as context:
            self.pipeline.process_document(self.doc)

        self.assertIn("Persistence failed", str(context.exception))
        self.assertEqual(self.doc.status, DocumentStatus.FAILED)

    @patch("app.services.document_pipeline.parse_pdf")
    @patch("app.services.document_pipeline.chunk_document")
    def test_embedding_failure_transitions_to_failed(self, mock_chunk, mock_parse):
        # Arrange
        parsed_doc = ParsedDocument(
            document_id=self.doc.document_id,
            original_filename=self.doc.original_filename,
            total_pages=1,
            full_text="Test page",
            pages=[ParsedPage(page_number=1, text="Test page")]
        )
        chunked_doc = ChunkedDocument(
            document_id=self.doc.document_id,
            original_filename=self.doc.original_filename,
            total_chunks=0,
            chunks=[]
        )
        mock_parse.return_value = parsed_doc
        mock_chunk.return_value = chunked_doc
        self.mock_embedding_service.embed_document.side_effect = EmbeddingServiceError("Model encoding error")

        # Act & Assert
        with self.assertRaises(DocumentPipelineError) as context:
            self.pipeline.process_document(self.doc)

        self.assertIn("Embedding failed", str(context.exception))
        self.assertEqual(self.doc.status, DocumentStatus.FAILED)

    @patch("app.services.document_pipeline.parse_pdf")
    @patch("app.services.document_pipeline.chunk_document")
    def test_vector_store_failure_transitions_to_failed(self, mock_chunk, mock_parse):
        # Arrange
        parsed_doc = ParsedDocument(
            document_id=self.doc.document_id,
            original_filename=self.doc.original_filename,
            total_pages=1,
            full_text="Test page",
            pages=[ParsedPage(page_number=1, text="Test page")]
        )
        chunked_doc = ChunkedDocument(
            document_id=self.doc.document_id,
            original_filename=self.doc.original_filename,
            total_chunks=0,
            chunks=[]
        )
        embedded_doc = EmbeddedDocument(
            document_id=self.doc.document_id,
            total_chunks=0,
            embedded_chunks=[]
        )
        mock_parse.return_value = parsed_doc
        mock_chunk.return_value = chunked_doc
        self.mock_embedding_service.embed_document.return_value = embedded_doc
        self.mock_vector_store_service.store_document.side_effect = VectorStoreError("ChromaDB write error")

        # Act & Assert
        with self.assertRaises(DocumentPipelineError) as context:
            self.pipeline.process_document(self.doc)

        self.assertIn("Vector store storage failed", str(context.exception))
        self.assertEqual(self.doc.status, DocumentStatus.FAILED)


if __name__ == "__main__":
    unittest.main()
