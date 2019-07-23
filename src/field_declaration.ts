import { DECLARATION_PROP } from './constants'
import { CastPrimitiveTo } from './converter'
import { AllKeysAre } from './global_types'
import { ModelWrapper } from './model_wrapper'
import { PropDeclaration } from './prop_declaration'
import { createSchemeFromOptions } from './scheme'

export declare type ModelDeclaration = ModelWrapper | AllKeysAre<PropDeclaration>
export declare type ModelArrayDeclaration = ModelDeclaration | keyof CastPrimitiveTo

export declare interface FieldConfiguration {
  name: string,
  readOnly?: boolean,
  writeOnly?: boolean,
  type?: PropertyType,
  usageType?: PropertyType
}

export declare type PropertyNameDeclaration = string
export declare type PropertyType = keyof CastPrimitiveTo
export declare type CustomSerializerFunc = (originalModel: AllKeysAre<any>) => any
export declare type CustomDeserializerFunc = (usageModel: AllKeysAre<any>) => any

export declare type FieldDeclaration<M = any> =
  [PropertyNameDeclaration, PropertyType?, PropertyType?] |
  [PropertyNameDeclaration, ModelDeclaration] |
  [FieldConfiguration] |
  [CustomSerializerFunc, CustomDeserializerFunc?]

export declare type FieldArrayDeclaration =
  [PropertyNameDeclaration, ModelArrayDeclaration]

export declare interface FieldCreatorDeclaration {
  (
    originalProperty: PropertyNameDeclaration,
    originalType?: PropertyType,
    usageType?: PropertyType
  ): PropDeclaration
  (
    originalProperty: PropertyNameDeclaration,
    DeclaredModel: ModelDeclaration
  ): PropDeclaration
  (
    fieldConfiguration: FieldConfiguration
  ): PropDeclaration
  (
    customSerializer: CustomSerializerFunc,
    customDeserializer?: CustomDeserializerFunc
  ): PropDeclaration
}

export declare type FieldsArrayCreatorDeclaration = (
  originalProperty: PropertyNameDeclaration,
  DeclaredModel: ModelArrayDeclaration
) => PropDeclaration

const createFieldDeclaration = <M>(
  options: FieldDeclaration<M> | FieldArrayDeclaration,
  arrayType: boolean
) => ({
  [DECLARATION_PROP]: true,
  scheme: createSchemeFromOptions({ options, arrayType })
})

export const createField: FieldCreatorDeclaration = <M = any>(...options: FieldDeclaration<M>) =>
  createFieldDeclaration(options, false)

export const createFieldsArray: FieldsArrayCreatorDeclaration = (...options: FieldArrayDeclaration) =>
  createFieldDeclaration(options, true)
