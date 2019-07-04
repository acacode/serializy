import { SchemeType } from './constants'
import { isObject, isPrimitive } from './helpers'
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
  value !== null && console.warn('⚠️: Not possible to cast value "', value, `" to type ${toType}.`)

const checkOnExistingCastType = (type: any, property: any): boolean => {
  const possibleCastTypes = Object.keys(castTo)
  if (possibleCastTypes.indexOf(type) === -1) {
    throw new Error(
        `❗️: Type ${type} of value of property ${property} is not possble for type casting\r\n` +
        `Please use one of following types: ${possibleCastTypes.join(', ')}`
    )
  }
  return true
}

const propertyIsExist = (model: object, property: any): boolean => {
  if (typeof model[property] === 'undefined') {
    console.warn(`⚠️: Property "${property}" is not existing in model :`, model)
  }
  return true
}

const objectIsDeclarationModel = (declaredModel: any, property: any) => {
  if (!declaredModel.deserialize) {
    throw new Error(
      `❗️: Declared model for ${property} is not created via model() function.` +
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
    throw new Error('❗️: Unknown error. Object is empty after serializing/deserializing')
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
  modelOptions.warnings && propertyIsExist(dataModel, to.name)
  if (arrayType) {
    if (!(dataModel[to.name] instanceof Array)) {
      throw new Error(
        `❗️: For ${to.name} property you are use 'fieldArray()' and ` +
        `because of this property ${to.name} should have type array`
      )
    }
    model[from.name] =
    (dataModel[to.name] as object[]).map(usageModel => {
      objectIsDeclarationModel(usageModel, to.name)
      return (usageModel as InstanceType<ModelWrapper<any>>).deserialize()
    })
  } else {
    objectIsDeclarationModel(dataModel[to.name], to.name)
    model[from.name] = (dataModel[to.name] as InstanceType<ModelWrapper<any>>).deserialize()
  }
}

const castClassToUsage: CastAction = (
  dataModel: object,
  { model, scheme: { from, to, arrayType }, modelOptions }: CastConfig
) => {
  modelOptions.warnings && propertyIsExist(dataModel, from.name)
  if (arrayType) {
    if (!(dataModel[from.name] instanceof Array)) {
      throw new Error(
          `❗️: For ${from.name} property you are use 'fieldArray()' and ` +
          `because of this property ${from.name} should have type array`
        )
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
  { model, scheme: { from, to }, modelOptions }: CastConfig
) => {
  if (typeof to.serializer === 'function') {
    const partialModel = (to.serializer as Function)(dataModel, model)
    if (!isObject(partialModel)) {
      throw new Error(
        '❗️: Return value of callback function of property .to() should have type object\r\n' +
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
    throw new Error('❗️: Custom handler should be exist and have type functions')
  }
  model[to.name] = from.serializer(dataModel)
}

const castStringsToOriginal: CastAction = (
  dataModel: object,
  { model, scheme: { from, to, arrayType }, modelOptions }: CastConfig
) => {
  modelOptions.warnings && propertyIsExist(dataModel, to.name)
  if (arrayType) {
    if (!(dataModel[to.name] instanceof Array)) {
      throw new Error(
        `❗️: For ${to.name} property you are use 'fieldArray()' and ` +
        `because of this original property ${from.name} should have type array`
      )
    }
    model[from.name] =
    (dataModel[to.name] as object[]).map(value => {
      checkOnExistingCastType(from.type, to.name)
      return castTo[from.type as keyof CastPrimitiveTo](value)
    })
  } else {
    checkOnExistingCastType(from.type, to.name)
    model[from.name] = castTo[from.type as keyof CastPrimitiveTo](dataModel[to.name])
  }
}

const castStringsToUsage: CastAction = (
  dataModel: object,
  { model, scheme: { from, to, arrayType }, modelOptions }: CastConfig
) => {
  modelOptions.warnings && propertyIsExist(dataModel, from.name)
  if (arrayType) {
    if (!(dataModel[from.name] instanceof Array)) {
      throw new Error(
        `❗️: For ${from.name} property you are use 'fieldArray()' and ` +
        `because of this usage property ${to.name} should have type array`
      )
    }
    model[to.name] = (dataModel[from.name] as object[]).map(value => {
      checkOnExistingCastType(to.type, from.name)
      return castTo[to.type as keyof CastPrimitiveTo](value)
    })
  } else {
    checkOnExistingCastType(to.type, from.name)
    model[to.name] = castTo[to.type as keyof CastPrimitiveTo](dataModel[from.name])
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
