import { DECLARATION_ARRAY_PROP } from './constants'
import { CastPrimitiveTo } from './converter'
import { ModelWrapper } from './model_wrapper'
import { createPropDeclaration, PropDeclaration } from './prop_declaration'

export declare type FieldDeclaration<M = any> =
  [string, (keyof CastPrimitiveTo)?, (keyof CastPrimitiveTo)?]
  | [string, ModelWrapper]
  | [(originalModel: any) => any, ((usageModel: any, partialOriginalModel: object) => any)]

export declare type FieldArrayDeclaration =
  [string, object]

declare interface FieldCreatorDeclaration {
  (originalProperty: string, originalType?: keyof CastPrimitiveTo, usageType?: keyof CastPrimitiveTo): PropDeclaration
    // TODO: add non required models wrapped by ModelWrapper
  (originalProperty: string, DeclaredModel: ModelWrapper): PropDeclaration
  (
    customSerializer: (originalModel: any) => any,
    customDeserializer: (usageModel: any, partialOriginalModel: any) => object
  ): PropDeclaration
}

declare type FieldsArrayCreatorDeclaration = (originalProperty: string, DeclaredModel: ModelWrapper) => PropDeclaration

export const createField: FieldCreatorDeclaration = <M = any>(...options: FieldDeclaration<M>) =>
      createPropDeclaration<M>({ options })

export const createFieldsArray: FieldsArrayCreatorDeclaration = (...options: FieldArrayDeclaration) =>
      createPropDeclaration({ [DECLARATION_ARRAY_PROP]: true, options })
