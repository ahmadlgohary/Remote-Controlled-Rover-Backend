from io import BytesIO
from PIL import Image, UnidentifiedImageError


def is_valid_image(image_bytes: bytes) -> bool:
    """
    This function checks whether a byte stream represents a valid image,
    by ensuring the byte stream exceeds the minimum size threshold,
    then attempting to decode it using the Python Imaging Library

    Args:
        image_bytes (bytes): Raw image data as a byte stream
    Returns:
        bool:  True if the byte stream is large enough and
               can be decoded as an image, False otherwise
    """
    if len(image_bytes) > 5000:
        try:
            Image.open(BytesIO(image_bytes))
            return True
        except UnidentifiedImageError:
            print("Invalid image")
    return False
