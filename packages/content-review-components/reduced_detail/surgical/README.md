Files in this folder come from the Reducing Affective Responses to Surgical Images and
Videos Through Stylization paper, with only some relevant modifications to make it work in the context of our apps.

Citation:
Lonni Besançon, Amir Semmo, David Biau, Bruno Frachet, Virginie Pineau, et al.. Reducing Affective
Responses to Surgical Images and Videos Through Stylization. Computer Graphics Forum, Wiley, In
press, 39, ff10.1111/cgf.13886ff. ffhal-02381513v2ff

They were published in this GitHub repo with Apache license: https://github.com/lonnibesancon/Arkangel

# HOW DOES THIS WORK???

We're calling WebGL and then running the following image processing algorithm on each image.

This algorithm is a computer graphics pipeline that applies various image processing filters to an input image. The filters are applied in the order specified in the code snippet. Here's a brief explanation of each filter:

1. `tfmTexture = tfm(gauss(sst(source)))`: This filter applies a small Gaussian blur to the input image (`source`) using a 3x3 kernel, followed by a structure tensor (SST) computation and then a total variation (TV) minimization (TFM) step. The TV minimization step helps to reduce noise and smooth the image while preserving edges.
2. `BfaTexture = bf(labTexture, {tfmTexture, n_a})`: This filter converts the input image from RGB to L*a*b\* color space and applies a bilateral filter (BF) with two parameters: `tfmTexture` and `n_a`. The BF filter helps to reduce noise while preserving edges by taking into account both spatial and color differences between pixels.
3. `cqTexture = color(bfaTexture)`: This filter applies a color quantization step to the output of the previous filter (`bfaTexture`) to reduce the number of colors in the image.
4. `bfeTexture =  bf(labTexture, {tfmTexture, n_e})`: This filter applies another bilateral filter to the L*a*b\* version of the input image (`labTexture`), using the same `tfmTexture` as before and a different parameter `n_e`.
5. `cqRgbTexture  = lab2Rgb(cqTexture)`: This filter converts the color-quantized image (`cqTexture`) back to RGB color space.
6. `edgesTexture = fDoGFilter(bfeTexture, tfmTexture)`: This filter applies a difference of Gaussians (DoG) filter to the output of the previous filter (`bfeTexture`) using the `tfmTexture` as a guidance image. The DoG filter helps to detect edges in the image while preserving texture details.
7. `mix(cqRgbTexture, edgesTexture)`: This filter combines the color-quantized RGB image (`cqRgbTexture`) and the edge image (`edgesTexture`) using a linear interpolation, resulting in an image that highlights edges while preserving color.
8. `gauss 3x3`: This is the last filter that applies a 3x3 Gaussian blur to the final image to smooth it further.

Overall, this algorithm applies a series of filters to the input image to enhance its visual quality, with a focus on reducing noise and preserving edges while maintaining color accuracy.
