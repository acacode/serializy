export const isObject = (value: any): boolean =>
  typeof value === 'object' && value !== null && !(value instanceof Array)

export const isPrimitive = (value: any): boolean =>
  !(typeof value === 'object' || value instanceof Array || typeof value === 'function')

export const error = (...messages: any[]): never => {
  console.error('❗️ : ', ...messages)
  throw new Error('❗️ : Exception based on message above')
}

export const warn = (...messages: any[]): void => {
  console.warn('⚠️ : ', ...messages)
}
