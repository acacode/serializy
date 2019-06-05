import { swapObject } from './helpers/base'

/**
 * Copyright (c) acacode, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

class ParsedStructure {
  // tslint:disable-next-line:variable-name
  protected __mapper__: object

  constructor (structDeclarations: any, mapper: any) {
    (this as any).__proto__.__mapper__ = mapper

    const keys = Object.keys(mapper)
    for (const key of keys) {
      this[key] = structDeclarations[this.__mapper__[key]]
    }
  }

  public swap (): ThisType<ParsedStructure> {
    const keys = Object.keys(this.__mapper__)
    for (const key of keys) {
      this[this.__mapper__[key]] = this[key]
      delete this[key]
    }

    (this as any).__proto__.__mapper__ = swapObject(this.__mapper__)

    return this
  }
}

class Mapy {

  public clientMapper: object = {}
  public serverMapper: object = {}

  constructor (mapper: object) {
    this.clientMapper = swapObject(mapper)
    this.serverMapper = mapper
  }

  public toClient (structDeclarations: object): ParsedStructure {
    return new ParsedStructure(structDeclarations, this.clientMapper)
  }

  public toServer (structDeclarations: object): ParsedStructure {
    return new ParsedStructure(structDeclarations, this.serverMapper)
  }

}

const createMapper = (mapper: object) => new Mapy(mapper)

export {
  createMapper
}
