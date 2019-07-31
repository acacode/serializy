import { SchemeType } from './constants'
import { AllKeysAre } from './global_types'
import {
  checkPropertyExist,
  checkType,
  error,
  isObject,
  isPrimitive,
  warn
} from './helpers'
import { ModelConfiguration, ModelOptions, ModelWrapper } from './model_wrapper'
import { FieldScheme, Scheme } from './scheme'

declare type CastAction = (
  dataStructure: object,
  usageStructure: object,
  castConfig: CastConfig,
  toOriginal?: boolean
) => void

declare type CastActionsObject = {
  [key in SchemeType]: {
    toOriginal: CastAction
    toUsage: CastAction
  }
}

declare type PrimitiveCaster<ReturnValue> = (value: any) => ReturnValue

export declare interface CastPrimitiveTo {
  any: PrimitiveCaster<any>
  boolean: PrimitiveCaster<boolean>
  number: PrimitiveCaster<number>
  object: PrimitiveCaster<object>
  string: PrimitiveCaster<string>
}

const impossibleCastWarning = (value: any, toType: string) =>
  // checks on null is required. Because most APIs have nullable fields.
  value !== null &&
  warn('Not possible to cast value "', value, `" to type ${toType}.`)

const checkOnExistingCastType = (type: any, property: any): void => {
  const possibleCastTypes = Object.keys(castTo)
  if (possibleCastTypes.indexOf(type) === -1) {
    error(
      `Type `,
      type,
      ` of property `,
      property,
      ` is not possible for type casting\r\n` +
        `Please use one of following types: ${possibleCastTypes.join(', ')}`
    )
  }
}

const checkOnExistingValidType = (scheme: FieldScheme, value: any): void => {
  if (
    value !== null &&
    typeof scheme.type === 'string' &&
    scheme.type !== 'any' &&
    typeof value !== scheme.type
  ) {
    warn(
      `value`,
      value,
      `of the property "${scheme.name}" have not declared type - "${scheme.type}"`
    )
  }
}

const castTo: CastPrimitiveTo = {
  any: (value: any): any => value,
  boolean: (value: any): boolean => !!value,
  number: (value: any): number => {
    const castedValue = +value

    if (!isPrimitive(value) || Number.isNaN(castedValue)) {
      impossibleCastWarning(value, 'number')
      return value
    }

    return castedValue
  },
  object: (value: any): object => {
    if (!isObject(value)) {
      impossibleCastWarning(value, 'object')
      return value
    }

    return Object.assign({}, value)
  },
  string: (value: any): string => {
    if (!isPrimitive(value)) {
      impossibleCastWarning(value, 'string')
      return value
    }

    return value && value.toString ? value.toString() : `${value}`
  }
}

export const convertModel = (
  dataStructure: object,
  { declarations, options }: ModelConfiguration,
  toOriginal: boolean
) => {
  const usageStructure = {}

  for (const { scheme } of declarations) {
    const converter: CastAction =
      castAction[scheme.schemeType][toOriginal ? 'toOriginal' : 'toUsage']
    converter(dataStructure, usageStructure, { options, scheme }, toOriginal)
  }

  return usageStructure
}

declare interface CastConfig {
  options: ModelOptions
  scheme: Scheme
}

const castClassToOriginal: CastAction = (
  dataStructure: object,
  usageStructure: object,
  {
    scheme: { from, to, arrayType, optional },
    options: { warnings }
  }: CastConfig
) => {
  warnings && !optional && checkPropertyExist(dataStructure, to)

  const cast = (model: AllKeysAre<any>) => {
    return (to.type as ModelWrapper<any>).deserialize(model)
  }

  const currentValue = dataStructure[to.name]

  if (optional && typeof currentValue === 'undefined') {
    return
  }

  if (arrayType) {
    checkType(currentValue, 'array', to.name)
    usageStructure[from.name] = (currentValue as object[]).map(cast)
  } else {
    usageStructure[from.name] = cast(currentValue)
  }
}

const castClassToUsage: CastAction = (
  dataStructure: object,
  usageStructure: object,
  {
    scheme: { from, to, arrayType, optional },
    options: { warnings }
  }: CastConfig
) => {
  warnings && !optional && checkPropertyExist(dataStructure, from)

  const cast = (model: AllKeysAre<any>) => {
    const instance = (from.type as ModelWrapper<any>).serialize(model)
    return instance
  }

  const currentValue = dataStructure[from.name]

  if (optional && typeof currentValue === 'undefined') {
    return
  }

  if (arrayType) {
    checkType(currentValue, 'array', from.name)
    usageStructure[to.name] = (currentValue as object[]).map(cast)
  } else {
    usageStructure[to.name] = cast(currentValue)
  }
}

const castSerializersToOriginal: CastAction = (
  dataStructure: object,
  usageStructure: object,
  { scheme: { from, to } }: CastConfig
) => {
  if (typeof to.serializer === 'function') {
    const partialModel = to.serializer(dataStructure, usageStructure)
    checkType(partialModel, 'object', 'Custom deserializer', 'return')
    Object.assign(usageStructure, partialModel)
  } else delete usageStructure[from.name]
}

const castSerializersToUsage: CastAction = (
  dataStructure: object,
  usageStructure: object,
  { scheme: { from, to } }: CastConfig
) => {
  checkType(from.serializer, 'function', 'Custom serializer')
  usageStructure[to.name] = (from.serializer as Function)(dataStructure)
}

const castStrings = (
  dataStructure: object,
  usageStructure: object,
  { scheme, options: { warnings } }: CastConfig,
  toOriginal: boolean
) => {
  const [currentPropScheme, usagePropScheme] = toOriginal
    ? [scheme.to, scheme.from]
    : [scheme.from, scheme.to]

  warnings &&
    !scheme.optional &&
    checkPropertyExist(dataStructure, currentPropScheme)

  const cast = (value: any) => {
    if (!toOriginal) {
      checkOnExistingValidType(currentPropScheme, value)
    }
    checkOnExistingCastType(usagePropScheme.type, currentPropScheme.name)
    return castTo[usagePropScheme.type as keyof CastPrimitiveTo](value)
  }

  const currentValue = dataStructure[currentPropScheme.name]

  if (scheme.optional && typeof currentValue === 'undefined') {
    return
  }

  if (scheme.arrayType) {
    checkType(currentValue, 'array', currentPropScheme.name)
    usageStructure[usagePropScheme.name] = (currentValue as any[]).map(cast)
  } else {
    usageStructure[usagePropScheme.name] = cast(currentValue)
  }
}

const castAction: CastActionsObject = {
  [SchemeType.STRING_AND_CLASS]: {
    toOriginal: castClassToOriginal,
    toUsage: castClassToUsage
  },
  [SchemeType.SERIALIZERS]: {
    toOriginal: castSerializersToOriginal,
    toUsage: castSerializersToUsage
  },
  [SchemeType.STRINGS]: {
    toOriginal: castStrings,
    toUsage: castStrings
  }
}
