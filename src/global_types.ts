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
  options: FieldDeclaration<M> | FieldArrayDeclaration
}

export declare type FieldDeclaration<M extends object> =
  [string, (keyof CastPrimitiveTo)?, (keyof CastPrimitiveTo)?]
  | [string, ModelWrapper]
  | [(originalModel: M) => any]

export declare type FieldArrayDeclaration =
  [string, object]

export type ValueOf<T> = T[keyof T]

export interface AllKeysAre<T> {
  [key: string]: T
}
