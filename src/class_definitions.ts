import { convertModel } from './converter'
import { createModelConfig, createPropDeclaration, ModelOptions } from './declaration'
import {
  FromAnyDeclaration,
  FromArrayDeclaration,
  ValueOf
} from './global_types'

export declare type ModelWrapper<T> = new (originalModel: object) => {
  [field: string]: any
  convertToOriginal: () => object
}

export const createModel = <T extends new () => ValueOf<T>>(
  ModelDeclaration: T,
  partialModelOptions?: Partial<ModelOptions>
): ModelWrapper<T> => class ModelWrapper {

  constructor (originalModel: object) {

    const instance = new ModelDeclaration()

    const modelConfig = createModelConfig<T>(instance, originalModel, partialModelOptions)

    // TODO: think about it
    // if (originalModel instanceof Array) {
    //   return (originalModel as object[]).map(model => new ModelWrapper(model))
    // }

    Object.assign(instance, convertModel(originalModel, {
      modelConfig,
      toOriginal: false,
    }))

    // @ts-ignore
    instance.__proto__.convertToOriginal = () => convertModel(instance, {
      modelConfig,
      toOriginal: true,
    })

    return instance
  }

} as ModelWrapper<T>

export const field = <M extends object = any>(...options: FromAnyDeclaration<M>) =>
    createPropDeclaration<M>({ options })

export const fieldArray = (...options: FromArrayDeclaration) =>
    createPropDeclaration({ '@@array_property_declaration': true, options })
