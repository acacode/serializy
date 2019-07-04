export const isObject = (value: any): boolean =>
  typeof value === 'object' && value !== null && !(value instanceof Array)

export const isPrimitive = (value: any): boolean =>
  !(typeof value === 'object' || value instanceof Array || typeof value === 'function')
