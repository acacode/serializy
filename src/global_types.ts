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

export type AnyKindOfDictionary<T= unknown> = Dictionary<T> | NumericDictionary<T>

export type Many<T> = T | ReadonlyArray<T>

export type PropertyName = string | number | symbol

// TODO: use it
export type DDD<T extends AnyKindOfDictionary> = (
  object: T | null | undefined,
  ...paths: Array<Many<PropertyName>>
) => T
