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
  dataModel: object,
  {
    model,
    scheme: { from, to },
    modelOptions
  }: CastConfig
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

const checkOnExistingCastType = (type: any, property: any): boolean => {
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
  return true
}

const objectIsDeclarationModel = (declaredModel: any, property: any) => {
  if (!declaredModel.deserialize) {
    error(
      `Declared model for `,
      property,
      ` was not created via model() function.` +
        `Please wrap this model into "model()" function`
    )
  }
  return true
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

declare interface ConvertConfig {
  modelConfiguration: ModelConfiguration
  toOriginal: boolean
}

export const convertModel = (
  dataModel: object,
  { modelConfiguration, toOriginal }: ConvertConfig
) => {
  const model = {}

  for (const { scheme } of modelConfiguration.declarations) {
    if (!toOriginal || !scheme.optional) {
      const serializer =
        castAction[scheme.schemeType][toOriginal ? 'toOriginal' : 'toUsage']
      serializer(dataModel, {
        model,
        modelOptions: modelConfiguration.options,
        scheme
      })
    }
  }

  return model
}

declare interface CastConfig {
  modelOptions: ModelOptions
  model: object
  scheme: Scheme
}

const castClassToOriginal: CastAction = (
  dataModel: object,
  { model, scheme: { from, to, arrayType }, modelOptions }: CastConfig
) => {
  modelOptions.warnings && checkPropertyExist(dataModel, to.name)

  const cast = (model: AllKeysAre<any>) => {
    objectIsDeclarationModel(model, to.name)
    return (to.type as ModelWrapper<any>).deserialize(model)
  }

  if (arrayType) {
    checkType(dataModel[to.name], 'array', to.name)
    model[from.name] = (dataModel[to.name] as object[]).map(cast)
  } else {
    model[from.name] = cast(dataModel[to.name])
  }
}

const castClassToUsage: CastAction = (
  dataModel: object,
  { model, scheme: { from, to, arrayType, optional }, modelOptions }: CastConfig
) => {
  modelOptions.warnings && !optional && checkPropertyExist(dataModel, from.name)

  const cast = (model: AllKeysAre<any>) => {
    const instance = (from.type as ModelWrapper<any>).serialize(model)
    return objectIsDeclarationModel(instance, from.name) && instance
  }

  if (arrayType) {
    checkType(dataModel[from.name], 'array', from.name)
    model[to.name] = (dataModel[from.name] as object[]).map(cast)
  } else {
    model[to.name] = cast(dataModel[from.name])
  }
}

const castSerializersToOriginal: CastAction = (
  dataModel: object,
  { model, scheme: { from, to }, modelOptions }: CastConfig
) => {
  if (typeof to.serializer === 'function') {
    const partialModel = to.serializer(dataModel, model)
    checkType(partialModel, 'object', 'Custom deserializer', 'return')
    Object.assign(model, partialModel)
  } else delete model[from.name]
}

const castSerializersToUsage: CastAction = (
  dataModel: object,
  { model, scheme: { from, to }, modelOptions }: CastConfig
) => {
  checkType(from.serializer, 'function', 'Custom serializer')
  model[to.name] = (from.serializer as Function)(dataModel)
}

declare interface ShortCastConfig {
  model: object
  arrayType: boolean
  warnings: boolean
  currentPropScheme: FieldScheme
  usagePropScheme: FieldScheme
}

const castStrings = (
  dataModel: object,
  {
    model,
    arrayType,
    warnings,
    currentPropScheme,
    usagePropScheme
  }: ShortCastConfig
) => {
  warnings && checkPropertyExist(dataModel, currentPropScheme.name)

  const cast = (value: any) => {
    checkOnExistingCastType(usagePropScheme.type, currentPropScheme.name)
    return castTo[usagePropScheme.type as keyof CastPrimitiveTo](value)
  }

  const currentValue = dataModel[currentPropScheme.name]

  if (arrayType) {
    checkType(currentValue, 'array', currentPropScheme.name)
    model[usagePropScheme.name] = (currentValue as any[]).map(cast)
  } else {
    model[usagePropScheme.name] = cast(currentValue)
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
  [SchemeType.THREE_STRINGS]: {
    toOriginal: (dataModel, { scheme, model, modelOptions }) =>
      castStrings(dataModel, {
        arrayType: scheme.arrayType,
        currentPropScheme: scheme.to,
        model,
        usagePropScheme: scheme.from,
        warnings: modelOptions.warnings
      }),
    toUsage: (dataModel, { scheme, model, modelOptions }) =>
      castStrings(dataModel, {
        arrayType: scheme.arrayType,
        currentPropScheme: scheme.from,
        model,
        usagePropScheme: scheme.to,
        warnings: modelOptions.warnings && !scheme.optional
      })
  }
}
