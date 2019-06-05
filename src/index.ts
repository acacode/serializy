import { swapObject } from './helpers/base'

/**
 * Copyright (c) acacode, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const castTo = {
  boolean: (value: any) => !!value,
  float: (value: any) => {
    const str = castTo.string(value)
    if (str.indexOf(',') > -1) {
      str.replace(',', '.')
    }
    return castTo.number(str)
  },
  integer: (value: any) => {
    const str = castTo.string(value)
    return castTo.number((+str).toFixed(0))
  },
  number: (value: any): number => +value,
  string: (value: any): string => value.toString ? value.toString() : `${value}`,
}

interface StructPropTypeCaster {
  converter: Function,
  isCustomCaster: boolean,
}

export class StructProp {
  public originalName: string
  public usageName: string
  public typeCaster: StructPropTypeCaster | null
  public reverseTypeCaster: StructPropTypeCaster | null

  constructor (originalName: string, [usageName, castToType = null, reverseCastToType = null]: any[]) {
    this.originalName = originalName
    this.usageName = usageName

    this.aggregateTypeCast(castToType, 'typeCaster')
    this.aggregateTypeCast(reverseCastToType, 'reverseTypeCaster')

  }

  private aggregateTypeCast (castToType: string | Function | null, prop: 'typeCaster' | 'reverseTypeCaster'): void {
    if (castToType === null) {
      this[prop] = null
    }
    if (typeof castToType === 'string') {
      if (castTo[castToType]) {
        this[prop] = {
          converter: castTo[castToType],
          isCustomCaster: false
        }
      } else {
        throw new Error(
          `Type ${castToType} is not supporting by Mapster. May be it is mistake?` +
          'Here is list of supporting types:\r\n' + Object.keys(castTo).join(', ')
        )
      }
    }
    if (typeof castToType === 'function') {
      this[prop] = {
        converter: castToType,
        isCustomCaster: true
      }
    }
  }
}

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
    // TODO: USE StructProp
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
