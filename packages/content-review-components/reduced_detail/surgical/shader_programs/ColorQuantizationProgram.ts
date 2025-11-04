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

export class ColorQuantizationProgram extends ShaderProgramBase {
  constructor(
    gl: WebGL2RenderingContext,
    shaderLoaderInstance: ShaderLoader,
    textureManagerInstance: TextureManager,
  ) {
    super(gl, shaderLoaderInstance, textureManagerInstance);
    this.fragmentShaderName = 'color_quantization_fs';
  }

  setShaderVariables(_shaderParameter: ShaderParameter) {
    this.uniform1i('nbins', ShaderProperties.values.cq_nbins);
    this.uniform1f('phiQ', ShaderProperties.values.cq_phi_q);
  }
}
