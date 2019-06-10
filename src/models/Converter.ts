import { AllKeysAre, PropDeclaration } from '../global_declarations'
import { SchemeType } from '../scheme'

const castTo = {
  boolean: (value: any) => !!value,
  float: (value: any) => {
    const str = castTo.string(value).replace(',', '.')
    return castTo.number(str)
  },
  integer: (value: any) => {
    const str = castTo.string(value)
    return castTo.number((+str).toFixed(0))
  },
  number: (value: any): number => {
    const castedValue = +value

    if (Number.isNaN(castedValue)) {
      console.warn('Cannot cast value {', value, '} to type number.\r\nCurrent value will be {NaN}')
    }

    return castedValue
  },
  string: (value: any): string => {
    const castedValue = value.toString ? value.toString() : `${value}`

    if (castedValue === '[object Object]') {
      console.warn('Cannot cast value {', value, '} to type string.\r\nCurrent value will be {[object Object]}')
    }

    return castedValue
  },
}

export const convertOriginalToUsageModel = <D extends AllKeysAre<PropDeclaration>>(
    originalModel: object,
    declaration: D
) => {
  const model = {}
  // TODO: aggregate all properties
  Object.keys(declaration).forEach(key => {
    if (declaration[key]['@@property_declaration']) {
      model[key] = null
      const { scheme, to } = declaration[key]
      // const originalType = typeof originalModel[key]
      switch (declaration[key].scheme.schemeType) {
        case SchemeType.ONE_STRING:
          console.log('scheme.from.name', scheme.from.name)
          break
        case SchemeType.TWO_STRINGS:
          console.log('scheme.from.name', scheme.from.name)
          // @ts-ignore
          model[key] = castTo[originalModel[scheme.from.type]](originalModel[scheme.from.name])
          break
        case SchemeType.THREE_STRINGS:
          console.log('scheme.from.name', scheme.from.name)
          break
        case SchemeType.STRING_AND_DECLARE_MODEL:
          console.log('scheme.from.name', scheme.from.name)
          break
        case SchemeType.CONFIGURATORS:
          console.log('to', to)
          break
        case SchemeType.STRING_AND_DECLARE_MODEL_FOR_ARRAY:
          console.log('scheme.from.name', scheme.from.name)
          break
        default: throw new Error('Unknown scheme type: ' + declaration[key].scheme.schemeType)
      }
    }
  })
  console.log('originalModel', originalModel, declaration)
  return model
}
