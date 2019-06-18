import { convertModel } from './converter'
import { createDeclaration, createPropDeclaration } from './declaration'
import {
  FromAnyDeclaration,
  FromArrayDeclaration,
  ValueOf
} from './global_types'

export declare interface ModelConfiguration {
  // TODO: add more flexible configuration of defaultValues (as nullable, use empty value of type)
  defaultValues: boolean
  warnings: boolean,
}

const DEFAULT_MODEL_CONFIGURATION: ModelConfiguration = {
  defaultValues: true,
  warnings: true,
}

export declare type ModelWrapper<T> = new (originalModel: object) => {
  [field: string]: any
  convertToOriginal: () => object
}

export const createModel = <T extends new () => ValueOf<T>>(
  ModelDeclaration: T,
  partialModelConfiguration?: Partial<ModelConfiguration>
): ModelWrapper<T> => class ModelWrapper {

  constructor (originalModel: object) {

    const instance = new ModelDeclaration()

    const modelConfiguration = {
      ...DEFAULT_MODEL_CONFIGURATION,
      ...(partialModelConfiguration || {})
    }

    // TODO: Add handlers for configuration
    console.log('TODO: modelConfiguration', modelConfiguration)

    const declaration = createDeclaration<T>(instance, originalModel)

    // TODO: think about it
    // if (originalModel instanceof Array) {
    //   return (originalModel as object[]).map(model => new ModelWrapper(model))
    // }

    Object.assign(instance, convertModel(originalModel, {
      declaration,
      modelConfiguration,
      toOriginal: false,
    }))

    // @ts-ignore
    instance.__proto__.convertToOriginal = () => convertModel(instance, {
      declaration,
      modelConfiguration,
      toOriginal: true,
    })

    return instance
  }

} as ModelWrapper<T>

export const field = <M extends object = any>(...options: FromAnyDeclaration<M>) =>
    createPropDeclaration<M>({ options })

export const fieldArray = (...options: FromArrayDeclaration) =>
    createPropDeclaration({ '@@array_property_declaration': true, options })
