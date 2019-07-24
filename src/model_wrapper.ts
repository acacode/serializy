import { SchemeType, TYPE_OF_CLASS_PROP_VALUE } from './constants'
import { convertModel } from './converter'
import { CommonFieldCreator } from './field_declaration'
import { AllKeysAre, ValueOf } from './global_types'
import { checkType, error, isObject } from './helpers'
import { preparePropDeclarations, PropDeclaration } from './prop_declaration'

declare interface SerializedObject {
  [usageField: string]: any
  deserialize: () => object
}

declare interface DeserializedObject {
  [originalField: string]: any
}

export declare interface ModelWrapper<T = any> {
  modelConfiguration: ModelConfiguration
  new (originalModel: object): SerializedObject
  serialize (originalModel: AllKeysAre<any>): SerializedObject
  deserialize (usageModel: AllKeysAre<any>): DeserializedObject

  getUsagePropertyNames (): string[]
  getOriginalPropertyNames (): string[]
  getPropertiesMap (reverseNames?: boolean): AllKeysAre<string>
}

export declare interface ModelOptions {
  defaultValues: boolean
  warnings: boolean
}

const DEFAULT_MODEL_OPTIONS: ModelOptions = {
  defaultValues: false,
  warnings: true
}

export declare interface ModelConfiguration {
  declarationsAreFullyInitialized: boolean
  options: ModelOptions
  declarations: PropDeclaration[]
}

export const createModelConfig = <T>(
  objectWithDeclarations: AllKeysAre<PropDeclaration | CommonFieldCreator>,
  modelOptions?: Partial<ModelOptions>
): ModelConfiguration => ({
  declarations: preparePropDeclarations<T>(objectWithDeclarations),
  declarationsAreFullyInitialized: false,
  options: {
    ...DEFAULT_MODEL_OPTIONS,
    ...(modelOptions || {})
  }
})

const serializeObject = (
  modelConfiguration: ModelConfiguration,
  structure: AllKeysAre<any>
): SerializedObject => {

  if (!isObject(structure)) {
    structure = {}
  }

  if (!modelConfiguration.declarationsAreFullyInitialized) {
    for (const {
      scheme: { to, from }
    } of modelConfiguration.declarations) {
      if (to.type === TYPE_OF_CLASS_PROP_VALUE) {
        const originalType = typeof structure[from.name]
        to.type = originalType
        from.type = originalType
      }
    }

    modelConfiguration.declarationsAreFullyInitialized = true
  }

  const serializedObject = Object.create({
    deserialize: () =>
      convertModel(serializedObject, {
        modelConfiguration,
        toOriginal: true
      })
  })

  Object.assign(serializedObject, convertModel(structure, {
    modelConfiguration,
    toOriginal: false
  }) as SerializedObject)

  return serializedObject
}

const deserializeObject = (
  modelConfiguration: ModelConfiguration,
  structure: AllKeysAre<any>
): DeserializedObject => {
  checkType(structure, 'object', 'Usage model')

  if (!modelConfiguration) {
    error(
      'This model is never serialized.' +
      'Before using deserialize() needs to call serialize() or create new instance of model'
    )
  }
  return convertModel(structure, {
    modelConfiguration,
    toOriginal: true
  })
}

const getPropertyNames = (
  { declarations }: ModelConfiguration,
  getOnlyUsageProperties: boolean
) => {
  return declarations.reduce((names: string[], declaration) => {
    if (declaration.scheme.schemeType !== SchemeType.SERIALIZERS) {
      names.push(
        declaration.scheme[getOnlyUsageProperties ? 'to' : 'from'].name
      )
    }
    return names
  }, [])
}

const getPropertiesMap = (
  { declarations }: ModelConfiguration,
  reverseNames?: boolean
): AllKeysAre<string> =>
  declarations.reduce((namesMap: AllKeysAre<string>, declaration) => {
    if (declaration.scheme.schemeType !== SchemeType.SERIALIZERS) {
      const propertiesNames = [
        declaration.scheme.to.name,
        declaration.scheme.from.name
      ]
      const [keyName, value] = reverseNames
        ? propertiesNames.reverse()
        : propertiesNames
      namesMap[keyName] = value
    }
    return namesMap
  }, {})

export const createModel = <T extends object | (new () => ValueOf<T>)>(
  Model: T,
  partialModelOptions?: Partial<ModelOptions>
): ModelWrapper<T> => {
  const declarationInstance =
    typeof Model === 'function'
      ? new (Model as any)()
      : new (class Model {
          // it is hack to create unique instances
        constructor (context: any) {
          Object.assign(this, { ...context })
        }
      })(Model)

  const modelConfiguration: ModelConfiguration = createModelConfig<T>(
    declarationInstance,
    partialModelOptions
  )

  return class ModelWrapper {
    static modelConfiguration = modelConfiguration

    static serialize = (originalModel: object) =>
      serializeObject(modelConfiguration, originalModel)
    static deserialize = (usageModel: object) =>
      deserializeObject(modelConfiguration, usageModel)
    static getUsagePropertyNames = () =>
      getPropertyNames(modelConfiguration, true)
    static getOriginalPropertyNames = () =>
      getPropertyNames(modelConfiguration, false)
    static getPropertiesMap = (reverseNames?: boolean) =>
      getPropertiesMap(modelConfiguration, reverseNames)

    // instance methods
    deserialize: any

    constructor (originalModel: object) {
      return serializeObject(modelConfiguration, originalModel)
    }
  }
}
