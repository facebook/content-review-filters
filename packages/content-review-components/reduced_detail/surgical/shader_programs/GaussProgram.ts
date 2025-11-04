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

export class GaussProgram extends ShaderProgramBase {
  constructor(
    gl: WebGL2RenderingContext,
    shaderLoaderInstance: ShaderLoader,
    textureManagerInstance: TextureManager,
  ) {
    super(gl, shaderLoaderInstance, textureManagerInstance);
    this.fragmentShaderName = 'gauss1d_fs';
  }

  byPassShader(_shaderParameter: ShaderParameter): boolean {
    return Math.ceil(2.0 * ShaderProperties.values.sst_sigma) <= 0;
  }

  getFragmentShaderSourceParameter(
    _shaderParameter: ShaderParameter,
  ): ShaderParameter {
    return {
      halfWidth: Math.ceil(
        2.0 *
          this.resolutionScale(
            this.textureManager,
            ShaderProperties.values.sst_sigma,
          ),
      ),
    };
  }
}
