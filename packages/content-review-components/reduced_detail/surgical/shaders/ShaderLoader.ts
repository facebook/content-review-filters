/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  bf_fs,
  color_quantization_fs,
  default_vs,
  display_result_fs,
  fdog0_fs,
  fdog1_fs,
  gauss1d_fs,
  gauss3x3_fs,
  lab2rgb_fs,
  mix_fs,
  overlay_fs,
  rgb2lab_fs,
  sst_fs,
  tfm_fs,
} from '.';

export type ShaderParameter = {
  n?: number;
  tfmTexture?: WebGLTexture | null;
  srcTexture?: WebGLTexture | null;
  halfWidth?: number;
  dog_tau?: number;
};

/**
 * Class ShaderLoader
 *
 * Load external source code of a shader, compile it and cache it.
 */
export class ShaderLoader {
  gl: WebGL2RenderingContext;

  vertexCache: Record<string, WebGLShader | null> = {};
  fragmentCache: Record<string, WebGLShader | null> = {};
  shaderSourceCache: Record<string, string> = {
    bf_fs,
    color_quantization_fs,
    default_vs,
    display_result_fs,
    fdog0_fs,
    fdog1_fs,
    gauss1d_fs,
    gauss3x3_fs,
    lab2rgb_fs,
    mix_fs,
    overlay_fs,
    rgb2lab_fs,
    sst_fs,
    tfm_fs,
  };

  constructor(glContext: WebGL2RenderingContext) {
    this.gl = glContext;
  }

  /**
   * Try to load a external ressource
   *
   * @param string Name of shader file (path and file extension are added automatically)
   * @return string Source code of shader or undefined if the key is invalid
   */
  getExternalSource(shaderName: string): string {
    return this.shaderSourceCache[shaderName];
  }

  /**
   * Compile shader
   *
   * @param int Type of shader (gl.VERTEX_SHADER or gl.FRAGMENT_SHADER)
   * @param string Source code of shader
   * @param string Name of shader, which will be displayed in case of an error on console
   * @return WebGLShader Compiled shader or null in case of an error
   */
  compileShader(
    shaderType: number,
    sourcecode: string,
    shaderName: string,
  ): WebGLShader | null {
    const gl = this.gl;
    const shader = gl.createShader(shaderType);
    if (shader == null) {
      return null;
    }
    gl.shaderSource(shader, sourcecode);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(
        'An error occurred compiling the shader (' +
          shaderName +
          '): ' +
          (gl.getShaderInfoLog(shader) ?? ''),
      );
      return null;
    }
    return shader;
  }

  /**
   * Replace place holder in source code of a shader and compile it after this
   *
   * @param GLint Type of shader (gl.VERTEX_SHADER or gl.FRAGMENT_SHADER)
   * @param string Name of shader, which should be loaded and compiled
   * @param object List of place holder replacement strings (key->value)
   * @return WebGLShader Compiled shader or null in case of an error
   */
  getCompiledModifiedShader(
    shaderType: number,
    shaderName: string,
    modifiedParameter: ShaderParameter,
  ): WebGLShader | null {
    let sourcecode = this.getExternalSource(shaderName);
    Object.entries(modifiedParameter).forEach(([varName, value]) => {
      // javascript don't support a better way to replace global without regex
      sourcecode = sourcecode
        .split('$' + varName + '$')
        .join(JSON.stringify(value));
    });
    return this.compileShader(shaderType, sourcecode, shaderName);
  }

  /**
   * Compile a vertex shader.
   * In case modifiedParameter is an empty object, the compiled shader will be cached.
   *
   * @param string Name of shader, which should be loaded and compiled
   * @param object List of place holder replacement strings (key->value)
   * @return WebGLShader Compiled shader or null in case of an error
   */
  getVertexShader(
    shaderName: string,
    modifiedParameter: ShaderParameter,
  ): WebGLShader | null {
    if (Object.keys(modifiedParameter).length === 0) {
      if (!this.vertexCache[shaderName]) {
        const sourcecode = this.getExternalSource(shaderName);
        this.vertexCache[shaderName] = this.compileShader(
          this.gl.VERTEX_SHADER,
          sourcecode,
          shaderName,
        );
      }
      return this.vertexCache[shaderName];
    }
    return this.getCompiledModifiedShader(
      this.gl.VERTEX_SHADER,
      shaderName,
      modifiedParameter,
    );
  }

  /**
   * Compile a fragment shader.
   * In case modifiedParameter is an empty object, the compiled shader will be cached.
   *
   * @param string Name of shader, which should be loaded and compiled
   * @param object List of place holder replacement strings (key->value)
   * @return WebGLShader Compiled shader or null in case of an error
   */
  getFragmentShader(
    shaderName: string,
    modifiedParameter: ShaderParameter,
  ): WebGLShader | null {
    if (Object.keys(modifiedParameter).length === 0) {
      if (!this.fragmentCache[shaderName]) {
        const sourcecode = this.getExternalSource(shaderName);
        this.fragmentCache[shaderName] = this.compileShader(
          this.gl.FRAGMENT_SHADER,
          sourcecode,
          shaderName,
        );
      }
      return this.fragmentCache[shaderName];
    }
    return this.getCompiledModifiedShader(
      this.gl.FRAGMENT_SHADER,
      shaderName,
      modifiedParameter,
    );
  }
}
