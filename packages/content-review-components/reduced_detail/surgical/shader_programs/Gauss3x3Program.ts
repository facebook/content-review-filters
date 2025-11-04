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

export class Gauss3x3Program extends ShaderProgramBase {
  constructor(
    gl: WebGL2RenderingContext,
    shaderLoaderInstance: ShaderLoader,
    textureManagerInstance: TextureManager,
  ) {
    super(gl, shaderLoaderInstance, textureManagerInstance);
    this.fragmentShaderName = 'gauss3x3_fs';
  }

  setShaderVariables(_shaderParameter: ShaderParameter) {
    this.uniform2f(
      'imgSize',
      this.textureManager.textureWidth,
      this.textureManager.textureHeight,
    );
  }
}
