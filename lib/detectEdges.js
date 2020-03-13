/**
 * Check pixels transparency
 * @param {Number} tolerance - tolerance level
 * @returns {Function}
 */
const checkOpacityLevel = (tolerance) => (pixels) => {
    let transparent = true;
    for (let i = 3, l = pixels.length; i < l && transparent; i += 4) {
        transparent = transparent && pixels[i] === 255 * tolerance;
    }
    return transparent;
};
/**
 * Check pixels transparency
 * @param {Number} tolerance - tolerance level
 * @returns {Function}
 */
const checkWhite = (tolerance) => (pixels) => {
    let isWhite = true;
    for (let i = 0, l = pixels.length; i < l && isWhite; i += 4) {
        isWhite = isWhite && pixels[i] === 255 && pixels[i + 1] === 255 && pixels[i + 2] === 255 && pixels[i + 3] === 255;
    }
    return isWhite;
};

const defaultOptions = {
    tolerance: 0,
};

/**
 * @typedef {Object} Options
 * @prop {Number} tolerance - Level of tolerance for the transparency between 0 and 1 (0 mean no tolerance, 1 mean everything is treated as transparent)
 */
/**
 * Smartly detect edges of an image
 * @param {HTMLCanvasElement} canvas - Tainted canvas element
 * @param {Options} options - Some options
 * @returns {{top: number, left: number, bottom: number, right: number}}
 */
module.exports = ((canvas, options) => {
    const { tolerance } = Object.assign({}, defaultOptions, options);

    // const isTransparent = checkOpacityLevel(tolerance);
    const isWhite = checkWhite(tolerance);

    const context = canvas.getContext('2d');
    const { width, height } = canvas;
    let pixels;

    let top = -1;
    do {
        ++top;
        pixels = context.getImageData(0, top, width, 1).data;
    } while (isWhite(pixels));

    if (top === height) {
        throw new Error("Can't detect edges.");
    }

    // Left
    let left = -1;
    do {
        ++left;
        pixels = context.getImageData(left, top, 1, height - top).data;
    } while (isWhite(pixels));

    // Bottom
    let bottom = -1;
    do {
        ++bottom;
        pixels = context.getImageData(left, height - bottom - 1, width - left, 1).data;
    } while (isWhite(pixels));

    // Right
    let right = -1;
    do {
        ++right;
        pixels = context.getImageData(width - right - 1, top, 1, height - (top + bottom)).data;
    } while (isWhite(pixels));

    return {
        top,
        right,
        bottom,
        left,
    };
});

