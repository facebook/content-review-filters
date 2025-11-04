/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

import type {ShaderProgramBase} from './shader_programs/ShaderProgramBase';

import {ColorQuantizationProgram} from './shader_programs/ColorQuantizationProgram';
import {DisplayResultProgram} from './shader_programs/DisplayResultProgram';
import {FDoG0Program} from './shader_programs/FDoG0Program';
import {FDoG1Program} from './shader_programs/FDoG1Program';
import {Gauss3x3Program} from './shader_programs/Gauss3x3Program';
import {GaussProgram} from './shader_programs/GaussProgram';
import {Lab2RgbProgram} from './shader_programs/Lab2RgbProgram';
import {MixProgram} from './shader_programs/MixProgram';
import {OrientationAlignedBilateralFilterProgram} from './shader_programs/OrientationAlignedBilateralFilterProgram';
import {Rgb2LabProgram} from './shader_programs/Rgb2LabProgram';
import {ShaderLoader} from './shaders/ShaderLoader';
import ShaderProperties from './ShaderProperties';
import {SstProgram} from './shader_programs/SstProgram';
import {TextureManager} from './TextureManager';
import {TfmProgram} from './shader_programs/TfmProgram';

/**
 * Class WebGLFilter
 *
 * Create rendering context and initialize and run rendering engine
 */
