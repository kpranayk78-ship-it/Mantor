import sys
from pathlib import Path
import logging

# Configure basic logging to see pipeline output
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")

from app.models.document import Document
from app.services.document_pipeline import DocumentProcessingPipeline
from app.services.vector_store_service import VectorStoreService

def run_test():
    print("=== Starting E2E Document Pipeline Test ===")
    
    # 1. Find a document to process
    doc_dir = Path("storage/documents")
    pdf_files = list(doc_dir.glob("*.pdf"))
    if not pdf_files:
        print("Error: No PDF files found in storage/documents. Please upload a file first.")
        sys.exit(1)
        
    target_pdf = pdf_files[0]
    print(f"Using document: {target_pdf.name}")
    
    # Create Document model
    doc = Document(
        original_filename="sample_test.pdf",
        stored_filename=target_pdf.name,
        file_path=target_pdf
    )
    print(f"Document model initialized. ID: {doc.document_id}")
    
    # 2. Run the pipeline
    print("Initializing pipeline...")
    pipeline = DocumentProcessingPipeline()
    print("Running document processing...")
    embedded_doc = pipeline.process_document(doc)
    
    print("\n=== Pipeline Execution Success ===")
    print(f"Status: {doc.status}")
    print(f"Total chunks: {embedded_doc.total_chunks}")
    
    # 3. Verify ChromaDB
    print("\n=== Verifying ChromaDB ===")
    vs = VectorStoreService()
    print(f"Document exists in ChromaDB: {vs.document_exists(doc.document_id)}")
    
    # 4. Try searching ChromaDB
    print("Testing search...")
    # Get embedding of the first chunk to search
    first_chunk_emb = embedded_doc.embedded_chunks[0].embedding
    hits = vs.search(first_chunk_emb, top_k=2)
    print(f"Found {len(hits)} hits:")
    for i, hit in enumerate(hits):
        print(f"Hit {i+1}: ID={hit['chunk_id']}, Text snippet='{hit['text'][:60]}...', Distance={hit['distance']}")
        
    print("\n=== E2E Test Completed Successfully ===")

if __name__ == "__main__":
    run_test()
