from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str = "Mantor"
    APP_VERSION: str = "1.0.0"

    GROQ_API_KEY: str

    UPLOAD_DIRECTORY: str = "storage/documents"

    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True
    )


settings = Settings()