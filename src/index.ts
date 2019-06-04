/**
 * Copyright (c) acacode, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
class ParsedStructure {
  public mapper: object = {}

  constructor (mapper: any) {
    this.mapper = mapper
  }

  public mapBack (): any {
    console.log('ass')
  }
}

class ClientStructure extends ParsedStructure {
  constructor (structure: any, mapper: any) {
    super(mapper)
    const keys = Object.keys(mapper)
    for (const key of keys) {
      this[key] = structure[key]
    }
  }
}

class Mapy {
  public clientMapper: object = {}
  public serverMapper: object = {}

  constructor (mapper: object) {
    this.clientMapper = mapper
    this.serverMapper = Object.keys(mapper).reduce((backMapper, key) => {
      backMapper[mapper[key]] = key
      return backMapper
    }, {})
  }

  public toClient (structure: object): ClientStructure {
    return new ClientStructure(structure, this.serverMapper)
  }
}

const createMapper = (mapper: object) => new Mapy(mapper)

export {
  createMapper
}
