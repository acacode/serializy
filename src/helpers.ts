export const isObject = (value: any): boolean =>
  typeof value === 'object' && value !== null && !(value instanceof Array)

export const isPrimitive = (value: any): boolean =>
  !(typeof value === 'object' || value instanceof Array || typeof value === 'function')

export const error = (...messages: any[]): void => {
  console.error('❗️ [serializy error] ❗️ \r\nMessage:', ...messages)
  // throw new Error('').stack
}

export const warn = (...messages: any[]): void => {
  console.warn('⚠️ [serializy warning] ⚠️ \r\nMessage:', ...messages)
}

export const checkType = (
  value: any,
  type: string,
  propertyName: string,
  actionName: string = 'have'
): void | boolean | never => {
  const sentence = ` should ${actionName} type ${type}`

  if (type === 'array' && value instanceof Array) return true
  if (type === 'function' && typeof value === 'function') return true
  if (type === 'object' && isObject(value)) return true

  error(propertyName, sentence)
}

export const checkPropertyExist = (object: object, property: any): boolean => {
  if (typeof object[property] === 'undefined') {
    warn(`Property "${property}" is not existing in structure :`, object)
  }
  return true
}
