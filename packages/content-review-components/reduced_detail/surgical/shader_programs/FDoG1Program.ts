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
import ShaderProperties from '../ShaderProperties';

export class FDoG1Program extends ShaderProgramBase {
  constructor(
    gl: WebGL2RenderingContext,
    shaderLoaderInstance: ShaderLoader,
    textureManagerInstance: TextureManager,
  ) {
    super(gl, shaderLoaderInstance, textureManagerInstance);
    this.fragmentShaderName = 'fdog1_fs';
  }

  byPassShader(_shaderParameter: ShaderParameter): boolean {
    return Math.ceil(2.0 * ShaderProperties.values.dog_sigma_m) <= 0;
  }

  getFragmentShaderSourceParameter(
    _shaderParameter: ShaderParameter,
  ): ShaderParameter {
    return {halfWidth: Math.ceil(2.0 * ShaderProperties.values.dog_sigma_m)};
  }

  setShaderVariables(tfmTexture: WebGLTexture) {
    this.uniform2f(
      'imgSize',
      this.textureManager.textureWidth,
      this.textureManager.textureHeight,
    );
    this.uniform1f('sigmaM', ShaderProperties.values.dog_sigma_m);
    this.uniform1f('phi', ShaderProperties.values.dog_phi);
    this.uniform1f('epsilon', ShaderProperties.values.dog_epsilon);

    const gl = this.gl;
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, tfmTexture);
    gl.activeTexture(gl.TEXTURE0);
    this.uniform1i('tfm', 1);
  }
}
