import logging
from abc import ABC, abstractmethod
from app.core.config import settings
from app.models.chunked_document import ChunkedDocument
from app.models.embedded_document import EmbeddedDocument
from app.models.embedded_chunk import EmbeddedChunk

# Configure logger
logger = logging.getLogger("app.services.embedding_service")


class EmbeddingServiceError(Exception):
    """
    Custom exception raised when embedding generation fails.
    """
    pass


class BaseEmbeddingService(ABC):
    """
    Abstract interface defining the contract for embedding generation services.
    """

    @abstractmethod
    def embed_document(self, chunked_document: ChunkedDocument) -> EmbeddedDocument:
        """
        Generate embeddings for the chunks of a document.

        Args:
            chunked_document (ChunkedDocument): The document with text chunks.

        Returns:
            EmbeddedDocument: The document with generated chunk embeddings.

        Raises:
            EmbeddingServiceError: If embedding fails.
        """
        pass


class EmbeddingService(BaseEmbeddingService):
    """
    Sentence-transformers-based implementation of the BaseEmbeddingService.

    Loads the specified embedding model once during initialization and
    generates vector embeddings in batches.
    """

    def __init__(self, model_name: str = None):
        """
        Initialize the local Embedding Service and load the model.

        Args:
            model_name (str, optional): Name of the sentence-transformers model.
                Defaults to settings.EMBEDDING_MODEL.
        """
        self.model_name = model_name or settings.EMBEDDING_MODEL
        logger.info(f"Loading embedding model: {self.model_name}")

        try:
            # Import sentence-transformers dynamically to allow isolated mocking/importing
            from sentence_transformers import SentenceTransformer
            self.model = SentenceTransformer(self.model_name)
            logger.info("Embedding model loaded successfully")
        except Exception as exc:
            logger.error(
                f"Embedding failures: Failed to load model '{self.model_name}': {str(exc)}"
            )
            raise EmbeddingServiceError(
                f"Failed to initialize embedding model '{self.model_name}': {str(exc)}"
            ) from exc

    def embed_document(self, chunked_document: ChunkedDocument) -> EmbeddedDocument:
        """
        Generate embeddings for all chunks in a ChunkedDocument in a single batch.

        Args:
            chunked_document (ChunkedDocument): The document containing text chunks.

        Returns:
            EmbeddedDocument: The resulting document containing embedded chunks.

        Raises:
            EmbeddingServiceError: If chunk list is empty, chunks are invalid, or model fails.
        """
        logger.info(f"Embedding started for document: {chunked_document.document_id}")

        if not chunked_document.chunks:
            logger.error(
                f"Embedding failed: Document '{chunked_document.document_id}' has no chunks."
            )
            raise EmbeddingServiceError("Chunk list is empty.")

        # Extract and validate chunk texts
        texts = []
        for idx, chunk in enumerate(chunked_document.chunks):
            if not chunk.text or not isinstance(chunk.text, str) or not chunk.text.strip():
                logger.error(
                    f"Embedding failed: Invalid or empty chunk text at index {idx} "
                    f"for document '{chunked_document.document_id}'"
                )
                raise EmbeddingServiceError(
                    f"Invalid or empty chunk text at index {idx} in document '{chunked_document.document_id}'."
                )
            texts.append(chunk.text)

        try:
            logger.info(f"Encoding {len(texts)} chunks using '{self.model_name}'")
            # Batch encode the texts
            embeddings = self.model.encode(texts, convert_to_numpy=True)
        except Exception as exc:
            logger.error(
                f"Embedding failures: Model encoding failed for document "
                f"'{chunked_document.document_id}': {str(exc)}"
            )
            raise EmbeddingServiceError(
                f"Model failed to generate embeddings for '{chunked_document.document_id}': {str(exc)}"
            ) from exc

        embedded_chunks = []
        for idx, chunk in enumerate(chunked_document.chunks):
            # Convert numpy float array to List[float]
            embedding_list = embeddings[idx].tolist()

            embedded_chunk = EmbeddedChunk(
                chunk_id=chunk.chunk_id,
                document_id=chunk.document_id,
                page_number=chunk.page_number,
                chunk_index=chunk.chunk_index,
                text=chunk.text,
                embedding=embedding_list,
                metadata=chunk.metadata
            )
            embedded_chunks.append(embedded_chunk)

        logger.info(
            f"Embedding completed. Successfully embedded {len(embedded_chunks)} chunks "
            f"for document: {chunked_document.document_id}"
        )

        return EmbeddedDocument(
            document_id=chunked_document.document_id,
            total_chunks=len(embedded_chunks),
            embedded_chunks=embedded_chunks
        )
