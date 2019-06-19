import { ModelWrapper } from './class_definitions'
import { DECLARATION_ARRAY_PROP, DECLARATION_PROP } from './constants'
import { CastPrimitiveTo } from './converter'
import { Scheme } from './scheme'

export declare interface PropDeclaration {
  [DECLARATION_ARRAY_PROP]: boolean
  [DECLARATION_PROP]: true,

  to: (converter: (usageModel: any, originalModel: any) => object) => PropDeclaration

  scheme: Scheme
}

export declare interface PropDeclarationConfiguration<M extends object = any> {
  [DECLARATION_ARRAY_PROP]?: boolean
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
