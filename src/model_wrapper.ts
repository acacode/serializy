import { DECLARATION_PROP, NAME_OF_CLASS_PROP, TYPE_OF_CLASS_PROP_VALUE } from './constants'
import { convertModel } from './converter'
import { ValueOf } from './global_types'
import { PropDeclaration } from './prop_declaration'

// export declare class ModelWrapper<T = any> {

//   constructor (originalModel: object): {
//     [field: string]: any
//     deserialize: () => object
//   }
// }

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
}

export declare interface ModelOptions {
  // TODO: add more flexible configuration of defaultValues (as nullable, use empty value of type)
  defaultValues: boolean
  warnings: boolean,
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
): ModelConfiguration => {

  const options = {
    ...DEFAULT_MODEL_OPTIONS,
    ...(modelOptions || {})
  }

  const declarations = Object.keys(objectWithDeclarations).reduce((
    declarations: PropDeclaration[],
    propName: string
  ) => {
    const property: PropDeclaration = objectWithDeclarations[propName]
    if (property[DECLARATION_PROP]) {
      const { scheme } = property

      if (scheme.to.name === NAME_OF_CLASS_PROP) {
        scheme.to.name = propName
      }

      if (scheme.to.type === TYPE_OF_CLASS_PROP_VALUE) {
        const originalType = typeof originalModel[scheme.from.name]
        scheme.to.type = originalType
        scheme.from.type = originalType
      }

      declarations.push({ ...property })

      delete objectWithDeclarations[propName]
    }

    return declarations
  }, [])

  return {
    declarations,
    options,
  }
}

export const createModel = <T extends (object | (new () => ValueOf<T>))>(
  ModelDeclaration: T,
  partialModelOptions?: Partial<ModelOptions>
): ModelWrapper<T> => {

  const serialize: ModelWrapper['serialize'] = (originalModel) => {

    const instance = typeof ModelDeclaration === 'function' ? new (ModelDeclaration as any)() : ModelDeclaration

    const modelConfig = createModelConfig<T>(instance, originalModel, partialModelOptions)

    // TODO: think about it
    // if (originalModel instanceof Array) {
    //   return (originalModel as object[]).map(model => new ModelWrapper(model))
    // }

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
    if (!usageModel.deserialize) {
      throw new Error('Argument of "deserialize" function is not created via "model()" function')
    }
    return usageModel.deserialize()
  }

  return class ModelWrapper {

    static serialize = serialize

    static deserialize = deserialize

    deserialize: any

    constructor (originalModel: object) {
      return serialize(originalModel)
    }

  }
}
