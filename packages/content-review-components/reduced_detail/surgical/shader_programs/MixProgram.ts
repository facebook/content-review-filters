/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

import type {ShaderLoader} from '../shaders/ShaderLoader';
import type {TextureManager} from '../TextureManager';

import {ShaderProgramBase} from './ShaderProgramBase';

export class MixProgram extends ShaderProgramBase {
  constructor(
    gl: WebGL2RenderingContext,
    shaderLoaderInstance: ShaderLoader,
    textureManagerInstance: TextureManager,
  ) {
    super(gl, shaderLoaderInstance, textureManagerInstance);
    this.fragmentShaderName = 'mix_fs';
  }

  setShaderVariables(edgeTexture: WebGLTexture) {
    const gl = this.gl;
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, edgeTexture);
    gl.activeTexture(gl.TEXTURE0);
    this.uniform1i('edges', 1);
  }
}
