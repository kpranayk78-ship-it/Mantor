import sys
import unittest
from unittest.mock import MagicMock
import numpy as np

# Mock sentence_transformers module before importing the service
mock_sentence_transformers = MagicMock()
mock_model_instance = MagicMock()
mock_sentence_transformers.SentenceTransformer.return_value = mock_model_instance
sys.modules['sentence_transformers'] = mock_sentence_transformers

from app.models.chunk import Chunk
from app.models.chunked_document import ChunkedDocument
from app.services.embedding_service import EmbeddingService, EmbeddingServiceError


class TestEmbeddingService(unittest.TestCase):

    def setUp(self):
        # Setup mock encode function
        def mock_encode(texts, **kwargs):
            # Generate deterministic mock embeddings of dimension 384
            # Shape is (len(texts), 384)
            embeddings = []
            for i, text in enumerate(texts):
                val = 0.1 * (i + 1)
                arr = np.full(384, val, dtype=np.float32)
                embeddings.append(arr)
            return np.array(embeddings)

        mock_model_instance.encode.side_effect = mock_encode

        # Reset mock calls
        mock_model_instance.encode.reset_mock()
        mock_sentence_transformers.SentenceTransformer.reset_mock()

        self.service = EmbeddingService(model_name="mock-model")

        # Setup standard ChunkedDocument
        self.doc_id = "doc-123"
        self.chunk1 = Chunk(
            document_id=self.doc_id,
            page_number=1,
            chunk_index=0,
            text="Hello world chunk one.",
            start_char=0,
            end_char=22,
            metadata={"original_filename": "test.pdf", "page_number": 1, "chunk_index": 0}
        )
        self.chunk2 = Chunk(
            document_id=self.doc_id,
            page_number=2,
            chunk_index=1,
            text="Hello world chunk two.",
            start_char=0,
            end_char=22,
            metadata={"original_filename": "test.pdf", "page_number": 2, "chunk_index": 1}
        )
        self.chunked_doc = ChunkedDocument(
            document_id=self.doc_id,
            original_filename="test.pdf",
            total_chunks=2,
            chunks=[self.chunk1, self.chunk2]
        )

    def test_successful_embedding(self):
        # Act
        embedded_doc = self.service.embed_document(self.chunked_doc)

        # Assert
        self.assertEqual(embedded_doc.document_id, self.doc_id)
        self.assertEqual(embedded_doc.total_chunks, 2)
        self.assertEqual(len(embedded_doc.embedded_chunks), 2)

        # Verify first chunk
        ec1 = embedded_doc.embedded_chunks[0]
        self.assertEqual(ec1.chunk_id, self.chunk1.chunk_id)
        self.assertEqual(ec1.text, self.chunk1.text)
        self.assertEqual(len(ec1.embedding), 384)
        self.assertAlmostEqual(ec1.embedding[0], 0.1)

        # Verify second chunk
        ec2 = embedded_doc.embedded_chunks[1]
        self.assertEqual(ec2.chunk_id, self.chunk2.chunk_id)
        self.assertEqual(ec2.text, self.chunk2.text)
        self.assertEqual(len(ec2.embedding), 384)
        self.assertAlmostEqual(ec2.embedding[0], 0.2)

        # Verify batch encode was called once with list of texts
        mock_model_instance.encode.assert_called_once_with(
            ["Hello world chunk one.", "Hello world chunk two."],
            convert_to_numpy=True
        )

    def test_empty_chunk_list(self):
        empty_doc = ChunkedDocument(
            document_id="empty-doc",
            original_filename="empty.pdf",
            total_chunks=0,
            chunks=[]
        )
        with self.assertRaises(EmbeddingServiceError) as context:
            self.service.embed_document(empty_doc)
        self.assertIn("empty", str(context.exception).lower())

    def test_invalid_chunk_text(self):
        # Create a document with an invalid chunk (empty text)
        invalid_chunk = Chunk(
            document_id=self.doc_id,
            page_number=1,
            chunk_index=0,
            text="",  # Empty text
            start_char=0,
            end_char=0,
            metadata={}
        )
        invalid_doc = ChunkedDocument(
            document_id=self.doc_id,
            original_filename="test.pdf",
            total_chunks=1,
            chunks=[invalid_chunk]
        )

        with self.assertRaises(EmbeddingServiceError) as context:
            self.service.embed_document(invalid_doc)
        self.assertIn("invalid or empty chunk text", str(context.exception).lower())

    def test_metadata_preservation(self):
        embedded_doc = self.service.embed_document(self.chunked_doc)

        # Verify metadata is preserved
        self.assertEqual(embedded_doc.embedded_chunks[0].metadata, self.chunk1.metadata)
        self.assertEqual(embedded_doc.embedded_chunks[1].metadata, self.chunk2.metadata)

    def test_model_loaded_only_once(self):
        # Test model initialization is called once per service init
        mock_sentence_transformers.SentenceTransformer.assert_called_once_with("mock-model")


if __name__ == "__main__":
    unittest.main()
