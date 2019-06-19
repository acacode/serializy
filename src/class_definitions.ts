import { DECLARATION_ARRAY_PROP } from './constants'
import { CastPrimitiveTo, convertModel } from './converter'
import { createModelConfig, createPropDeclaration, ModelOptions } from './declaration'
import {
  FromAnyDeclaration,
  FromArrayDeclaration,
  PropDeclaration,
  ValueOf
} from './global_types'

export declare type ModelWrapper<T = any> = new (originalModel: object) => {
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

declare interface FieldCreatorDeclaration {
  (originalProperty: string, originalType?: keyof CastPrimitiveTo, usageType?: keyof CastPrimitiveTo): PropDeclaration
  // TODO: add non required models wrapped by ModelWrapper
  (originalProperty: string, DeclaredModel: ModelWrapper): PropDeclaration
  // TODO: add ability to attach custom converter for original model
  (usagePropCustomConverter: (originalModel: object) => any): PropDeclaration
}
declare type FieldsArrayCreatorDeclaration = (originalProperty: string, DeclaredModel: ModelWrapper) => PropDeclaration

export const field: FieldCreatorDeclaration = <M extends object = any>(...options: FromAnyDeclaration<M>) =>
    createPropDeclaration<M>({ options })

export const fieldArray: FieldsArrayCreatorDeclaration = (...options: FromArrayDeclaration) =>
    createPropDeclaration({ [DECLARATION_ARRAY_PROP]: true, options })
