from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
from pydantic import ValidationError

async def validation_exception_handler(request: Request, exc: ValidationError):
    """
    Custom handler for validation errors.
    """
    return JSONResponse(
        status_code=422,
        content={
            "message": "Validation error",
            "expected": {"score": "float"},
            "received": exc.errors()
        }
    )

async def not_found_exception_handler(request: Request, exc: HTTPException):
    """
    Custom handler for 404 errors.
    """
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "message": exc.detail,
            "path": request.url.path
        }
    )
