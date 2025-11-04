/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

type ShaderPropertiesValues = {
  sst_sigma: number;
  bf_sigma_d: number;
  bf_sigma_r: number;
  dog_sigma_e: number;
  dog_sigma_r: number;
  dog_sigma_m: number;
  dog_tau: number;
  dog_tau_video: number;
  dog_phi: number;
  dog_epsilon: number;
  cq_phi_q: number;
  fs_sigma: number;
  bf_n_e: number;
  bf_n_a: number;
  bf_n_e_video: number;
  bf_n_a_video: number;
  cq_nbins: number;
  max_size: number;
  default_size: number;
};

class ShaderPropertiesClass {
  values: ShaderPropertiesValues = {
    sst_sigma: 2.0,
    bf_sigma_d: 6.0,
    bf_sigma_r: 5.25,
    dog_sigma_e: 1.0,
    dog_sigma_r: 1.6,
    dog_sigma_m: 3.0,
    dog_tau: 0.99,
    dog_tau_video: 0.99,
    dog_phi: 2.0,
    dog_epsilon: 0.0,
    cq_phi_q: 2.0,
    fs_sigma: 1.0,

    bf_n_e: 1,
    bf_n_a: 3,
    bf_n_e_video: 1,
    bf_n_a_video: 3,
    cq_nbins: 8,
    max_size: 1024,
    default_size: 1024.0,
  };

  // Set level of abstraction
  setLoA = (loa: number) => {
    if (loa === 1) {
      this.values.bf_n_a = 0;
    } else if (loa === 2) {
      this.values.bf_n_a = 1;
    } else if (loa === 3) {
      this.values.bf_n_a = 3;
    } else if (loa === 4) {
      this.values.bf_n_a = 5;
    } else if (loa === 5) {
      this.values.bf_n_a = 7;
    } else if (loa === 6) {
      this.values.bf_n_a = 10;
    } else if (loa === 7) {
      this.values.bf_n_a = 13;
    } else if (loa === 8) {
      this.values.bf_n_a = 16;
    } else if (loa === 9) {
      this.values.bf_n_a = 20;
    }
  };

  // Set level of abstraction for video
  setVideoLoA = (loa: number) => {
    if (loa === 1) {
      this.values.bf_n_a_video = 0;
    } else if (loa === 2) {
      this.values.bf_n_a_video = 1;
    } else if (loa === 3) {
      this.values.bf_n_a_video = 3;
    } else if (loa === 4) {
      this.values.bf_n_a_video = 5;
    } else if (loa === 5) {
      this.values.bf_n_a_video = 7;
    } else if (loa === 6) {
      this.values.bf_n_a_video = 10;
    } else if (loa === 7) {
      this.values.bf_n_a_video = 13;
    } else if (loa === 8) {
      this.values.bf_n_a_video = 16;
    } else if (loa === 9) {
      this.values.bf_n_a_video = 20;
    }
  };

  // Set edge enhancement
  setEE = (ee: number) => {
    if (ee === 1) {
      this.values.bf_n_e = 20;
      this.values.dog_tau = 0.93;
    } else if (ee === 2) {
      this.values.bf_n_e = 16;
      this.values.dog_tau = 0.94;
    } else if (ee === 3) {
      this.values.bf_n_e = 13;
      this.values.dog_tau = 0.95;
    } else if (ee === 4) {
      this.values.bf_n_e = 10;
      this.values.dog_tau = 0.96;
    } else if (ee === 5) {
      this.values.bf_n_e = 7;
      this.values.dog_tau = 0.97;
    } else if (ee === 6) {
      this.values.bf_n_e = 5;
      this.values.dog_tau = 0.98;
    } else if (ee === 7) {
      this.values.bf_n_e = 3;
      this.values.dog_tau = 0.99;
    } else if (ee === 8) {
      this.values.bf_n_e = 1;
      this.values.dog_tau = 0.99;
    } else if (ee === 9) {
      this.values.bf_n_e = 0;
      this.values.dog_tau = 0.99;
    }
  };

  // Set edge enhancement for video
  setVideoEE = (ee: number) => {
    if (ee === 1) {
      this.values.bf_n_e_video = 20;
      this.values.dog_tau_video = 0.93;
    } else if (ee === 2) {
      this.values.bf_n_e_video = 16;
      this.values.dog_tau_video = 0.94;
    } else if (ee === 3) {
      this.values.bf_n_e_video = 13;
      this.values.dog_tau_video = 0.95;
    } else if (ee === 4) {
      this.values.bf_n_e_video = 10;
      this.values.dog_tau_video = 0.96;
    } else if (ee === 5) {
      this.values.bf_n_e_video = 7;
      this.values.dog_tau_video = 0.97;
    } else if (ee === 6) {
      this.values.bf_n_e_video = 5;
      this.values.dog_tau_video = 0.98;
    } else if (ee === 7) {
      this.values.bf_n_e = 3;
      this.values.dog_tau_video = 0.99;
    } else if (ee === 8) {
      this.values.bf_n_e_video = 1;
      this.values.dog_tau_video = 0.99;
    } else if (ee === 9) {
      this.values.bf_n_e_video = 0;
      this.values.dog_tau_video = 0.99;
    }
  };
}

// Create singleton instance of class and export it
const ShaderProperties: ShaderPropertiesClass = new ShaderPropertiesClass();

export default ShaderProperties;
