import { GET_TYPE_FROM_VALUE } from '../constants'
import { AllKeysAre, PropDeclaration } from '../global_declarations'
import { SchemeType } from '../scheme'

const castWarning = (value: any, currentValue: any) =>
    console.warn('Cannot cast value {', value, '} to type number.\r\nCurrent value will be {' + currentValue + '}')

const checkOnExistingCastType = (type: any, property: any): boolean => {
  const possibleCastTypes = Object.keys(castTo)
  if (possibleCastTypes.indexOf(type) === -1) {
    throw new Error(
        `Type ${type} of value of property ${property} is not possble for type casting\r\n` +
        `Please use one of following types [${possibleCastTypes.join(', ')}]`
    )
  }
  return true
}

const checkOnExistingProperty = (value: object, property: any): boolean => {
  if (typeof value[property] === 'undefined') {
    console.warn(`Property "${property}" is not existing in original model :`, value)
  }
  return true
}

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
      castWarning(value, castedValue)
    }

    return castedValue
  },
  string: (value: any): string => {
    const castedValue = value.toString ? value.toString() : `${value}`

    if (castedValue === '[object Object]') {
      castWarning(value, castedValue)
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

      const convertSimplePrimitive = () => {
        if (scheme.to.type === GET_TYPE_FROM_VALUE) {
          const originalType = typeof originalModel[scheme.from.name]
          scheme.to.type = originalType
          scheme.from.type = originalType
        }
        checkOnExistingCastType(scheme.to.type, scheme.from.name)
        checkOnExistingProperty(originalModel, scheme.from.name)
        model[key] = castTo[scheme.to.type as string](originalModel[scheme.from.name])
      }

      switch (declaration[key].scheme.schemeType) {
        case SchemeType.ONE_STRING:
        case SchemeType.TWO_STRINGS:
        case SchemeType.THREE_STRINGS:
          convertSimplePrimitive()
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
  return model
}
