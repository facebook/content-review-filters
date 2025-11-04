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
uniform int nbins;
uniform float phiQ;

varying vec2 texCoord;

void main (void) {
    vec3 c = texture2D(img, texCoord).xyz;

    float qn = floor(c.x * float(nbins) + 0.5) / float(nbins);
    float qs = smoothstep(-2.0, 2.0, phiQ * (c.x - qn) * 100.0) - 0.5;
    float qc = qn + qs / float(nbins);

    gl_FragColor = vec4( vec3(qc, c.yz), 1.0 );
}
`;
