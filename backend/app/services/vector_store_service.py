from abc import ABC, abstractmethod
import logging
from typing import List, Dict, Any
from app.core.config import settings
from app.models.embedded_document import EmbeddedDocument
from app.models.embedded_chunk import EmbeddedChunk

# Configure logger
logger = logging.getLogger("app.services.vector_store_service")


class VectorStoreError(Exception):
    """
    Custom exception raised when vector store operations fail.
    """
    pass


class BaseVectorStoreService(ABC):
    """
    Abstract interface defining the contract for vector store services.
    """

    @abstractmethod
    def store_document(self, embedded_document: EmbeddedDocument) -> None:
        """
        Store all chunks and embeddings of an EmbeddedDocument in the vector database.

        Args:
            embedded_document (EmbeddedDocument): The document to store.

        Raises:
            VectorStoreError: If storage fails.
        """
        pass

    @abstractmethod
    def store_chunk(self, embedded_chunk: EmbeddedChunk) -> None:
        """
        Store a single EmbeddedChunk in the vector database.

        Args:
            embedded_chunk (EmbeddedChunk): The chunk to store.

        Raises:
            VectorStoreError: If storage fails.
        """
        pass

    @abstractmethod
    def delete_document(self, document_id: str) -> None:
        """
        Delete all vector entries associated with the given document_id.

        Args:
            document_id (str): The ID of the document to delete.

        Raises:
            VectorStoreError: If deletion fails.
        """
        pass

    @abstractmethod
    def document_exists(self, document_id: str) -> bool:
        """
        Check if any vector entries exist for the given document_id.

        Args:
            document_id (str): The ID of the document to check.

        Returns:
            bool: True if entries exist, False otherwise.

        Raises:
            VectorStoreError: If the check fails.
        """
        pass

    @abstractmethod
    def search(self, query_embedding: List[float], top_k: int = 5) -> List[Dict[str, Any]]:
        """
        Search for the top_k most similar chunks matching the query_embedding.

        Args:
            query_embedding (List[float]): The query vector.
            top_k (int): Number of top results to return.

        Returns:
            List[Dict[str, Any]]: List of matching chunk dictionaries.

        Raises:
            VectorStoreError: If the query fails.
        """
        pass


