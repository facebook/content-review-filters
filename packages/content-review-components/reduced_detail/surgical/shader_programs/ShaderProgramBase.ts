/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

/**
 * Class ShaderProgramBase
 *
 * Provides a general methods as program base for shader classes.
 *
 * @param WebGLRenderingContext Rendering context of WebGL
 * @param ShaderLoader Loader to load a shader
 * @param TextureManager Manager to load textures
 */
import type {ShaderLoader, ShaderParameter} from '../shaders/ShaderLoader';
import type {TextureManager} from '../TextureManager';

import ShaderProperties from '../ShaderProperties';

export class ShaderProgramBase {
  gl: WebGL2RenderingContext;
  shaderLoader: ShaderLoader;
  textureManager: TextureManager;
  framebuffer: WebGLFramebuffer | null;

  vertexPosBuffer: WebGLBuffer | null = null;
  textureCoordBuffer: WebGLBuffer | null = null;

  vShader: WebGLShader | null = null;
  fShader: WebGLShader | null = null;
  lastVertexShaderSourceParameter: ShaderParameter = {};
  lastFragmentShaderSourceParameter: ShaderParameter = {};

  shaderProgram: WebGLProgram | null = null;
  vertexAttribLoc: number | null = null;
  textureCoordAttribLoc: number | null = null;
  vertexShaderName: string = 'default_vs';
  fragmentShaderName: string = 'default_fs';

  constructor(
    gl: WebGL2RenderingContext,
    shaderLoaderInstance: ShaderLoader,
    textureManagerInstance: TextureManager,
  ) {
    this.gl = gl;
    this.shaderLoader = shaderLoaderInstance;
    this.textureManager = textureManagerInstance;
    this.framebuffer = this.gl.createFramebuffer();
    this.initBuffers();
  }

  // Default method implementations to be overridden by ShaderProgram instances as needed
  glContext(): WebGL2RenderingContext {
    return this.gl;
  }

  getVertexShaderSourceParameter(
    _shaderParameter: ShaderParameter,
  ): ShaderParameter {
    return {};
  }

  getFragmentShaderSourceParameter(
    _shaderParameter: ShaderParameter,
  ): ShaderParameter {
    return {};
  }

  resolutionScale(textureManager: TextureManager, value: number): number {
    return (
      value *
      (Math.max(textureManager.textureWidth, textureManager.textureHeight) /
        ShaderProperties.values.default_size)
    );
  }

  /**
   * Compare content of two objects (non-recursive!)
   *
   * @param object First object to compare
   * @param object Second object to compare
   * @return bool True if objects are equeal; else False
   */
  objectsAreEqual(a: object, b: object): boolean {
    if (Object.keys(a).length !== Object.keys(b).length) {
      return false;
    }

    let isEqual = true;
    Object.entries(a).forEach(([index, value]) => {
      if (b[index as keyof typeof b] !== value) {
        isEqual = false;
        return false;
      }
    });
    return isEqual;
  }

  /**
   * Create a shader program with given parameter.
   * In case parameter don't have changed, old program or shader will be used.
   *
   * @param object List of place holder replacement strings (key->value)
   */
  createProgram(shaderParameter: ShaderParameter) {
    // only recompile shaders if parameter has changed

    let needToRelink = false;
    let newParameter = this.getVertexShaderSourceParameter(shaderParameter);
    if (
      this.vShader === null ||
      !this.objectsAreEqual(this.lastVertexShaderSourceParameter, newParameter)
    ) {
      this.lastVertexShaderSourceParameter = newParameter;
      this.vShader = this.shaderLoader.getVertexShader(
        this.vertexShaderName,
        newParameter,
      );
      needToRelink = true;
    }
    newParameter = this.getFragmentShaderSourceParameter(shaderParameter);
    if (
      this.fShader === null ||
      !this.objectsAreEqual(
        this.lastFragmentShaderSourceParameter,
        newParameter,
      )
    ) {
      this.lastFragmentShaderSourceParameter = newParameter;
      this.fShader = this.shaderLoader.getFragmentShader(
        this.fragmentShaderName,
        newParameter,
      );
      needToRelink = true;
    }

    if (this.vShader === null || this.fShader === null) {
      return;
    }
    if (needToRelink) {
      const gl = this.gl;
      this.shaderProgram = gl.createProgram();
      gl.attachShader(this.shaderProgram, this.vShader);
      gl.attachShader(this.shaderProgram, this.fShader);

      gl.linkProgram(this.shaderProgram);
      if (!gl.getProgramParameter(this.shaderProgram, gl.LINK_STATUS)) {
        console.error(
          'Could not initialise shader program: ' +
            (gl.getProgramInfoLog(this.shaderProgram) ?? ''),
        );
      }

      this.vertexAttribLoc = this.enableVertexAttribArray('vPosition');
      this.textureCoordAttribLoc = this.enableVertexAttribArray('vTexCoord');
    }
  }

