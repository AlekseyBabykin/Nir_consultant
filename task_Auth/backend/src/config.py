# configuration file for Flask app (keys, database URLs ...)
from dotenv import load_dotenv

import os

load_dotenv()

class Config:
  SQLALCHEMY_DATABASE_URI: str = os.environ.get('DATABASE_URL')
  JWT_SECRET_KEY: str = os.environ.get('SECRET_KEY')
  SQLALCHEMY_TRACK_MODIFICATIONS: bool = False
  PORT: int = os.environ.get('PORT') or 5000
  HOST: str = os.environ.get('HOST') or '127.0.0.1'
  ENVIRONMENT: str = os.environ.get('ENVIRONMENT')
  CORS_ALLOWED_ORIGINS: str | None = os.environ.get('CORS_ALLOWED_ORIGINS')