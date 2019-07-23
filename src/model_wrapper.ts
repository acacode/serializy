import { SchemeType } from './constants'
import { convertModel } from './converter'
import { AllKeysAre, ValueOf } from './global_types'
import { error, isObject, warn } from './helpers'
import { preparePropDeclarations, PropDeclaration } from './prop_declaration'

declare interface SerializedObject {
  [usageField: string]: any, deserialize: () => object
}

declare interface DeserializedObject {
  [originalField: string]: any
}

export declare interface ModelWrapper<T = any> {
  new (originalModel: object): SerializedObject
  serialize (originalModel: object): SerializedObject
  deserialize (usageModel: SerializedObject): DeserializedObject
  getModelConfig (): ModelConfiguration | null
}

export declare interface ModelOptions {
  defaultValues: boolean
  warnings: boolean
}

const DEFAULT_MODEL_OPTIONS: ModelOptions = {
  defaultValues: false,
  warnings: true,
}

export declare interface ModelConfiguration {
  options: ModelOptions
  declarations: PropDeclaration[]
}

export const createModelConfig = <T>(
  objectWithDeclarations: ValueOf<T>,
  originalModel: object,
  modelOptions?: Partial<ModelOptions>
): ModelConfiguration => ({
  declarations: preparePropDeclarations<T>(objectWithDeclarations, originalModel),
  options: {
    ...DEFAULT_MODEL_OPTIONS,
    ...(modelOptions || {})
  },
})

const getPropertyNames = (modelConfig: ModelConfiguration, getOnlyUsageProperties: boolean) => {
  return modelConfig.declarations.reduce((names: string[], declaration) => {
    if (declaration.scheme.schemeType !== SchemeType.SERIALIZERS) {
      names.push(declaration.scheme[getOnlyUsageProperties ? 'to' : 'from'].name)
    }
    return names
  }, [])
}

const getPropertiesMap = (modelConfig: ModelConfiguration, reverseNames?: boolean) =>
  modelConfig.declarations.reduce((namesMap: AllKeysAre<string>, declaration) => {
    if (declaration.scheme.schemeType !== SchemeType.SERIALIZERS) {
      const propertiesNames = [declaration.scheme.to.name, declaration.scheme.from.name]
      const [keyName, value] = reverseNames ? propertiesNames.reverse() : propertiesNames
      namesMap[keyName] = value
    }
    return namesMap
  }, {})

export const createModel = <T extends (object | (new () => ValueOf<T>))>(
  Model: T,
  partialModelOptions?: Partial<ModelOptions>
): ModelWrapper<T> => {

  let modelConfig: ModelConfiguration

  const serialize: ModelWrapper['serialize'] = (originalModel) => {

    if (!isObject(originalModel)) {
      warn('Original model is not an object (current value: ', originalModel, ')')
      originalModel = {}
    }

    const instance = typeof Model === 'function' ?
      new (Model as any)() : new (class Model {
        constructor (context: any) {
          Object.assign(this, { ...context })
        }
      })(Model)

    modelConfig = createModelConfig<T>(instance, originalModel, partialModelOptions)

    Object.assign(instance, convertModel(originalModel, {
      modelConfig,
      toOriginal: false,
    }))

    instance.__proto__.deserialize = () => convertModel(instance, {
      modelConfig,
      toOriginal: true,
    })

    return instance
  }

  const deserialize: ModelWrapper['deserialize'] = (usageModel) => {
    if (!isObject(usageModel)) {
      error('Usage model is not an object.')
    }
    if (!modelConfig) {
      error(
        'This model is never serialized.' +
        'Before use deserialize() needs to serialize() or create new instance of model'
      )
    }
    return convertModel(usageModel, {
      modelConfig,
      toOriginal: true,
    })
  }

  return class ModelWrapper {

    static serialize = serialize
    static deserialize = deserialize

    static getModelConfig = (): (ModelConfiguration | never) => {
      if (!modelConfig) {
        error('Model is not initialized. To do that you should create new instance')
      }
      return modelConfig
    }
    static getUsagePropertyNames = () => getPropertyNames(ModelWrapper.getModelConfig(), true)
    static getOriginalPropertyNames = () => getPropertyNames(ModelWrapper.getModelConfig(), false)
    static getPropertiesMap = (reverseNames?: boolean) => getPropertiesMap(ModelWrapper.getModelConfig(), reverseNames)

    deserialize: any

    constructor (originalModel: object) {
      return serialize(originalModel)
    }
  }
}
