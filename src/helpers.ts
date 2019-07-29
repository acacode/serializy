import { FieldScheme } from './scheme'

export const isObject = (value: any): boolean =>
  typeof value === 'object' && value !== null && !(value instanceof Array)

export const isPrimitive = (value: any): boolean =>
  !(
    typeof value === 'object' ||
    value instanceof Array ||
    typeof value === 'function'
  )

const createInfoMessage = (messageType: string, emoji: string) =>
  `${emoji} [serializy ${messageType}] ${emoji} \r\nMessage:`

export const error = (...messages: any[]): void => {
  console.error(
    createInfoMessage('error', '❗️'),
    ...messages,
    '\r\n' + new Error('').stack
  )
}

export const criticalError = (...messages: any[]): void => {
  throw new Error(createInfoMessage('error', '❗️') + ` ${messages.join('')}`)
}

export const warn = (...messages: any[]): void => {
  console.warn(createInfoMessage('warning', '️️️️⚠️'), ...messages)
}

export const checkType = (
  value: any,
  type: string,
  propertyName: string,
  actionName: string = 'have'
): void | boolean | never => {
  const sentence = ` should ${actionName} interface {type}`

  if (type === 'array' && value instanceof Array) return true
  if (type === 'function' && typeof value === 'function') return true
  if (type === 'object' && isObject(value)) return true

  error(propertyName, sentence)
}

export const checkPropertyExist = (
  object: object,
  field: FieldScheme
): boolean => {
  if (typeof object[field.name] === 'undefined') {
    warn(`Property "${field.name}" is not existing in structure :`, object)
  }
  return true
}
