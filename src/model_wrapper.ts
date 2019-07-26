import { SchemeType, TYPE_OF_CLASS_PROP_VALUE } from './constants'
import { convertModel } from './converter'
import { CommonFieldCreator } from './field_declaration'
import { AllKeysAre, InKeyOf, InKeyOfWithType } from './global_types'
import { checkType, error, isObject } from './helpers'
import { preparePropDeclarations, PropDeclaration } from './prop_declaration'

declare interface SerializedObject {
  deserialize(): DeserializedObject
}

declare interface DeserializedObject {
  [originalField: string]: any
}

export declare interface ModelWrapper<T> {
  modelConfiguration: ModelConfiguration
  new (originalModel: object): InKeyOfWithType<DeclarationsInstance<T>, any> &
    SerializedObject
  serialize(
    originalModel: AllKeysAre<any>
  ): InKeyOfWithType<DeclarationsInstance<T>, any> & SerializedObject
  deserialize(usageModel: AllKeysAre<any>): DeserializedObject

  getUsagePropertyNames(): string[]
  getOriginalPropertyNames(): string[]
  getPropertiesMap(reverseNames?: boolean): AllKeysAre<string>
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

const serializeObject = <T>(
  modelConfiguration: ModelConfiguration,
  structure: AllKeysAre<any>
): InKeyOfWithType<DeclarationsInstance<T>, any> & SerializedObject => {
  if (!isObject(structure)) {
    structure = {}
  }

  if (!modelConfiguration.declarationsAreFullyInitialized) {
    for (const {
      scheme: { to, from }
    } of modelConfiguration.declarations)
      if (to.type === TYPE_OF_CLASS_PROP_VALUE)
        to.type = from.type = typeof structure[from.name]

    modelConfiguration.declarationsAreFullyInitialized = true
  }

  const serializedObject = Object.create({
    deserialize: () =>
      convertModel(serializedObject, {
        modelConfiguration,
        toOriginal: true
      })
  })

  return Object.assign(
    serializedObject,
    convertModel(structure, {
      modelConfiguration,
      toOriginal: false
    })
  ) as InKeyOfWithType<DeclarationsInstance<T>, any> & SerializedObject
}

const deserializeObject = <T>(
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

declare type DeclarationsInstance<C> = C extends (new () => any)
  ? InstanceType<C>
  : C

// TODO: complete it
declare type SerializedData<
  C,
  D = InKeyOfWithType<DeclarationsInstance<C>, PropDeclaration>
> = {
  [K in keyof D]: D[K]
}

export const createModel = <T extends object | (new () => any)>(
  Model: T,
  partialModelOptions?: Partial<ModelOptions>
): ModelWrapper<T> => {
  const declarationInstance =
    typeof Model === 'function'
      ? new (Model as any)()
      : new (class Model {
          // it is hack to create unique instances
          constructor(context: any) {
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
      serializeObject<T>(modelConfiguration, originalModel)
    static deserialize = (usageModel: object) =>
      deserializeObject<T>(modelConfiguration, usageModel)
    static getUsagePropertyNames = () =>
      getPropertyNames(modelConfiguration, true)
    static getOriginalPropertyNames = () =>
      getPropertyNames(modelConfiguration, false)
    static getPropertiesMap = (reverseNames?: boolean) =>
      getPropertiesMap(modelConfiguration, reverseNames)

    // instance methods
    deserialize: any

    constructor(originalModel: object) {
      return serializeObject<T>(modelConfiguration, originalModel)
    }
  } as any // TODO: find a good solution to remove this
}