class VectorStoreService(BaseVectorStoreService):
    """
    ChromaDB local local-file-based implementation of the BaseVectorStoreService.
    """

    def __init__(self, chroma_dir: str = None, collection_name: str = None):
        """
        Initialize the ChromaDB PersistentClient and get or create the collection.

        Args:
            chroma_dir (str, optional): Custom path to store vector files.
                Defaults to settings.CHROMA_DIRECTORY.
            collection_name (str, optional): Custom name of the database collection.
                Defaults to settings.CHROMA_COLLECTION.
        """
        self.chroma_dir = chroma_dir or settings.CHROMA_DIRECTORY
        self.collection_name = collection_name or settings.CHROMA_COLLECTION

        logger.info(f"Initializing ChromaDB client at: '{self.chroma_dir}'")
        try:
            import chromadb
            # Initialize PersistentClient
            self.client = chromadb.PersistentClient(path=self.chroma_dir)

            logger.info(f"Creating or getting ChromaDB collection: '{self.collection_name}'")
            self.collection = self.client.get_or_create_collection(name=self.collection_name)
        except Exception as exc:
            logger.error(
                f"VectorStore failures: Failed to initialize ChromaDB or collection "
                f"'{self.collection_name}': {str(exc)}"
            )
            raise VectorStoreError(
                f"Failed to initialize ChromaDB client or collection: {str(exc)}"
            ) from exc

    def document_exists(self, document_id: str) -> bool:
        """
        Check if any chunks exist in ChromaDB matching the document_id.
        """
        try:
            results = self.collection.get(
                where={"document_id": document_id},
                limit=1
            )
            return len(results.get("ids", [])) > 0
        except Exception as exc:
            logger.error(
                f"VectorStore failures: Failed to check existence of document '{document_id}': {str(exc)}"
            )
            raise VectorStoreError(
                f"Failed to check document existence for '{document_id}': {str(exc)}"
            ) from exc

    def delete_document(self, document_id: str) -> None:
        """
        Delete all chunks associated with the document_id from ChromaDB.
        """
        logger.info(f"Deleting document {document_id} from vector store")
        try:
            self.collection.delete(where={"document_id": document_id})
        except Exception as exc:
            logger.error(
                f"VectorStore failures: Failed to delete document '{document_id}': {str(exc)}"
            )
            raise VectorStoreError(
                f"Failed to delete document '{document_id}' from vector store: {str(exc)}"
            ) from exc

    def store_chunk(self, embedded_chunk: EmbeddedChunk) -> None:
        """
        Store a single EmbeddedChunk in the ChromaDB collection.
        """
        logger.info(
            f"Storing chunk {embedded_chunk.chunk_id} "
            f"for document {embedded_chunk.document_id}"
        )
        try:
            metadata = {
                "document_id": embedded_chunk.document_id,
                "page_number": embedded_chunk.page_number,
                "chunk_index": embedded_chunk.chunk_index,
                "original_filename": embedded_chunk.metadata.get("original_filename", "")
            }

            self.collection.add(
                ids=[str(embedded_chunk.chunk_id)],
                embeddings=[embedded_chunk.embedding],
                documents=[embedded_chunk.text],
                metadatas=[metadata]
            )
        except Exception as exc:
            logger.error(
                f"VectorStore failures: Failed to store chunk '{embedded_chunk.chunk_id}': {str(exc)}"
            )
            raise VectorStoreError(
                f"Failed to store chunk '{embedded_chunk.chunk_id}' in vector store: {str(exc)}"
            ) from exc

    def store_document(self, embedded_document: EmbeddedDocument) -> None:
        """
        Store all chunks of an EmbeddedDocument in ChromaDB.
        Overwrites existing document if it is already present.
        """
        doc_id = embedded_document.document_id
        logger.info(
            f"Storing document {doc_id} containing "
            f"{embedded_document.total_chunks} embedded chunks"
        )

        if not embedded_document.embedded_chunks:
            logger.error(
                f"VectorStore failures: Cannot store document '{doc_id}' "
                f"because the embedded chunk list is empty."
            )
            raise VectorStoreError("Embedded chunk list is empty.")

        try:
            # Overwrite duplicate check
            if self.document_exists(doc_id):
                logger.info(
                    f"Document '{doc_id}' already exists in vector store. "
                    f"Removing old vector entries first to overwrite."
                )
                self.delete_document(doc_id)

            ids = []
            embeddings = []
            documents = []
            metadatas = []

            for chunk in embedded_document.embedded_chunks:
                ids.append(str(chunk.chunk_id))
                embeddings.append(chunk.embedding)
                documents.append(chunk.text)

                metadata = {
                    "document_id": chunk.document_id,
                    "page_number": chunk.page_number,
                    "chunk_index": chunk.chunk_index,
                    "original_filename": chunk.metadata.get("original_filename", "")
                }
                metadatas.append(metadata)

            # Batch add to collection
            self.collection.add(
                ids=ids,
                embeddings=embeddings,
                documents=documents,
                metadatas=metadatas
            )
            logger.info(
                f"Stored {len(ids)} chunks successfully in vector store "
                f"for document: {doc_id}"
            )
        except Exception as exc:
            logger.error(
                f"VectorStore failures: Failed to store document '{doc_id}' "
                f"in vector store: {str(exc)}"
            )
            raise VectorStoreError(
                f"Failed to store document '{doc_id}' in vector store: {str(exc)}"
            ) from exc

    def search(self, query_embedding: List[float], top_k: int = 5) -> List[Dict[str, Any]]:
        """
        Query ChromaDB for closest matches to the query vector.
        """
        logger.info(
            f"Querying vector store for closest chunk matches (top_k={top_k})"
        )
        try:
            results = self.collection.query(
                query_embeddings=[query_embedding],
                n_results=top_k
            )

            hits = []
            if results and results.get("ids"):
                ids = results["ids"][0]
                documents = results["documents"][0] if results.get("documents") else []
                metadatas = results["metadatas"][0] if results.get("metadatas") else []
                distances = results["distances"][0] if results.get("distances") else []

                for i in range(len(ids)):
                    hits.append({
                        "chunk_id": ids[i],
                        "text": documents[i] if i < len(documents) else "",
                        "metadata": metadatas[i] if i < len(metadatas) else {},
                        "distance": distances[i] if i < len(distances) else 0.0
                    })
            return hits
        except Exception as exc:
            logger.error(
                f"VectorStore failures: Query execution failed: {str(exc)}"
            )
            raise VectorStoreError(
                f"Failed to search vector store matching query embedding: {str(exc)}"
            ) from exc
