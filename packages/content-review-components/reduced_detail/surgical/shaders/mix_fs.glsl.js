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
uniform sampler2D edges;
uniform vec3 edgeColor;

varying vec2 texCoord;

void main (void) {
    vec3 c = texture2D(img, texCoord).xyz;
    float e = texture2D(edges, texCoord).x;
    gl_FragColor = vec4(mix(edgeColor, c, e), 1.0);
}


`;
