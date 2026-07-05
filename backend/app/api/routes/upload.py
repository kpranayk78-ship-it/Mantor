from fastapi import APIRouter, UploadFile, File, BackgroundTasks

from app.schemas.upload import UploadResponse
from app.services.upload_service import save_uploaded_file
from app.utils.file_validation import validate_uploaded_file
from app.services.document_pipeline import DocumentProcessingPipeline

router = APIRouter(
    prefix="/upload",
    tags=["Upload"]
)


@router.post("/", response_model=UploadResponse)
def upload_document(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    validate_uploaded_file(file)

    uploaded_file = save_uploaded_file(file)

    # Trigger the processing pipeline in the background
    try:
        pipeline = DocumentProcessingPipeline()
        background_tasks.add_task(pipeline.process_document, uploaded_file)
    except Exception as exc:
        import logging
        logger = logging.getLogger("app.api.routes.upload")
        logger.error(f"Failed to initialize document processing pipeline: {str(exc)}")

    return uploaded_file