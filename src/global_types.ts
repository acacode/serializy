export type ValueOf<T> = T[keyof T]

export interface AllKeysAre<T> {
  [key: string]: T
}
