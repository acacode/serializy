/**
 * Copyright (c) acacode, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

// const castTo = {
//   boolean: (value: any) => !!value,
//   float: (value: any) => {
//     const str = castTo.string(value).replace(',', '.')
//     return castTo.number(str)
//   },
//   integer: (value: any) => {
//     const str = castTo.string(value)
//     return castTo.number((+str).toFixed(0))
//   },
//   number: (value: any): number => {
//     const castedValue = +value

//     if (Number.isNaN(castedValue)) {
//       console.warn('Cannot cast value {', value, '} to type number.\r\nCurrent value will be {NaN}')
//     }

//     return castedValue
//   },
//   string: (value: any): string => {
//     const castedValue = value.toString ? value.toString() : `${value}`

//     if (castedValue === '[object Object]') {
//       console.warn('Cannot cast value {', value, '} to type string.\r\nCurrent value will be {[object Object]}')
//     }

//     return castedValue
//   },
// }

export * from './scheme'
export * from './constants'
export * from './global_declarations'
export * from './class_definitions'
