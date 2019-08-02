import { SchemeType } from './constants'
import { convertModel } from './converter'
import { CommonFieldCreator } from './field_declaration'
import { AllKeysAre, InKeyOfWithType } from './global_types'
import { checkType, error, isObject } from './helpers'
import { preparePropDeclarations, PropDeclaration } from './prop_declaration'

declare interface SerializedObject {
  deserialize(): DeserializedObject
}

declare interface DeserializedObject {
  [originalField: string]: any
}

declare type SerializedStructure<T> = InKeyOfWithType<
  DeclarationsInstance<T>,
  any
> &
  SerializedObject

export declare interface ModelWrapper<T> {
  modelConfiguration: ModelConfiguration
  new (originalModel: object): SerializedStructure<T>
  serialize(originalModel: AllKeysAre<any>): SerializedStructure<T>
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
  options: ModelOptions
  declarations: PropDeclaration[]
}

export const createModelConfig = <T>(
  objectWithDeclarations: AllKeysAre<PropDeclaration | CommonFieldCreator>,
  modelOptions?: Partial<ModelOptions>
): ModelConfiguration => ({
  declarations: preparePropDeclarations<T>(objectWithDeclarations),
  options: {
    ...DEFAULT_MODEL_OPTIONS,
    ...(modelOptions || {})
  }
})

const serializeObject = <T>(
  modelConfiguration: ModelConfiguration,
  structure: AllKeysAre<any>
): SerializedStructure<T> => {
  if (!isObject(structure)) {
    structure = {}
  }

  const serializedObject = Object.create({
    deserialize: () => convertModel(serializedObject, modelConfiguration, true)
  })

  return Object.assign(
    serializedObject,
    convertModel(structure, modelConfiguration, false)
  ) as SerializedStructure<T>
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
  return convertModel(structure, modelConfiguration, true)
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
// declare type SerializedData<
//   C,
//   D = InKeyOfWithType<DeclarationsInstance<C>, PropDeclaration>
// > = {
//   [K in keyof D]: D[K]
// }

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
