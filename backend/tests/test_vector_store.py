import sys
import unittest
from unittest.mock import MagicMock
from uuid import uuid4

# Mock chromadb module
mock_chromadb = MagicMock()
mock_client = MagicMock()
mock_collection = MagicMock()

mock_chromadb.PersistentClient.return_value = mock_client
mock_client.get_or_create_collection.return_value = mock_collection
sys.modules['chromadb'] = mock_chromadb

from app.models.embedded_chunk import EmbeddedChunk
from app.models.embedded_document import EmbeddedDocument
from app.services.vector_store_service import VectorStoreService, VectorStoreError


class TestVectorStoreService(unittest.TestCase):

    def setUp(self):
        # Reset mocks
        mock_chromadb.PersistentClient.reset_mock()
        mock_client.get_or_create_collection.reset_mock()
        mock_collection.reset_mock()

        self.service = VectorStoreService(chroma_dir="mock-dir", collection_name="mock-col")

        # Setup standard EmbeddedChunk and EmbeddedDocument
        self.doc_id = "doc-123"
        self.chunk_id = uuid4()
        self.embedded_chunk = EmbeddedChunk(
            chunk_id=self.chunk_id,
            document_id=self.doc_id,
            page_number=1,
            chunk_index=0,
            text="Hello world chunk text.",
            embedding=[0.1] * 384,
            metadata={"original_filename": "test.pdf", "page_number": 1, "chunk_index": 0}
        )

        self.embedded_doc = EmbeddedDocument(
            document_id=self.doc_id,
            total_chunks=1,
            embedded_chunks=[self.embedded_chunk]
        )

    def test_initialization(self):
        mock_chromadb.PersistentClient.assert_called_once_with(path="mock-dir")
        mock_client.get_or_create_collection.assert_called_once_with(name="mock-col")

    def test_document_exists(self):
        # Case 1: Document exists
        mock_collection.get.return_value = {"ids": ["chunk-1"]}
        exists = self.service.document_exists(self.doc_id)
        self.assertTrue(exists)
        mock_collection.get.assert_called_with(where={"document_id": self.doc_id}, limit=1)

        # Case 2: Document does not exist
        mock_collection.get.return_value = {"ids": []}
        exists = self.service.document_exists("non-existent")
        self.assertFalse(exists)

    def test_delete_document(self):
        self.service.delete_document(self.doc_id)
        mock_collection.delete.assert_called_once_with(where={"document_id": self.doc_id})

    def test_store_chunk(self):
        self.service.store_chunk(self.embedded_chunk)
        mock_collection.add.assert_called_once_with(
            ids=[str(self.chunk_id)],
            embeddings=[self.embedded_chunk.embedding],
            documents=[self.embedded_chunk.text],
            metadatas=[{
                "document_id": self.doc_id,
                "page_number": 1,
                "chunk_index": 0,
                "original_filename": "test.pdf"
            }]
        )

    def test_store_document_new(self):
        # Setup: Document does not exist yet
        mock_collection.get.return_value = {"ids": []}

        self.service.store_document(self.embedded_doc)

        # Ensure delete was not called
        mock_collection.delete.assert_not_called()
        # Verify add was called with batch data
        mock_collection.add.assert_called_once_with(
            ids=[str(self.chunk_id)],
            embeddings=[self.embedded_chunk.embedding],
            documents=[self.embedded_chunk.text],
            metadatas=[{
                "document_id": self.doc_id,
                "page_number": 1,
                "chunk_index": 0,
                "original_filename": "test.pdf"
            }]
        )

    def test_store_document_overwrite_duplicate(self):
        # Setup: Document already exists
        mock_collection.get.return_value = {"ids": ["existing-chunk-id"]}

        self.service.store_document(self.embedded_doc)

        # Verify delete was called first before adding
        mock_collection.delete.assert_called_once_with(where={"document_id": self.doc_id})
        # Verify add was called
        mock_collection.add.assert_called_once()

    def test_search(self):
        # Setup mock query results
        mock_collection.query.return_value = {
            "ids": [[str(self.chunk_id)]],
            "documents": [[self.embedded_chunk.text]],
            "metadatas": [[{
                "document_id": self.doc_id,
                "page_number": 1,
                "chunk_index": 0,
                "original_filename": "test.pdf"
            }]],
            "distances": [[0.12]]
        }

        query_vec = [0.1] * 384
        hits = self.service.search(query_vec, top_k=3)

        mock_collection.query.assert_called_once_with(
            query_embeddings=[query_vec],
            n_results=3
        )
        self.assertEqual(len(hits), 1)
        self.assertEqual(hits[0]["chunk_id"], str(self.chunk_id))
        self.assertEqual(hits[0]["text"], self.embedded_chunk.text)
        self.assertEqual(hits[0]["distance"], 0.12)
        self.assertEqual(hits[0]["metadata"]["original_filename"], "test.pdf")

    def test_store_document_empty_failure(self):
        empty_doc = EmbeddedDocument(
            document_id=self.doc_id,
            total_chunks=0,
            embedded_chunks=[]
        )
        with self.assertRaises(VectorStoreError) as context:
            self.service.store_document(empty_doc)
        self.assertIn("empty", str(context.exception).lower())


if __name__ == "__main__":
    unittest.main()