export class WebGLFilter {
  gl: WebGL2RenderingContext;
  textureManager: TextureManager;
  canvas: HTMLCanvasElement;
  canvas2dCtx: CanvasRenderingContext2D | null = null;
  drawVideoScene: () => void = () => {
    const inputTexture = this.textureManager.getLastVideoTexture();
    this.drawScene(
      inputTexture,
      ShaderProperties.values.bf_n_a_video,
      ShaderProperties.values.bf_n_e_video,
      ShaderProperties.values.dog_tau_video,
    );
  };
  drawImageScene: () => void = () => {
    const inputTexture = this.textureManager.getLastImageTexture();
    this.drawScene(
      inputTexture,
      ShaderProperties.values.bf_n_a,
      ShaderProperties.values.bf_n_e,
      ShaderProperties.values.dog_tau,
    );
  };
  drawVideoSceneNoOp: () => void = () => {
    const inputTexture = this.textureManager.getLastVideoTexture();
    this.drawSceneNoOp(inputTexture);
  };
  drawImageSceneNoOp: () => void = () => {
    const inputTexture = this.textureManager.getLastImageTexture();
    this.drawSceneNoOp(inputTexture);
  };
  drawScene(
    inputTexture: WebGLTexture | null,
    bf_n_a: number,
    bf_n_e: number,
    dog_tau: number,
  ) {
    if (inputTexture == null) {
      return;
    }

    this.resultTextures.srcTexture = inputTexture;

    if (this.resultTextures.srcTexture === null || !this.shadersReady) {
      return;
    }

    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    this.gl.viewport(
      0,
      0,
      this.textureManager.textureWidth,
      this.textureManager.textureHeight,
    );

    let tmpTexture = null;
    const labTexture = this.shaderPrograms.rgb2Lab.renderToTexture(
      this.resultTextures.srcTexture,
    );

    const sstTexture = this.shaderPrograms.sst.renderToTexture(
      this.resultTextures.srcTexture,
      null,
    );
    tmpTexture = this.shaderPrograms.gauss.renderToTexture(sstTexture);
    const tfmTexture = this.shaderPrograms.tfm.renderToTexture(tmpTexture);
    const bfeTexture = this.shaderPrograms.bf.renderToTexture(labTexture, {
      tfmTexture,
      n: bf_n_e,
    });
    const bfaTexture = this.shaderPrograms.bf.renderToTexture(labTexture, {
      tfmTexture,
      n: bf_n_a,
    });

    this.resultTextures.edgesTexture = this.fDoGFilter(
      bfeTexture,
      tfmTexture,
      dog_tau,
    );

    let cqTexture = this.shaderPrograms.color.renderToTexture(bfaTexture, null);
    cqTexture = this.shaderPrograms.gauss3x3.renderToTexture(cqTexture, null);
    this.resultTextures.cqRgbTexture =
      this.shaderPrograms.lab2Rgb.renderToTexture(cqTexture, null);

    const ovTexture = this.shaderPrograms.mix.renderToTexture(
      this.resultTextures.cqRgbTexture,
      this.resultTextures.edgesTexture,
    );

    this.resultTextures.resultTexture =
      this.shaderPrograms.gauss3x3.renderToTexture(ovTexture, null);

    this.gl.viewport(
      0,
      0,
      this.gl.drawingBufferWidth,
      this.gl.drawingBufferHeight,
    );

    this.displayResult();
  }
  drawSceneNoOp(inputTexture: WebGLTexture | null) {
    if (inputTexture == null || !this.shadersReady) {
      return;
    }

    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    this.gl.viewport(
      0,
      0,
      this.gl.drawingBufferWidth,
      this.gl.drawingBufferHeight,
    );

    this.shaderPrograms.displayResult.renderToDisplay(
      inputTexture,
      {
        srcTexture: inputTexture,
      },
      this.canvas2dCtx,
    );

    this.gl.flush();
  }
  shadersReady: boolean = false;
  shaderPrograms: Record<string, ShaderProgramBase> = {};
  resultTextures: Record<string, WebGLTexture | null> = {};

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const gl = this.initContext();
    if (gl) {
      this.gl = gl;
      this.setupContext();
      this.textureManager = new TextureManager(gl);
      this.createShaderPrograms();
    } else {
      throw Error(
        'Unable to initialize WebGL. Your browser may not support it.',
      );
    }
  }

  /**
   * Try to get a WebGL context from canvas
   *
   * @param HTMLCanvasElement Canvas element as target of WebGL
   **/
  initContext(): WebGL2RenderingContext | null {
    const gl = null;
    try {
      return this.canvas.getContext('webgl2', {
        willReadFrequently: true,
        antialias: false,
      }) as WebGL2RenderingContext;
    } catch (_e) {
      console.error('Could not initialize webgl2');
    }

    if (!gl) {
      console.error(
        'Unable to initialize WebGL. Your browser may not support it.',
      );
    }
    return null;
  }

  /**
   * Setup the WebGL context (enable cull_face, textures and set clear color to black)
   **/
  setupContext() {
    const gl = this.gl;
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.FRONT);
    // we only need one texture at same time, so we set this value fix
    gl.activeTexture(gl.TEXTURE0);
  }

  /**
   * Create all shader programs and try to start the rendering engine after this.
   */
  createShaderPrograms() {
    const shaderLoader = new ShaderLoader(this.gl);

    const shaderProgramList: Record<string, typeof ShaderProgramBase> = {
      rgb2Lab: Rgb2LabProgram,
      lab2Rgb: Lab2RgbProgram,
      gauss: GaussProgram,
      gauss3x3: Gauss3x3Program,
      displayResult: DisplayResultProgram,
      sst: SstProgram,
      tfm: TfmProgram,
      bf: OrientationAlignedBilateralFilterProgram,
      fdog0: FDoG0Program,
      fdog1: FDoG1Program,
      color: ColorQuantizationProgram,
      mix: MixProgram,
    };

    Object.entries(shaderProgramList).forEach(([name, programClass]) => {
      this.shaderPrograms[name] = new programClass(
        this.gl,
        shaderLoader,
        this.textureManager,
      );
    });
    this.shadersReady = true;
  }

  fDoGFilter(
    srcTexture: WebGLTexture | null,
    tfmTexture: WebGLTexture | null,
    dog_tau: number,
  ): WebGLTexture | null {
    if (srcTexture == null || tfmTexture == null) {
      return this.gl.createTexture() as WebGLTexture;
    }
    this.textureManager.changeFilter(srcTexture, this.gl.LINEAR);
    this.textureManager.changeFilter(tfmTexture, this.gl.NEAREST);
    let dstTexture: WebGLTexture | null =
      this.shaderPrograms.fdog0.renderToTexture(srcTexture, {
        tfmTexture,
        dog_tau,
      });
    dstTexture = this.shaderPrograms.fdog1.renderToTexture(
      dstTexture,
      tfmTexture,
    );

    return dstTexture;
  }

  displayResult() {
    if (Object.keys(this.resultTextures).length > 0) {
      const displayTexture = this.resultTextures.resultTexture;
      if (displayTexture == null) {
        return;
      }

      this.shaderPrograms.displayResult.renderToDisplay(
        displayTexture,
        {
          srcTexture: this.resultTextures.srcTexture,
        },
        this.canvas2dCtx,
      );

      this.gl.flush();
    }
  }

  filter(image: HTMLImageElement, canvas2dCtx: CanvasRenderingContext2D): void {
    if (image.naturalWidth === 0 || image.naturalHeight === 0) {
      // the passed image is not valid, thus return an empty canvas
      console.error('invalid image');
    }

    this.canvas.width = image.naturalWidth;
    this.canvas.height = image.naturalHeight;

    this.canvas2dCtx = canvas2dCtx;

    this.textureManager.imageLoaded(image, this.drawImageScene);
  }

  clearFilter() {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    this.gl.clearColor(0, 0, 0, 0);
  }

  drawFrame(
    video: HTMLVideoElement,
    canvas2dCtx: CanvasRenderingContext2D,
  ): void {
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      // the passed video is not valid, so return
      console.error('invalid video');
      return;
    }

    // Only resize canvas once, expensive operation to resize per frame
    if (
      this.canvas.width !== video.videoWidth ||
      this.canvas.height !== video.videoHeight
    ) {
      this.canvas.width = video.videoWidth;
      this.canvas.height = video.videoHeight;
    }

    this.canvas2dCtx = canvas2dCtx;
    this.textureManager.videoLoaded(video, this.drawVideoScene);
  }

  drawFrameNoOp(
    video: HTMLVideoElement,
    canvas2dCtx: CanvasRenderingContext2D,
  ): void {
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      // the passed video is not valid, so return
      console.error('invalid video');
      return;
    }

    // Only resize canvas once, expensive operation to resize per frame
    if (
      this.canvas.width !== video.videoWidth ||
      this.canvas.height !== video.videoHeight
    ) {
      this.canvas.width = video.videoWidth;
      this.canvas.height = video.videoHeight;
    }

    this.canvas2dCtx = canvas2dCtx;
    this.textureManager.videoLoaded(video, this.drawVideoSceneNoOp);
  }
}
