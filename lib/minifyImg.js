const imagemin = require('imagemin');
const imageminPngquant = require('imagemin-pngquant');
/**
 * minify an image, just support png
 *
 * @param {string} imgPath
 * @param {string} outputDir Output dir
 * @returns
 */
module.exports = function minifyImg(imgPath, outputDir) {
    return imagemin([imgPath], {
        destination: outputDir,
        plugins: [imageminPngquant()],
    });
};
