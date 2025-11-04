/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
//  Copyright (c) 2018 Hasso Plattner Institute and Digital Masterpieces GmbH.

'use strict';

export default `
attribute vec4 vPosition;
attribute vec2 vTexCoord;

varying vec2 texCoord;

void main()
{
	gl_Position = vPosition;
	texCoord = vTexCoord;
}
`;
