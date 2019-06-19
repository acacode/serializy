import { ModelWrapper } from './class_definitions'
import { ModelConfiguration, ModelOptions } from './declaration'
import { Scheme, SchemeType } from './scheme'

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
  if (!declaredModel.convertToOriginal) {
    throw new Error(
      `Declared model for ${property} is not created via createModel() function.` +
      `Please wrap this model into "createModel()" function`
    )
  }
  return true
}

export declare interface CastPrimitiveTo {
  boolean: (value: any) => boolean
  float: (value: any) => number
  integer: (value: any) => number
  number: (value: any) => number
  string: (value: any) => string
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
    const converter = castAction[scheme.schemeType as any]

    if (!converter) {
      throw new Error('Unknown scheme type: ' + scheme.schemeType)
    }

    converter[toOriginal ? 'toOriginal' : 'toUsage'](dataModel, {
      model,
      modelOptions: modelConfig.options,
      scheme
    })
  }

  return model
}

declare interface CastConfig {
  modelOptions: ModelOptions
  model: object
  scheme: Scheme
}

const castClassArrayToOriginal = (dataModel: object, { model, scheme, modelOptions }: CastConfig) => {
  propertyIsExist(dataModel, scheme.to.name)
  if (!(dataModel[scheme.to.name] instanceof Array)) {
    throw new Error(
      `For ${scheme.to.name} property you are use 'fromArray' and ` +
      `because of this property ${scheme.to.name} should have type array`
    )
  }
  model[scheme.from.name] =
  (dataModel[scheme.to.name] as object[]).map(usageModel => {
    objectIsDeclarationModel(usageModel, scheme.to.name)
    return (usageModel as InstanceType<ModelWrapper<any>>).convertToOriginal()
  })
}

const castClassArrayToUsage = (dataModel: object, { model, scheme: { from, to }, modelOptions }: CastConfig) => {
  propertyIsExist(dataModel, from.name)
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

const castClassToOriginal = (dataModel: object, { model, scheme, modelOptions }: CastConfig) => {
  propertyIsExist(dataModel, scheme.to.name)
  objectIsDeclarationModel(dataModel[scheme.to.name], scheme.to.name)
  model[scheme.from.name] = (dataModel[scheme.to.name] as InstanceType<ModelWrapper<any>>).convertToOriginal()
}

const castClassToUsage = (dataModel: object, { model, scheme, modelOptions }: CastConfig) => {
  propertyIsExist(dataModel, scheme.from.name)
  const instance = new (scheme.from.type as ModelWrapper<any>)(dataModel[scheme.from.name])
  objectIsDeclarationModel(instance, scheme.from.name)
  model[scheme.to.name] = instance
}

const castCustomConvertersToOriginal = (dataModel: object, { model, scheme, modelOptions }: CastConfig) => {
  if (typeof scheme.to.converter === 'function') {
    const partialModel = (scheme.to.converter as Function)(dataModel, model)
    if (partialModel instanceof Array || typeof partialModel !== 'object') {
      throw new Error(
        'Return value of callback function of property .to() should have type object\r\n' +
        'Because return value will be merged into result object model'
      )
    }
    Object.assign(model, partialModel)
  } else delete model[scheme.from.name]
}

const castCustomConvertersToUsage = (dataModel: object, { model, scheme, modelOptions }: CastConfig) => {
  if (typeof scheme.from.converter !== 'function') {
    throw new Error('Custom handler should be exist and have type functions')
  }
  model[scheme.to.name] = scheme.from.converter(dataModel)
}

const castStringsToOriginal = (dataModel: object, { model, scheme: { from, to }, modelOptions }: CastConfig) => {
  propertyIsExist(dataModel, to.name)
  checkOnExistingCastType(from.type, to.name)
  model[from.name] = castPrimitiveTo[from.type as string](dataModel[to.name])
}

const castStringsToUsage = (dataModel: object, { model, scheme: { from, to }, modelOptions }: CastConfig) => {
  propertyIsExist(dataModel, from.name)
  checkOnExistingCastType(to.type, from.name)
  model[to.name] = castPrimitiveTo[to.type as string](dataModel[from.name])
}

const castAction = {
  [SchemeType.STRING_AND_CLASS_FOR_ARRAY]: {
    toOriginal: castClassArrayToOriginal,
    toUsage: castClassArrayToUsage,
  },
  [SchemeType.STRING_AND_CLASS]: {
    toOriginal: castClassToOriginal,
    toUsage: castClassToUsage,
  },
  [SchemeType.CUSTOM_CONVERTERS]: {
    toOriginal: castCustomConvertersToOriginal,
    toUsage: castCustomConvertersToUsage,
  },
  [SchemeType.THREE_STRINGS]: {
    toOriginal: castStringsToOriginal,
    toUsage: castStringsToUsage,
  }
}
