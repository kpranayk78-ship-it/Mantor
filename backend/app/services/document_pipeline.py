import logging
from app.models.document import Document
from app.models.document_status import DocumentStatus
from app.models.chunked_document import ChunkedDocument
from app.models.embedded_document import EmbeddedDocument
from app.services.parser_service import parse_pdf
from app.services.chunk_service import chunk_document
from app.repositories.document_repository import BaseDocumentRepository, DocumentRepository
from app.services.embedding_service import BaseEmbeddingService, EmbeddingService
from app.services.vector_store_service import BaseVectorStoreService, VectorStoreService

# Configure logger
logger = logging.getLogger("app.services.document_pipeline")


class DocumentPipelineError(Exception):
    """
    Custom exception raised when the document processing pipeline fails.
    """
    pass


class DocumentProcessingPipeline:
    """
    Orchestration service that coordinates the complete document processing workflow.

    This orchestrator controls pipeline flow, transitions the status of the Document model,
    coordinates the parser, chunker, repository, embedding, and vector store services.
    """

    def __init__(
        self,
        repository: BaseDocumentRepository = None,
        embedding_service: BaseEmbeddingService = None,
        vector_store_service: BaseVectorStoreService = None
    ):
        """
        Initialize the pipeline orchestrator with its dependencies.

        Args:
            repository (BaseDocumentRepository, optional): Repository to persist chunked documents.
            embedding_service (BaseEmbeddingService, optional): Service to generate chunk embeddings.
            vector_store_service (BaseVectorStoreService, optional): Service to store embeddings in ChromaDB.
        """
        self.repository = repository or DocumentRepository()
        self.embedding_service = embedding_service or EmbeddingService()
        self.vector_store_service = vector_store_service or VectorStoreService()

    def process_document(self, document: Document) -> EmbeddedDocument:
        """
        Process the document through the complete workflow.

        Transitions:
        UPLOADED -> PARSING -> PARSED -> CHUNKED -> EMBEDDED -> INDEXED

        Args:
            document (Document): The input Document object containing file metadata.

        Returns:
            EmbeddedDocument: The final embedded representation of the document stored in the vector DB.

        Raises:
            DocumentPipelineError: If any pipeline step fails.
        """
        logger.info(
            f"Starting processing document: {document.original_filename} "
            f"(ID: {document.document_id})"
        )

        # 1. Move to PARSING
        document.status = DocumentStatus.PARSING
        logger.info(f"Status → {document.status.name}")

        try:
            parsed_doc = parse_pdf(document)
            logger.info("Parsing completed")
        except Exception as parser_err:
            document.status = DocumentStatus.FAILED
            logger.error(
                f"Processing failed: Parser error for '{document.original_filename}': {str(parser_err)}"
            )
            raise DocumentPipelineError(
                f"Parser failed for document '{document.original_filename}': {str(parser_err)}"
            ) from parser_err

        # 2. Move to PARSED
        document.status = DocumentStatus.PARSED
        logger.info(f"Status → {document.status.name}")

        # 3. Call Chunking Service
        try:
            chunked_doc = chunk_document(parsed_doc)
            logger.info("Chunking completed")
        except Exception as chunker_err:
            document.status = DocumentStatus.FAILED
            logger.error(
                f"Processing failed: Chunker error for '{document.original_filename}': {str(chunker_err)}"
            )
            raise DocumentPipelineError(
                f"Chunker failed for document '{document.original_filename}': {str(chunker_err)}"
            ) from chunker_err

        # 4. Move to CHUNKED
        document.status = DocumentStatus.CHUNKED
        logger.info(f"Status → {document.status.name}")

        # 5. Persist the Chunked Document
        try:
            self.repository.save(chunked_doc)
            logger.info("Persistence completed")
        except Exception as save_err:
            document.status = DocumentStatus.FAILED
            logger.error(
                f"Processing failed: Repository save error for '{document.original_filename}': {str(save_err)}"
            )
            raise DocumentPipelineError(
                f"Persistence failed for document '{document.original_filename}': {str(save_err)}"
            ) from save_err

        # 6. Call Embedding Service
        try:
            embedded_doc = self.embedding_service.embed_document(chunked_doc)
            document.status = DocumentStatus.EMBEDDED
            logger.info(f"Status → {document.status.name}")
        except Exception as embed_err:
            document.status = DocumentStatus.FAILED
            logger.error(
                f"Processing failed: Embedding error for '{document.original_filename}': {str(embed_err)}"
            )
            raise DocumentPipelineError(
                f"Embedding failed for document '{document.original_filename}': {str(embed_err)}"
            ) from embed_err

        # 7. Call Vector Store Service
        try:
            self.vector_store_service.store_document(embedded_doc)
            document.status = DocumentStatus.INDEXED
            logger.info(f"Status → {document.status.name}")
        except Exception as vs_err:
            document.status = DocumentStatus.FAILED
            logger.error(
                f"Processing failed: Vector store error for '{document.original_filename}': {str(vs_err)}"
            )
            raise DocumentPipelineError(
                f"Vector store storage failed for document '{document.original_filename}': {str(vs_err)}"
            ) from vs_err

        logger.info(f"Processing finished successfully")
        return embedded_doc
