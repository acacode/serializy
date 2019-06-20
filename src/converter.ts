import { SchemeType } from './constants'
import { ModelConfiguration, ModelOptions, ModelWrapper } from './model_wrapper'
import { Scheme } from './scheme'

declare type CastAction = (dataModel: object, { model, scheme: { from, to }, modelOptions }: CastConfig) => void

declare type CastActionsObject = {
  [key in SchemeType]: {
    toOriginal: CastAction,
    toUsage: CastAction,
  }
}

export declare interface CastPrimitiveTo {
  boolean: (value: any) => boolean
  float: (value: any) => number
  integer: (value: any) => number
  number: (value: any) => number
  string: (value: any) => string
}

const castWarning = (value: any, currentValue: any) =>
    console.warn('Cannot cast value {', value, '} to type number.\r\nCurrent value will be {' + currentValue + '}')

const checkOnExistingCastType = (type: any, property: any): boolean => {
  const possibleCastTypes = Object.keys(castPrimitiveTo)
  if (possibleCastTypes.indexOf(type) === -1) {
    throw new Error(
        `Type ${type} of value of property ${property} is not possble for type casting\r\n` +
        `Please use one of following types [${possibleCastTypes.join(', ')}]`
    )
  }
  return true
}

const propertyIsExist = (model: object, property: any): boolean => {
  if (typeof model[property] === 'undefined') {
    console.warn(`Property "${property}" is not existing in model :`, model)
  }
  return true
}

const objectIsDeclarationModel = (declaredModel: any, property: any) => {
  if (!declaredModel.deserialize) {
    throw new Error(
      `Declared model for ${property} is not created via model() function.` +
      `Please wrap this model into "model()" function`
    )
  }
  return true
}

export const castPrimitiveTo: CastPrimitiveTo = {
  boolean: (value: any): boolean => !!value,
  float: (value: any): number => {
    const str = castPrimitiveTo.string(value).replace(',', '.')
    return castPrimitiveTo.number(str)
  },
  integer: (value: any): number => {
    const str = castPrimitiveTo.string(value)
    return castPrimitiveTo.number(castPrimitiveTo.number(str).toFixed(0))
  },
  number: (value: any): number => {
    const castedValue = +value

    if (Number.isNaN(castedValue)) {
      castWarning(value, castedValue)
    }

    return castedValue
  },
  string: (value: any): string => {
    const castedValue = value && value.toString ? value.toString() : `${value}`

    if (castedValue === '[object Object]') {
      castWarning(value, castedValue)
    }

    return castedValue
  },
}

declare interface ConvertationConfig {
  modelConfig: ModelConfiguration,
  toOriginal: boolean
}

export const convertModel = (
  dataModel: object,
  { modelConfig, toOriginal }: ConvertationConfig
) => {
  const model = {}

  for (const { scheme } of modelConfig.declarations) {
    const serializer = castAction[scheme.schemeType as any]

    if (!serializer) {
      throw new Error('Unknown scheme type: ' + scheme.schemeType)
    }

    serializer[toOriginal ? 'toOriginal' : 'toUsage'](dataModel, {
      model,
      modelOptions: modelConfig.options,
      scheme
    })
  }

  if (!Object.keys(model).length) {
    throw new Error('Unknown error. Object is empty after serializing/deserializing')
  }

  return model
}

declare interface CastConfig {
  modelOptions: ModelOptions
  model: object
  scheme: Scheme
}

const castClassArrayToOriginal: CastAction = (
  dataModel: object,
  { model, scheme: { from, to }, modelOptions }: CastConfig
) => {
  modelOptions.warnings && propertyIsExist(dataModel, to.name)
  if (!(dataModel[to.name] instanceof Array)) {
    throw new Error(
      `For ${to.name} property you are use 'fromArray' and ` +
      `because of this property ${to.name} should have type array`
    )
  }
  model[from.name] =
  (dataModel[to.name] as object[]).map(usageModel => {
    objectIsDeclarationModel(usageModel, to.name)
    return (usageModel as InstanceType<ModelWrapper<any>>).deserialize()
  })
}

const castClassArrayToUsage: CastAction = (
  dataModel: object,
  { model, scheme: { from, to }, modelOptions }: CastConfig
) => {
  modelOptions.warnings && propertyIsExist(dataModel, from.name)
  if (!(dataModel[from.name] instanceof Array)) {
    throw new Error(
        `For ${from.name} property you are use 'fromArray' and ` +
        `because of this property ${from.name} should have type array`
      )
  }
  model[to.name] = (dataModel[from.name] as object[]).map(part => {
    const instance = new (from.type as ModelWrapper<any>)(part)
    return objectIsDeclarationModel(instance, from.name) && instance
  })
}

const castClassToOriginal: CastAction = (
  dataModel: object,
  { model, scheme: { from, to }, modelOptions }: CastConfig
) => {
  modelOptions.warnings && propertyIsExist(dataModel, to.name)
  objectIsDeclarationModel(dataModel[to.name], to.name)
  model[from.name] = (dataModel[to.name] as InstanceType<ModelWrapper<any>>).deserialize()
}

const castClassToUsage: CastAction = (
  dataModel: object,
  { model, scheme: { from, to }, modelOptions }: CastConfig
) => {
  modelOptions.warnings && propertyIsExist(dataModel, from.name)
  const instance = new (from.type as ModelWrapper<any>)(dataModel[from.name])
  objectIsDeclarationModel(instance, from.name)
  model[to.name] = instance
}

const castSerializersToOriginal: CastAction = (
  dataModel: object,
  { model, scheme: { from, to }, modelOptions }: CastConfig
) => {
  if (typeof to.serializer === 'function') {
    const partialModel = (to.serializer as Function)(dataModel, model)
    if (partialModel instanceof Array || typeof partialModel !== 'object') {
      throw new Error(
        'Return value of callback function of property .to() should have type object\r\n' +
        'Because return value will be merged into result object model'
      )
    }
    Object.assign(model, partialModel)
  } else delete model[from.name]
}

const castSerializersToUsage: CastAction = (
  dataModel: object,
  { model, scheme: { from, to }, modelOptions }: CastConfig
) => {
  if (typeof from.serializer !== 'function') {
    throw new Error('Custom handler should be exist and have type functions')
  }
  model[to.name] = from.serializer(dataModel)
}

const castStringsToOriginal: CastAction = (
  dataModel: object,
  { model, scheme: { from, to }, modelOptions }: CastConfig
) => {
  modelOptions.warnings && propertyIsExist(dataModel, to.name)
  checkOnExistingCastType(from.type, to.name)
  model[from.name] = castPrimitiveTo[from.type as string](dataModel[to.name])
}

const castStringsToUsage: CastAction = (
  dataModel: object,
  { model, scheme: { from, to }, modelOptions }: CastConfig
) => {
  modelOptions.warnings && propertyIsExist(dataModel, from.name)
  checkOnExistingCastType(to.type, from.name)
  model[to.name] = castPrimitiveTo[to.type as string](dataModel[from.name])
}

const castAction: CastActionsObject = {
  [SchemeType.STRING_AND_CLASS_FOR_ARRAY]: {
    toOriginal: castClassArrayToOriginal,
    toUsage: castClassArrayToUsage,
  },
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
