export type ValueOf<T> = T[keyof T]

export interface AllKeysAre<T> {
  [key: string]: T
}

export interface Dictionary<T> {
  [index: string]: T
}
export interface NumericDictionary<T> {
  [index: number]: T
}

export type AnyDictionary<T = unknown> = Dictionary<T> | NumericDictionary<T>

export type Many<T> = T | ReadonlyArray<T>

export type PropertyName = string | number | symbol

export type InKeyOf<M> = {
  [K in keyof M]: M[K]
}

export type InKeyOfWithType<M, T> = {
  [K in keyof M]: T
}
// export type PropertyNamesArray = Array<Many<PropertyName>>
