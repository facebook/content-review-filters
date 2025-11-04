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

export class FDoG0Program extends ShaderProgramBase {
  constructor(
    gl: WebGL2RenderingContext,
    shaderLoaderInstance: ShaderLoader,
    textureManagerInstance: TextureManager,
  ) {
    super(gl, shaderLoaderInstance, textureManagerInstance);
    this.fragmentShaderName = 'fdog0_fs';
  }

  byPassShader(_shaderParameter: ShaderParameter): boolean {
    return Math.ceil(2.0 * ShaderProperties.values.dog_sigma_r) <= 0;
  }

  getFragmentShaderSourceParameter(
    _shaderParameter: ShaderParameter,
  ): ShaderParameter {
    return {halfWidth: Math.ceil(2.0 * ShaderProperties.values.dog_sigma_r)};
  }

  setShaderVariables({tfmTexture, dog_tau}: ShaderParameter) {
    this.uniform2f(
      'imgSize',
      this.textureManager.textureWidth,
      this.textureManager.textureHeight,
    );
    this.uniform1f('sigmaE', ShaderProperties.values.dog_sigma_e);
    this.uniform1f('sigmaR', ShaderProperties.values.dog_sigma_r);
    this.uniform1f('tau', dog_tau ?? ShaderProperties.values.dog_tau);

    if (tfmTexture == null) {
      return;
    }
    const gl = this.gl;
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, tfmTexture);
    gl.activeTexture(gl.TEXTURE0);
    this.uniform1i('tfm', 1);
  }
}
