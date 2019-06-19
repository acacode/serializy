import { ModelWrapper } from './class_definitions'
import { DECLARATION_PROP } from './constants'
import { CastPrimitiveTo } from './converter'
import { Scheme } from './scheme'

export declare interface PropDeclaration {
  '@@array_property_declaration': boolean
  [DECLARATION_PROP]: true,

  to: (converter: (usageModel: any, originalModel: any) => object) => PropDeclaration

  scheme: Scheme
}

export declare interface PropDeclarationConfiguration<M extends object = any> {
  '@@array_property_declaration'?: boolean
  options: FromAnyDeclaration<M> | FromArrayDeclaration
}

export declare type FromAnyDeclaration<M extends object> =
  [string, (keyof CastPrimitiveTo)?, (keyof CastPrimitiveTo)?]
  | [string, ModelWrapper] // :TODO replace object to TYPE
  | [(originalModel: M) => any] // :TODO replace object to TYPE

export declare type FromArrayDeclaration =
  [string, object]

export type ValueOf<T> = T[keyof T]

export interface AllKeysAre<T> {
  [key: string]: T
}
