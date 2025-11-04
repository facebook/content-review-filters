/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
//  Copyright (c) 2018 Hasso Plattner Institute and Digital Masterpieces GmbH.

'use strict';

export default `

precision mediump float;

uniform sampler2D img;
uniform vec2 imgSize;
varying vec2 texCoord;

void main() {
    vec3 c = ( 1.0 * texture2D(img, texCoord + vec2(-1.0, -1.0) / imgSize).rgb +
               4.0 * texture2D(img, texCoord + vec2( 0.0, -1.0) / imgSize).rgb +
               1.0 * texture2D(img, texCoord + vec2( 1.0, -1.0) / imgSize).rgb +
               4.0 * texture2D(img, texCoord + vec2(-1.0,  0.0) / imgSize).rgb +
              16.0 * texture2D(img, texCoord + vec2( 0.0,  0.0) / imgSize).rgb +
               4.0 * texture2D(img, texCoord + vec2( 1.0,  0.0) / imgSize).rgb +
               1.0 * texture2D(img, texCoord + vec2(-1.0,  1.0) / imgSize).rgb +
               4.0 * texture2D(img, texCoord + vec2( 0.0,  1.0) / imgSize).rgb +
               1.0 * texture2D(img, texCoord + vec2( 1.0,  1.0) / imgSize).rgb
             ) / 36.0;

    gl_FragColor = vec4(c, 1.0);
}


`;
