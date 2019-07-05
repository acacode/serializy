import { DECLARATION_PROP } from './constants'
import { CastPrimitiveTo } from './converter'
import { AllKeysAre } from './global_types'
import { ModelWrapper } from './model_wrapper'
import { PropDeclaration } from './prop_declaration'
import { createSchemeFromOptions } from './scheme'

export declare type ModelDeclaration = ModelWrapper | AllKeysAre<PropDeclaration>
export declare type ModelArrayDeclaration = ModelDeclaration | keyof CastPrimitiveTo

export declare type FieldDeclaration<M = any> =
  [string, (keyof CastPrimitiveTo)?, (keyof CastPrimitiveTo)?]
  | [string, ModelDeclaration]
  | [(originalModel: object) => any, ((usageModel: any, partialOriginalModel: object) => any)?]

export declare type FieldArrayDeclaration =
  [string, ModelArrayDeclaration]

export declare interface FieldCreatorDeclaration {
  (originalProperty: string, originalType?: keyof CastPrimitiveTo, usageType?: keyof CastPrimitiveTo): PropDeclaration
  (originalProperty: string, DeclaredModel: ModelDeclaration): PropDeclaration
  (
    customSerializer: (originalModel: any) => any,
    customDeserializer?: (usageModel: any, partialOriginalModel: any) => any
  ): PropDeclaration
}

export declare type FieldsArrayCreatorDeclaration = (
  originalProperty: string,
  DeclaredModel: ModelArrayDeclaration
) => PropDeclaration

export const createField: FieldCreatorDeclaration = <M = any>(...options: FieldDeclaration<M>) => ({
  [DECLARATION_PROP]: true,
  scheme: createSchemeFromOptions({ options, arrayType: false })
})

export const createFieldsArray: FieldsArrayCreatorDeclaration = (...options: FieldArrayDeclaration) => ({
  [DECLARATION_PROP]: true,
  scheme: createSchemeFromOptions({ options, arrayType: true })
})
