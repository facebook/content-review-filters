/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

import type {ShaderLoader, ShaderParameter} from '../shaders/ShaderLoader';
import type {TextureManager} from '../TextureManager';

import {ShaderProgramBase} from './ShaderProgramBase';

export class DisplayResultProgram extends ShaderProgramBase {
  constructor(
    gl: WebGL2RenderingContext,
    shaderLoaderInstance: ShaderLoader,
    textureManagerInstance: TextureManager,
  ) {
    super(gl, shaderLoaderInstance, textureManagerInstance);
    this.fragmentShaderName = 'display_result_fs';
  }

  setShaderVariables(shaderParameter: ShaderParameter) {
    const texW = this.textureManager.textureWidth;
    const texH = this.textureManager.textureHeight;

    let vertices;
    if (texW > texH) {
      const height = texH / texW;
      vertices = new Float32Array([
        1.0,
        -height,
        0.0,
        -1.0,
        -height,
        0.0,
        1.0,
        height,
        0.0,
        -1.0,
        height,
        0.0,
      ]);
    } else {
      const width = texW / texH;
      vertices = new Float32Array([
        width,
        -1.0,
        0.0,
        -width,
        -1.0,
        0.0,
        width,
        1.0,
        0.0,
        -width,
        1.0,
        0.0,
      ]);
    }

    const gl = this.gl;
    const resultVertexPosBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, resultVertexPosBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    this.vertexAttribPointer(this.vertexAttribLoc, resultVertexPosBuffer, 3);

    if (shaderParameter.srcTexture == null) {
      return;
    }
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, shaderParameter.srcTexture);
    gl.activeTexture(gl.TEXTURE0);
  }

  executeShader(
    texture: WebGLTexture,
    _shaderParameter: ShaderParameter,
    canvas2dCtx?: CanvasRenderingContext2D,
  ) {
    const gl = this.gl;
    this.textureManager.changeFilter(texture, gl.LINEAR);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    // Copy offscreen canvas to the canvas context passed in
    if (canvas2dCtx != null) {
      canvas2dCtx.drawImage(
        gl.canvas,
        0,
        0,
        canvas2dCtx.canvas.width,
        canvas2dCtx.canvas.height,
      );
    }
  }
}
