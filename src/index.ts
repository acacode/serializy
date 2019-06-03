/**
 * Copyright (c) acacode, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

class Mapy {
  public clientKeys: string[] = []
  public serverKeys: string[] = []
  public mapper: object = {}

  constructor (mapper: object) {
    this.mapper = mapper
    this.clientKeys = Object.keys(mapper)
    this.serverKeys = this.clientKeys.map(key => mapper[key])
  }

  public toClient (structure: object) {
    return Object.keys(structure).reduce((clientModel, key) => {

      return clientModel
    }, {})
  }
}

const createMapper = (mapper: object) => new Mapy(mapper)

export {
  createMapper
}
