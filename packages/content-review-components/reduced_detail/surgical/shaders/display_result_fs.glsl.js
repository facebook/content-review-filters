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
varying vec2 texCoord;

void main()
{
    gl_FragColor = vec4(texture2D(img, vec2(texCoord.x, 1.0 - texCoord.y)).rgb, 1.0);
}
`;
