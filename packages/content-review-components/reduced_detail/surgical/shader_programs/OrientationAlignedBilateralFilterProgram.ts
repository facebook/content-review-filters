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

export class OrientationAlignedBilateralFilterProgram extends ShaderProgramBase {
  constructor(
    gl: WebGL2RenderingContext,
    shaderLoaderInstance: ShaderLoader,
    textureManagerInstance: TextureManager,
  ) {
    super(gl, shaderLoaderInstance, textureManagerInstance);
    this.fragmentShaderName = 'bf_fs';
  }

  byPassShader(shaderParameter: ShaderParameter): boolean {
    return (
      (shaderParameter.n ?? 1) <= 0 ||
      Math.ceil(2.0 * ShaderProperties.values.bf_sigma_d) <= 0
    );
  }

  getFragmentShaderSourceParameter(
    _shaderParameter: ShaderParameter,
  ): ShaderParameter {
    return {halfWidth: Math.ceil(2.0 * ShaderProperties.values.bf_sigma_d)};
  }

  setShaderVariables(bfParams: ShaderParameter) {
    this.uniform2f(
      'imgSize',
      this.textureManager.textureWidth,
      this.textureManager.textureHeight,
    );
    this.uniform1f(
      'sigmaD',
      this.resolutionScale(
        this.textureManager,
        ShaderProperties.values.bf_sigma_d,
      ),
    );
    this.uniform1f('sigmaR', ShaderProperties.values.bf_sigma_r / 100);

    if (bfParams.tfmTexture == null) {
      return;
    }
    const gl = this.gl;
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, bfParams.tfmTexture);
    gl.activeTexture(gl.TEXTURE0);
    this.uniform1i('tfm', 1);
  }

  executeShader(srcTexture: WebGLTexture, shaderParameter: ShaderParameter) {
    const gl = this.gl;
    const resultTexture = gl.getFramebufferAttachmentParameter(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.FRAMEBUFFER_ATTACHMENT_OBJECT_NAME,
    );
    const tmpTexture = this.textureManager.getTextureWithLastDimension();
    const dstTexture = this.textureManager.getTextureWithLastDimension();
    this.textureManager.changeFilter(tmpTexture, gl.LINEAR);
    this.textureManager.changeFilter(dstTexture, gl.LINEAR);
    this.textureManager.changeFilter(srcTexture, gl.LINEAR);

    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);

    if (shaderParameter.n != null) {
      const n = shaderParameter.n;
      for (let i = 0; i < n; i++) {
        gl.bindTexture(gl.TEXTURE_2D, i === 0 ? srcTexture : dstTexture);
        this.uniform1i('pass', 0);
        gl.framebufferTexture2D(
          gl.FRAMEBUFFER,
          gl.COLOR_ATTACHMENT0,
          gl.TEXTURE_2D,
          tmpTexture,
          0,
        );
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        gl.bindTexture(gl.TEXTURE_2D, tmpTexture);
        this.uniform1i('pass', 1);
        if (i === n - 1) {
          if (resultTexture !== null) {
            gl.framebufferTexture2D(
              gl.FRAMEBUFFER,
              gl.COLOR_ATTACHMENT0,
              gl.TEXTURE_2D,
              resultTexture,
              0,
            );
          } else {
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
          }
        } else {
          gl.framebufferTexture2D(
            gl.FRAMEBUFFER,
            gl.COLOR_ATTACHMENT0,
            gl.TEXTURE_2D,
            dstTexture,
            0,
          );
        }
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }
    }
  }
}