  /**
   * Test if the shader can be bypassed, if possible.
   * This save performance and prefent some shader failures (loops with zero iterations)
   *
   * @param object List of place holder replacement strings (key->value)
   * @return bool True, if shader can be passed; else False
   */
  byPassShader(_shaderParameter: ShaderParameter): boolean {
    return false;
  }

  renderToTexture(
    texture: WebGLTexture | null,
    shaderParameter: ShaderParameter | null = null,
  ): WebGLTexture | null {
    if (shaderParameter === null || texture === null) {
      return texture;
    }
    if (this.byPassShader(shaderParameter)) {
      return texture;
    }

    const gl = this.gl;
    const resultTexture = this.textureManager.getTextureWithLastDimension();
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      resultTexture,
      0,
    );

    this.render(texture, shaderParameter);
    return resultTexture;
  }

  setShaderVariables(_shaderParameter: ShaderParameter) {}

  executeShader(
    _texture: WebGLTexture,
    _shaderParameter: ShaderParameter,
    _canvas2dCtx?: CanvasRenderingContext2D,
  ) {
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
  }

  renderToDisplay(
    texture: WebGLTexture,
    shaderParameter: ShaderParameter,
    canvas2dCtx?: CanvasRenderingContext2D | null,
  ) {
    if (canvas2dCtx === null) {
      return;
    }
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);

    this.render(texture, shaderParameter, canvas2dCtx);
  }

  render(
    texture: WebGLTexture,
    shaderParameter: ShaderParameter,
    canvas2dCtx?: CanvasRenderingContext2D,
  ) {
    this.createProgram(shaderParameter);

    if (this.shaderProgram === null) {
      return;
    }

    const gl = this.gl;

    gl.useProgram(this.shaderProgram);

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.bindTexture(gl.TEXTURE_2D, texture);

    this.vertexAttribPointer(this.vertexAttribLoc, this.vertexPosBuffer, 3);
    this.vertexAttribPointer(
      this.textureCoordAttribLoc,
      this.textureCoordBuffer,
      2,
    );
    this.uniform1i('img', 0);

    this.setShaderVariables(shaderParameter);
    this.executeShader(texture, shaderParameter, canvas2dCtx);
  }

  uniform1i(name: string, value1: number) {
    if (this.shaderProgram === null) {
      console.warn('Shader program not initialized!');
      return;
    }
    const loc = this.gl.getUniformLocation(this.shaderProgram, name);
    if (loc === null) {
      console.warn('Location of uniform "' + name + '" not found!');
      return;
    }
    this.gl.uniform1i(loc, value1);
  }

  uniform1f(name: string, value1: number) {
    if (this.shaderProgram === null) {
      console.warn('Shader program not initialized!');
      return;
    }
    const loc = this.gl.getUniformLocation(this.shaderProgram, name);
    if (loc === null) {
      console.warn('Location of uniform "' + name + '" not found!');
      return;
    }
    this.gl.uniform1f(loc, value1);
  }

  uniform2f(name: string, value1: number, value2: number) {
    if (this.shaderProgram === null) {
      console.warn('Shader program not initialized!');
      return;
    }
    const loc = this.gl.getUniformLocation(this.shaderProgram, name);
    if (loc === null) {
      console.warn('Location of uniform "' + name + '" not found!');
      return;
    }
    this.gl.uniform2f(loc, value1, value2);
  }

  uniform3f(name: string, value1: number, value2: number, value3: number) {
    if (this.shaderProgram === null) {
      console.warn('Shader program not initialized!');
      return;
    }
    const loc = this.gl.getUniformLocation(this.shaderProgram, name);
    if (loc === null) {
      console.warn('Location of uniform "' + name + '" not found!');
      return;
    }
    this.gl.uniform3f(loc, value1, value2, value3);
  }

  enableVertexAttribArray(name: string): number {
    if (this.shaderProgram === null) {
      console.warn('Shader program not initialized!');
      return -1;
    }
    const loc = this.gl.getAttribLocation(this.shaderProgram, name);
    if (loc === -1) {
      console.warn('Location of attribute "' + name + '" not found!');
      return -1;
    }
    this.gl.enableVertexAttribArray(loc);
    return loc;
  }

  vertexAttribPointer(
    loc: number | null,
    buffer: WebGLFramebuffer | null,
    size: number,
  ) {
    if (loc == null || loc === -1) {
      console.warn('Invalid location value!');
      return;
    }
    const gl = this.gl;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
  }

  initBuffers() {
    // add quad
    const gl = this.gl;

    this.vertexPosBuffer = gl.createBuffer();
    const vertices = new Float32Array([
      1.0, -1.0, 0.0, -1.0, -1.0, 0.0, 1.0, 1.0, 0.0, -1.0, 1.0, 0.0,
    ]);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPosBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    // add texture coordinates
    this.textureCoordBuffer = gl.createBuffer();
    const textureCoordinates = new Float32Array([
      1.0, 0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0,
    ]);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, textureCoordinates, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  }
}
