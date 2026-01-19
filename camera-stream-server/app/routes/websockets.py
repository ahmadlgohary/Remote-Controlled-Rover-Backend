from fastapi import APIRouter, WebSocket
from json import loads

from app import state
from app.utils import is_valid_image

router = APIRouter()


@router.websocket("/normal")
async def image_ws(websocket: WebSocket):
    """
    WebSocket endpoint that receives binary image frames, validates them,
    and stores the latest valid image in shared application state.

    Args:
        websocket (WebSocket): Active WebSocket connection used to receive image data.

    Returns:
        None
    """
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive()
            image_bytes = data.get("bytes")
            if image_bytes and is_valid_image(image_bytes):
                state.image_data = image_bytes
    except Exception:
        pass


@router.websocket("/thermal")
async def thermal_ws(websocket: WebSocket):
    """
    WebSocket endpoint that receives JSON-formatted thermal image data,
    and stores the latest valid image in shared application state.

    Args:
        websocket (WebSocket): Active WebSocket connection used to receive thermal image data.

    Returns:
        None
    """
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive()
            payload = loads(data.get("text"))
            if payload:
                state.thermal_image_data = payload
    except Exception:
        pass
