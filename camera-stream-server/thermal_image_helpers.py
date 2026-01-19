import math
from PIL import Image
from io import BytesIO

MINTEMP = 25.0  # low range of the sensor (deg C)
MAXTEMP = 45.0  # high range of the sensor (deg C)
COLORDEPTH = 1000  # how many color values we can have
INTERPOLATE = 10  # scale factor for final image

# heatmap gradient defined as (position, (r, b, g))
heatmap = (
    (0.0, (0, 0, 0)),
    (0.20, (0, 0, 0.5)),
    (0.40, (0, 0.5, 0)),
    (0.60, (0.5, 0, 0)),
    (0.80, (0.75, 0.75, 0)),
    (0.90, (1.0, 0.75, 0)),
    (1.00, (1.0, 1.0, 1.0)),
)

# List of RGB tuples for fast lookup
colormap = [0] * COLORDEPTH


def constrain(val, min_val, max_val):
    """
    Constrain a value to lie between min_val and max_val.

    Args:
        val (float): Input value
        min_val (float): Minimum allowed value
        max_val (float): Maximum allowed value

    Returns:
        float: Constrained value within [min_val, max_val]
    """
    return min(max_val, max(min_val, val))


def map_value(x, in_min, in_max, out_min, out_max):
    """
    Linearly map a value from one range to another.

    Args:
        x (float): Input value
        in_min (float): Minimum of input range
        in_max (float): Maximum of input range
        out_min (float): Minimum of output range
        out_max (float): Maximum of output range

    Returns:
        float: Mapped value in the output range
    """
    return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min


def gaussian(x, a, b, c, d=0):
    """
    Gaussian function used for smooth blending of colors.

    Args:
        x (float): Input value
        a (float): Amplitude
        b (float): Mean
        c (float): Standard deviation
        d (float, optional): Offset. Defaults to 0.

    Returns:
        float: Gaussian value at x
    """
    return a * math.exp(-((x - b) ** 2) / (2 * c**2)) + d


def gradient(x, width, cmap, spread=1):
    """
    Compute an RGB color at a given position using a gradient colormap.

    Args:
        x (float): Position along the colormap (0 to width)
        width (int): Total width of the colormap
        cmap (list of tuples): Gradient definition (position, (r,g,b))
        spread (float, optional): Spread factor controlling blending. Defaults to 1.

    Returns:
        tuple[int, int, int]: RGB color as integers 0-255
    """
    width = float(width)
    r = sum(
        gaussian(x, p[1][0], p[0] * width, width / (spread * len(cmap))) for p in cmap
    )
    g = sum(
        gaussian(x, p[1][1], p[0] * width, width / (spread * len(cmap))) for p in cmap
    )
    b = sum(
        gaussian(x, p[1][2], p[0] * width, width / (spread * len(cmap))) for p in cmap
    )
    r = int(constrain(r * 255, 0, 255))
    g = int(constrain(g * 255, 0, 255))
    b = int(constrain(b * 255, 0, 255))
    return r, g, b


def create_thermal_image(frame):
    """
    Convert a 32x24 thermal sensor matrix into a scaled, colored JPEG image.

    Args:
        frame (list[float]): 32x24 array of temperature readings in °C.

    Returns:
        bytes: JPEG-encoded image data
    """

    # precompute the colormap
    for i in range(COLORDEPTH):
        colormap[i] = gradient(i, COLORDEPTH, heatmap)

    # Map each temperature value to a color index in the colormap
    pixels = [0] * 768  # 32*24
    for i, pixel in enumerate(frame):
        coloridx = map_value(pixel, MINTEMP, MAXTEMP, 0, COLORDEPTH - 1)
        coloridx = int(constrain(coloridx, 0, COLORDEPTH - 1))
        pixels[i] = colormap[coloridx]

    # create the image
    img = Image.new("RGB", (32, 24))
    img.putdata(pixels)
    img = img.transpose(Image.FLIP_TOP_BOTTOM)
    img = img.resize((32 * INTERPOLATE, 24 * INTERPOLATE), Image.BICUBIC)
    buf = BytesIO()
    img.save(buf, format="JPEG")
    return buf.getvalue()
