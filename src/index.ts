import { tsExternalModuleReference } from '@babel/types'
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
    const str = castTo.string(value).replace(',', '.')
    return castTo.number(str)
  },
  integer: (value: any) => {
    const str = castTo.string(value)
    return castTo.number((+str).toFixed(0))
  },
  number: (value: any): number => {
    const castedValue = +value

    if (Number.isNaN(castedValue)) {
      console.warn('Cannot cast value {', value, '} to type number.\r\nCurrent value will be {NaN}')
    }

    return castedValue
  },
  string: (value: any): string => {
    const castedValue = value.toString ? value.toString() : `${value}`

    if (castedValue === '[object Object]') {
      console.warn('Cannot cast value {', value, '} to type string.\r\nCurrent value will be {[object Object]}')
    }

    return castedValue
  },
}

interface StructPropTypeCaster {
  converter: Function,
  isCustomCaster: boolean,
}

export class StructProp {
  originalName: string
  usageName: string
  usageTypeCaster: StructPropTypeCaster | null
  originalTypeCaster: StructPropTypeCaster | null

  constructor (
    [usageName, usageType = null]: [string, any?],
    [originalName, originalType = null]: [string, any?]) {
    this.originalName = originalName
    this.usageName = usageName

    this.aggregateTypeCast(usageType, 'usageTypeCaster')
    this.aggregateTypeCast(originalType, 'originalTypeCaster')

  }

  castTo (value: any, toUsage: boolean = false): any {
    const typeCaster: StructPropTypeCaster | null = toUsage ? this.usageTypeCaster : this.originalTypeCaster
    return typeCaster ? typeCaster.converter(value) : value
  }

  private aggregateTypeCast (
    castToType: string | Function | null,
    prop: 'usageTypeCaster' | 'originalTypeCaster'
  ): void {
    if (!castToType) {
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

    Object.seal(this)
  }

  swap (): ThisType<ParsedStructure> {
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

  clientMapper: object = {}
  serverMapper: object = {}

  constructor (mapper: object) {
    // TODO: USE StructProp
    this.clientMapper = swapObject(mapper)
    this.serverMapper = mapper
  }

  toClient (structDeclarations: object): ParsedStructure {
    return new ParsedStructure(structDeclarations, this.clientMapper)
  }

  toServer (structDeclarations: object): ParsedStructure {
    return new ParsedStructure(structDeclarations, this.serverMapper)
  }

}

const createMapper = (mapper: object | StructProp[]) => {
  if (mapper instanceof Array) {
    return new Mapy(mapper.reduce((mapper: object, structProp: StructProp) => {
      mapper[structProp.usageName] = prop()
        .from(structProp.originalName, structProp.originalTypeCaster)
        .to(structProp.usageTypeCaster)
      return mapper
    }, {}))
  }
  return new Mapy(mapper)
}

const RESERVED = '@DYNAMIC'

export const prop = (propType?: string): any => {
  switch (propType) {
    case 'array':
    case 'Array': return {
      IS_ARRAY: true,
      IS_SIMPLE_PROP_DEFINITION: true,
      value: {
        original: { name: '' , type: null },
        usage: { name: '' , type: null },
      },
      of (propType: any): any {
        this.value.usage.type = propType || null
        return this
      }
    }
    default: return {
      IS_SIMPLE_PROP_DEFINITION: true,
      value: {
        original: { name: '' , type: null },
        usage: { name: '' , type: null },
      },
      from (propName: any, propType?: any): any {
        if (typeof propName === 'function') {
          this.value.original.name = RESERVED
          this.value.original.type = propName
        } else {
          this.value.original.name = propName
          this.value.original.type = propType || null
          this.value.usage.type = this.value.original.type
        }
        return this
      },
      to (propType: any): any {
        this.value.usage.type = propType || null
        return this
      }
    }
  }
}

export {
  createMapper
}
