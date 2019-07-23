import { SchemeType } from './constants'
import { error, isObject, isPrimitive, warn } from './helpers'
import { ModelConfiguration, ModelOptions, ModelWrapper } from './model_wrapper'
import { Scheme } from './scheme'

declare type CastAction = (dataModel: object, { model, scheme: { from, to }, modelOptions }: CastConfig) => void

declare type CastActionsObject = {
  [key in SchemeType]: {
    toOriginal: CastAction,
    toUsage: CastAction,
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
  value !== null && warn('Not possible to cast value "', value, `" to type ${toType}.`)

const checkOnExistingCastType = (type: any, property: any): boolean => {
  const possibleCastTypes = Object.keys(castTo)
  if (possibleCastTypes.indexOf(type) === -1) {
    error(
        `Type `, type, ` of value of property `, property, ` is not possible for type casting\r\n` +
        `Please use one of following types: ${possibleCastTypes.join(', ')}`
    )
  }
  return true
}

const propertyIsNotExist = (model: object, property: any): boolean => {
  if (typeof model[property] === 'undefined') {
    warn(`Property "`,property,`" is not existing in model :`, model)
  }
  return true
}

const objectIsDeclarationModel = (declaredModel: any, property: any) => {
  if (!declaredModel.deserialize) {
    error(
      `Declared model for `,property,` is not created via model() function.` +
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
  modelConfig: ModelConfiguration,
  toOriginal: boolean
}

export const convertModel = (
  dataModel: object,
  { modelConfig, toOriginal }: ConvertConfig
) => {
  const model = {}

  for (const { scheme } of modelConfig.declarations) {
    const serializer = castAction[scheme.schemeType][toOriginal ? 'toOriginal' : 'toUsage']
    serializer(dataModel, {
      model,
      modelOptions: modelConfig.options,
      scheme
    })
  }

  if (!Object.keys(model).length) {
    error('Unknown error. Object is empty after serializing/deserializing')
  }

  return model
}

const isNotArrayError = (usageProperty: string, originalProperty: string): never => error(
  `For `,usageProperty,` property you are use 'fieldArray()' and ` +
  `because of this the original property `,originalProperty,` should have type array`
)

declare interface CastConfig {
  modelOptions: ModelOptions
  model: object
  scheme: Scheme
}

const castClassToOriginal: CastAction = (
  dataModel: object,
  { model, scheme: { from, to, arrayType, readOnly }, modelOptions }: CastConfig
) => {
  if (readOnly) {
    return
  }

  modelOptions.warnings && propertyIsNotExist(dataModel, to.name)
  if (arrayType) {
    if (!(dataModel[to.name] instanceof Array)) {
      isNotArrayError(to.name, to.name)
    }
    model[from.name] =
    (dataModel[to.name] as object[]).map(usageModel => {
      objectIsDeclarationModel(usageModel, to.name)
      // FIXME: it probably can have errors like deserialize() is not function
      return (usageModel as InstanceType<ModelWrapper<any>>).deserialize()
    })
  } else {
    objectIsDeclarationModel(dataModel[to.name], to.name)
    // FIXME: it probably can have errors like deserialize() is not function
    model[from.name] = (dataModel[to.name] as InstanceType<ModelWrapper<any>>).deserialize()
  }
}

const castClassToUsage: CastAction = (
  dataModel: object,
  { model, scheme: { from, to, arrayType, writeOnly }, modelOptions }: CastConfig
) => {
  if (writeOnly) {
    return
  }

  modelOptions.warnings && propertyIsNotExist(dataModel, from.name)
  if (arrayType) {
    if (!(dataModel[from.name] instanceof Array)) {
      isNotArrayError(from.name, from.name)
    }
    model[to.name] = (dataModel[from.name] as object[]).map(part => {
      const instance = new (from.type as ModelWrapper<any>)(part)
      return objectIsDeclarationModel(instance, from.name) && instance
    })
  } else {
    const instance = new (from.type as ModelWrapper<any>)(dataModel[from.name])
    objectIsDeclarationModel(instance, from.name)
    model[to.name] = instance
  }
}

const castSerializersToOriginal: CastAction = (
  dataModel: object,
  { model, scheme: { from, to, readOnly }, modelOptions }: CastConfig
) => {
  if (readOnly) {
    return
  }

  if (typeof to.serializer === 'function') {
    const partialModel = (to.serializer as Function)(dataModel, model)
    if (!isObject(partialModel)) {
      error(
        'Return value of callback function of property .to() should have type object\r\n' +
        'Because return value will be merged into result object model'
      )
    }
    Object.assign(model, partialModel)
  } else delete model[from.name]
}

const castSerializersToUsage: CastAction = (
  dataModel: object,
  { model, scheme: { from, to, writeOnly }, modelOptions }: CastConfig
) => {
  if (writeOnly) {
    return
  }

  if (typeof from.serializer !== 'function') {
    error('Custom handler should be exist and have type functions')
  }
  model[to.name] = (from.serializer as Function)(dataModel)
}

const castStringsToOriginal: CastAction = (
  dataModel: object,
  { model, scheme: { from, to, arrayType, readOnly }, modelOptions }: CastConfig
) => {
  if (readOnly) {
    return
  }

  modelOptions.warnings && propertyIsNotExist(dataModel, to.name)

  const castStringToOriginal = (value: any) => {
    checkOnExistingCastType(from.type, to.name)
    return castTo[from.type as keyof CastPrimitiveTo](value)
  }

  if (arrayType) {
    if (!(dataModel[to.name] instanceof Array)) {
      isNotArrayError(to.name, to.name)
    }
    model[from.name] = (dataModel[to.name] as any[]).map(castStringToOriginal)
  } else {
    model[from.name] = castStringToOriginal(dataModel[to.name])
  }
}

const castStringsToUsage: CastAction = (
  dataModel: object,
  { model, scheme: { from, to, arrayType, writeOnly }, modelOptions }: CastConfig
) => {
  if (writeOnly) {
    return
  }

  modelOptions.warnings && propertyIsNotExist(dataModel, from.name)

  const castStringToUsage = (value: any) => {
    checkOnExistingCastType(to.type, from.name)
    return castTo[to.type as keyof CastPrimitiveTo](value)
  }

  if (arrayType) {
    if (!(dataModel[from.name] instanceof Array)) {
      isNotArrayError(from.name, to.name)
    }
    model[to.name] = (dataModel[from.name] as any[]).map(castStringToUsage)
  } else {
    // TODO: prevent returning undefined
    model[to.name] = castStringToUsage(dataModel[from.name])
  }

}

const castAction: CastActionsObject = {
  [SchemeType.STRING_AND_CLASS]: {
    toOriginal: castClassToOriginal,
    toUsage: castClassToUsage,
  },
  [SchemeType.SERIALIZERS]: {
    toOriginal: castSerializersToOriginal,
    toUsage: castSerializersToUsage,
  },
  [SchemeType.THREE_STRINGS]: {
    toOriginal: castStringsToOriginal,
    toUsage: castStringsToUsage,
  }
}
