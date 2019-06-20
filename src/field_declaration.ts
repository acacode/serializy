import { DECLARATION_ARRAY_PROP, DECLARATION_PROP } from './constants'
import { CastPrimitiveTo } from './converter'
import { AllKeysAre } from './global_types'
import { ModelWrapper } from './model_wrapper'
import { PropDeclaration } from './prop_declaration'
import { createSchemeFromOptions } from './scheme'

declare type ModelDeclaration = ModelWrapper | AllKeysAre<PropDeclaration>

export declare type FieldDeclaration<M = any> =
  [string, (keyof CastPrimitiveTo)?, (keyof CastPrimitiveTo)?]
  | [string, ModelDeclaration]
  | [(originalModel: any) => any, ((usageModel: any, partialOriginalModel: object) => any)]

export declare type FieldArrayDeclaration =
  [string, ModelDeclaration]

declare interface FieldCreatorDeclaration {
  (originalProperty: string, originalType?: keyof CastPrimitiveTo, usageType?: keyof CastPrimitiveTo): PropDeclaration
  (originalProperty: string, DeclaredModel: ModelDeclaration): PropDeclaration
  (
    customSerializer: (originalModel: any) => any,
    customDeserializer: (usageModel: any, partialOriginalModel: any) => object
  ): PropDeclaration
}

declare type FieldsArrayCreatorDeclaration = (
  originalProperty: string,
  DeclaredModel: ModelDeclaration
) => PropDeclaration

export const createField: FieldCreatorDeclaration = <M = any>(...options: FieldDeclaration<M>) => ({
  [DECLARATION_PROP]: true,
  [DECLARATION_ARRAY_PROP]: true,
  scheme: createSchemeFromOptions({ options })
})

export const createFieldsArray: FieldsArrayCreatorDeclaration = (...options: FieldArrayDeclaration) => ({
  [DECLARATION_PROP]: true,
  [DECLARATION_ARRAY_PROP]: false,
  scheme: createSchemeFromOptions({ options, [DECLARATION_ARRAY_PROP]: true })
})
