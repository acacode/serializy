import { DECLARATION_PROP } from './constants'
import { CastPrimitiveTo } from './converter'
import { AllKeysAre } from './global_types'
import { ModelWrapper } from './model_wrapper'
import { PropDeclaration } from './prop_declaration'
import { createSchemeFromOptions } from './scheme'

export declare type ModelDeclaration =
  | ModelWrapper
  | AllKeysAre<CommonFieldCreator | PropDeclaration>
export declare type ModelArrayDeclaration =
  | ModelDeclaration
  | keyof CastPrimitiveTo

export declare interface BasePropertyOptions {
  arrayType: boolean
}
export declare interface CommonPropertyOptions {
  optional: boolean
}

export declare interface FieldConfiguration
  extends Partial<BasePropertyOptions>,
    Partial<CommonPropertyOptions> {
  name: string
  type?: PropertyType
  usageType?: PropertyType
}

export declare type PropertyNameDeclaration = string
export declare type PropertyType = keyof CastPrimitiveTo
export declare type CustomSerializerFunc = (
  originalModel: AllKeysAre<any>
) => any
export declare type CustomDeserializerFunc = (
  usageModel: AllKeysAre<any>
) => any

export declare type FieldDeclaration<M = any> =
  | [PropertyNameDeclaration, PropertyType?, PropertyType?]
  | [PropertyNameDeclaration, ModelDeclaration]
  | [FieldConfiguration]
  | [CustomSerializerFunc, CustomDeserializerFunc?]

export declare type FieldArrayDeclaration = [
  PropertyNameDeclaration,
  ModelArrayDeclaration
]

export declare interface CommonFieldCreator {
  (propertyOptions: Partial<CommonPropertyOptions>): PropDeclaration
  [DECLARATION_PROP]: boolean
}

export declare interface FieldCreatorDeclaration {
  (
    originalProperty: PropertyNameDeclaration,
    originalType?: PropertyType,
    usageType?: PropertyType
  ): CommonFieldCreator
  (
    originalProperty: PropertyNameDeclaration,
    DeclaredModel: ModelDeclaration
  ): CommonFieldCreator
  (fieldConfiguration: FieldConfiguration): CommonFieldCreator
  (
    customSerializer: CustomSerializerFunc,
    customDeserializer?: CustomDeserializerFunc
  ): CommonFieldCreator
}

export declare type FieldsArrayCreatorDeclaration = (
  originalProperty: PropertyNameDeclaration,
  DeclaredModel: ModelArrayDeclaration
) => CommonFieldCreator

const createFieldDeclaration = <M>(
  options: FieldDeclaration<M> | FieldArrayDeclaration,
  arrayType: boolean
): CommonFieldCreator => {
  const commonFieldCreator = (({ optional = false } = {}) => ({
    [DECLARATION_PROP]: true,
    scheme: createSchemeFromOptions({
      arrayType,
      optional,
      options
    })
  })) as CommonFieldCreator

  commonFieldCreator[DECLARATION_PROP] = true

  return commonFieldCreator
}

export const createField: FieldCreatorDeclaration = <M = any>(
  ...options: FieldDeclaration<M>
) => createFieldDeclaration(options, false)

export const createFieldsArray: FieldsArrayCreatorDeclaration = (
  ...options: FieldArrayDeclaration
) => createFieldDeclaration(options, true)
