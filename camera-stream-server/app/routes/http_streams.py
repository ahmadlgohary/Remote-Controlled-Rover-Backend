import asyncio
from io import BytesIO
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from PIL import Image

from app import state
from thermal_image_helpers import create_thermal_image

router = APIRouter()


@router.get("/normal_stream")
async def normal_stream():
    """
    This function returns an MJPEG streaming HTTP response of the latest received normal camera images

    Args:
        None

    Returns:
        StreamingResponse: An HTTP response streaming JPEG frames of the normal camera feed.
    """

    async def image_stream():
        """
        Asynchronous generator that continuously yields the latest normal camera image
        from shared state as JPEG frames in multipart/x-mixed-replace format for MJPEG streaming.

        Yields:
            bytes: A single JPEG frame formatted for MJPEG streaming.
        """
        while True:
            if state.image_data:
                try:
                    image = Image.open(BytesIO(state.image_data))
                    buf = BytesIO()
                    image.save(buf, format="JPEG")
                    frame = buf.getvalue()
                    yield (
                        b"--frame\r\n"
                        b"Content-Type: image/jpeg\r\n\r\n" + frame + b"\r\n"
                    )
                    await asyncio.sleep(0.05)
                except Exception:
                    continue
            else:
                await asyncio.sleep(0.1)

    return StreamingResponse(
        image_stream(), media_type="multipart/x-mixed-replace; boundary=frame"
    )


@router.get("/thermal_stream")
async def thermal_stream():
    """
    This function returns an MJPEG streaming HTTP response of the latest received thermal camera images

    Args:
        None

    Returns:
        StreamingResponse: An HTTP response streaming JPEG frames of the thermal camera feed.
    """

    async def image_stream():
        """
        Asynchronous generator that continuously yields the latest thermal camera image
        from shared state as JPEG frames in multipart/x-mixed-replace format for MJPEG streaming.

        Yields:
            bytes: A single JPEG frame formatted for MJPEG streaming.
        """
        while True:
            if state.thermal_image_data:
                try:
                    frame = create_thermal_image(state.thermal_image_data)
                    yield (
                        b"--frame\r\n"
                        b"Content-Type: image/jpeg\r\n\r\n" + frame + b"\r\n"
                    )
                    await asyncio.sleep(0.05)
                except Exception as e:
                    print(e)
            else:
                await asyncio.sleep(0.1)

    return StreamingResponse(
        image_stream(), media_type="multipart/x-mixed-replace; boundary=frame"
    )
