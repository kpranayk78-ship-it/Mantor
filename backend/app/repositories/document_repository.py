from abc import ABC, abstractmethod
import json
import logging
from pathlib import Path
from app.core.config import settings
from app.models.chunked_document import ChunkedDocument

# Configure logger
logger = logging.getLogger("app.repositories.document_repository")


class DocumentRepositoryError(Exception):
    """
    Custom exception raised when document repository operations fail.
    """
    pass


class BaseDocumentRepository(ABC):
    """
    Abstract interface defining the contract for processed document repositories.
    """

    @abstractmethod
    def save(self, chunked_document: ChunkedDocument) -> None:
        """
        Save the processed ChunkedDocument.

        Args:
            chunked_document (ChunkedDocument): The document to persist.

        Raises:
            DocumentRepositoryError: If saving fails.
        """
        pass

    @abstractmethod
    def load(self, document_id: str) -> ChunkedDocument:
        """
        Load the ChunkedDocument matching the given document_id.

        Args:
            document_id (str): The ID of the document to load.

        Returns:
            ChunkedDocument: The retrieved document.

        Raises:
            DocumentRepositoryError: If loading fails or the document is missing.
        """
        pass

    @abstractmethod
    def delete(self, document_id: str) -> None:
        """
        Delete the stored ChunkedDocument matching the given document_id.

        Args:
            document_id (str): The ID of the document to delete.

        Raises:
            DocumentRepositoryError: If deletion fails or the document is missing.
        """
        pass

    @abstractmethod
    def exists(self, document_id: str) -> bool:
        """
        Check if a ChunkedDocument with the given document_id exists in storage.

        Args:
            document_id (str): The ID of the document.

        Returns:
            bool: True if it exists, False otherwise.
        """
        pass

    @abstractmethod
    def list_documents(self) -> list[str]:
        """
        List all processed document IDs.

        Returns:
            list[str]: A list of document IDs (UUIDs) currently stored.

        Raises:
            DocumentRepositoryError: If listing fails.
        """
        pass


class DocumentRepository(BaseDocumentRepository):
    """
    JSON file-based implementation of BaseDocumentRepository.

    Persists ChunkedDocument data in the configured local directory.
    """

    def __init__(self, storage_dir: str | Path = None):
        """
        Initialize the JSON Document Repository.

        Args:
            storage_dir (str | Path, optional): Custom path to storage directory.
                Defaults to settings.PROCESSED_DOCUMENTS_DIRECTORY.
        """
        if storage_dir is None:
            self.storage_dir = Path(settings.PROCESSED_DOCUMENTS_DIRECTORY)
        else:
            self.storage_dir = Path(storage_dir)

        try:
            self.storage_dir.mkdir(parents=True, exist_ok=True)
        except Exception as exc:
            logger.error(
                f"Failed to create repository storage directory at '{self.storage_dir}': {str(exc)}"
            )
            raise DocumentRepositoryError(
                f"Failed to initialize repository storage folder: {str(exc)}"
            ) from exc

    def _get_file_path(self, document_id: str) -> Path:
        """
        Get the target file path for a given document_id.
        """
        return self.storage_dir / f"{document_id}.json"

    def save(self, chunked_document: ChunkedDocument) -> None:
        """
        Save the ChunkedDocument to a JSON file.
        """
        file_path = self._get_file_path(chunked_document.document_id)
        logger.info(f"Saving document {chunked_document.document_id} to '{file_path}'")

        try:
            json_data = chunked_document.model_dump_json(indent=2)
            file_path.write_text(json_data, encoding="utf-8")
        except Exception as exc:
            logger.error(
                f"Failed to save document '{chunked_document.document_id}' to '{file_path}': {str(exc)}"
            )
            raise DocumentRepositoryError(
                f"Failed to save document '{chunked_document.document_id}': {str(exc)}"
            ) from exc

    def load(self, document_id: str) -> ChunkedDocument:
        """
        Load the ChunkedDocument from a JSON file.
        """
        file_path = self._get_file_path(document_id)
        logger.info(f"Loading document {document_id} from '{file_path}'")

        if not file_path.exists():
            logger.error(f"Load failed: Document '{document_id}' does not exist at '{file_path}'")
            raise DocumentRepositoryError(
                f"Document with ID '{document_id}' not found in storage."
            )

        try:
            json_content = file_path.read_text(encoding="utf-8")
        except Exception as exc:
            logger.error(
                f"Failed to read file for document '{document_id}' at '{file_path}': {str(exc)}"
            )
            raise DocumentRepositoryError(
                f"Failed to read document file for '{document_id}': {str(exc)}"
            ) from exc

        try:
            data = json.loads(json_content)
        except json.JSONDecodeError as dec_err:
            logger.error(
                f"Corrupted JSON encountered for document '{document_id}' at '{file_path}': {str(dec_err)}"
            )
            raise DocumentRepositoryError(
                f"Failed to parse document '{document_id}' (Corrupted JSON format): {str(dec_err)}"
            ) from dec_err

        try:
            return ChunkedDocument.model_validate(data)
        except Exception as val_err:
            logger.error(
                f"Validation failed when loading document '{document_id}' from '{file_path}': {str(val_err)}"
            )
            raise DocumentRepositoryError(
                f"Data validation failed for loaded document '{document_id}': {str(val_err)}"
            ) from val_err

    def delete(self, document_id: str) -> None:
        """
        Delete the JSON file representing the document_id.
        """
        file_path = self._get_file_path(document_id)
        logger.info(f"Deleting document {document_id} from '{file_path}'")

        if not file_path.exists():
            logger.error(f"Delete failed: Document '{document_id}' does not exist at '{file_path}'")
            raise DocumentRepositoryError(
                f"Document with ID '{document_id}' not found for deletion."
            )

        try:
            file_path.unlink()
        except Exception as exc:
            logger.error(
                f"Failed to unlink file '{file_path}' for document '{document_id}': {str(exc)}"
            )
            raise DocumentRepositoryError(
                f"Failed to delete document file for '{document_id}': {str(exc)}"
            ) from exc

    def exists(self, document_id: str) -> bool:
        """
        Check if the JSON file for the document_id exists.
        """
        return self._get_file_path(document_id).exists()

    def list_documents(self) -> list[str]:
        """
        List all processed document IDs (filenames without .json).
        """
        try:
            return [f.stem for f in self.storage_dir.glob("*.json") if f.is_file()]
        except Exception as exc:
            logger.error(
                f"Failed to list JSON document files in '{self.storage_dir}': {str(exc)}"
            )
            raise DocumentRepositoryError(f"Failed to list documents: {str(exc)}") from exc
