/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {WebGLFilter} from './reduced_detail/surgical/SurgicalWebGl';

const offscreenCanvas = new OffscreenCanvas(4096, 4096);
export const reducedDetailFilter = new WebGLFilter(
  offscreenCanvas as unknown as HTMLCanvasElement,
);
