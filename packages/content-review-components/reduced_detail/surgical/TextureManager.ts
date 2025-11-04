/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

/**
 * Class TextureManager
 *
 * Create textures and provide simple methods for this textures
 */
import ShaderProperties from './ShaderProperties';

export class TextureManager {
  gl: WebGL2RenderingContext;
  lastImage: HTMLImageElement | null = null;
  lastVideo: HTMLVideoElement | null = null;
  cachedTexture: WebGLTexture | null = null;
  lastMaxSize: number = -1;
  originalImageSize: {width: number; height: number} = {width: 0, height: 0};
  originalVideoSize: {width: number; height: number} = {width: 0, height: 0};
  textureHeight: number = 0;
  textureWidth: number = 0;

  constructor(gl: WebGL2RenderingContext) {
    this.gl = gl;
  }

  /**
   * Create an empty texture and set default settings
   *
   * @return WebGLTexture Created texture
   */
  createTexture(): WebGLTexture | null {
    const gl = this.gl;
    const newTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, newTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    return newTexture;
  }

  /**
   * Call callback function that image is loaded and set lastMaxSize to an
   * invalid value to make sure, that not the last cached texture will be returned in
   * Before it will be binded, it will be downscaled if necessary.
   * After this call the callback function onReadyCallback.
   *
   * @param HTMLImageElement The source image
   * @param function The callback function.
   */
  imageLoaded(image: HTMLImageElement, onReadyCallback: () => void) {
    this.cachedTexture = null;
    this.lastImage = image;
    this.originalImageSize = {
      width: image.naturalWidth,
      height: image.naturalHeight,
    };
    onReadyCallback();
  }

  /**
   * Same as imageLoaded, but for video. Unsets the cache so that new texture is properly used.
   *
   * @param HTMLVideoElement The source video
   * @param function The callback function.
   */
  videoLoaded(video: HTMLVideoElement, onReadyCallback: () => void) {
    this.cachedTexture = null;
    this.lastVideo = video;
    this.originalVideoSize = {
      width: video.videoWidth,
      height: video.videoHeight,
    };
    onReadyCallback();
  }

  /**
   * Return texture of last loaded video. In case maximum size don't have changed,
   * return prevent uploading to gpu;
   *
   * @return WebGLTexture Return downscaled texture of video frame or null, if no video is loaded
   */
  getLastVideoTexture(): WebGLTexture | null {
    if (this.lastVideo === null) {
      return null;
    }

    const maxSize = ShaderProperties.values.max_size;
    const w = this.originalVideoSize.width;
    const h = this.originalVideoSize.height;

    if (maxSize > 0) {
      if (w > h) {
        if (w > maxSize) {
          this.textureWidth = maxSize;
          this.textureHeight = maxSize;
        } else {
          this.textureWidth = w;
          this.textureHeight = w;
        }
      } else {
        if (h > maxSize) {
          this.textureWidth = maxSize;
          this.textureHeight = maxSize;
        } else {
          this.textureWidth = h;
          this.textureHeight = h;
        }
      }
    }

    this.lastMaxSize = maxSize;

    const texture = this.createTexture();
    const gl = this.gl;
    try {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      // $FlowFixMe[incompatible-call] Overloaded method definition not being picked up properly by Flow
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        this.lastVideo,
      );
    } catch (error) {
      console.error('Unable to process video');
      console.error(error);
      return null;
    }
    return texture;
  }

  /**
   * Return texture of last loaded image. In case maximum size don't have changed,
   * return prevent uploading to gpu;
   *
   * @return WebGLTexture Return downscaled texture of image or null, if no image is loaded
   */
  getLastImageTexture(): WebGLTexture | null {
    if (this.lastImage === null) {
      return null;
    }

    const maxSize = ShaderProperties.values.max_size;
    const w = this.originalImageSize.width;
    const h = this.originalImageSize.height;

    if (maxSize > 0) {
      if (w > h) {
        if (w > maxSize) {
          this.textureWidth = maxSize;
          this.textureHeight = maxSize;
        } else {
          this.textureWidth = w;
          this.textureHeight = w;
        }
      } else {
        if (h > maxSize) {
          this.textureWidth = maxSize;
          this.textureHeight = maxSize;
        } else {
          this.textureWidth = h;
          this.textureHeight = h;
        }
      }
    }

    this.lastMaxSize = maxSize;

    const texture = this.createTexture();
    const gl = this.gl;
    try {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      // $FlowFixMe[incompatible-call] Overloaded method definition not being picked up properly by Flow
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        this.lastImage,
      );
    } catch (error) {
      console.error('Unable to process image');
      console.log(error);
      return null;
    }
    return texture;
  }

  /**
   * Create an texture and set dimension to size of last loaded image.
   *
   * @return WebGLTexture Created texture with dimension of last loaded image.
   */
  getTextureWithLastDimension(): WebGLTexture | null {
    const texture = this.createTexture();
    const gl = this.gl;
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGB,
      this.textureWidth,
      this.textureHeight,
      0,
      gl.RGB,
      gl.UNSIGNED_BYTE,
      null,
    );
    return texture;
  }

  /**
   * Change filter type of a texture
   *
   * @param GLint filter type
   */
  changeFilter(texture: WebGLTexture | null, filterType: number) {
    const gl = this.gl;
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filterType);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filterType);
  }
}
