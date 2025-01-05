import os
import sys
from pathlib import Path
from dotenv import load_dotenv

def main():
    # Point BASE_DIR to the directory containing manage.py
    BASE_DIR = Path(__file__).resolve().parent

    # Specify the exact location of the .env file
    ENV_PATH = BASE_DIR / "backend" / ".env"  
    load_dotenv(dotenv_path=ENV_PATH)

    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django..."
        ) from exc
    execute_from_command_line(sys.argv)

if __name__ == "__main__":
    main()
