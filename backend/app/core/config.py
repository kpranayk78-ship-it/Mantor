from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str = "Mantor"
    APP_VERSION: str = "1.0.0"

    GROQ_API_KEY: str

    UPLOAD_DIRECTORY: str = "storage/documents"
    PROCESSED_DOCUMENTS_DIRECTORY: str = "storage/processed"

    CHUNK_SIZE: int = 800
    CHUNK_OVERLAP: int = 150

    EMBEDDING_MODEL: str = "all-MiniLM-L6-v2"

    CHROMA_DIRECTORY: str = "storage/chroma"
    CHROMA_COLLECTION: str = "industrial_documents"

    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True
    )


settings = Settings()