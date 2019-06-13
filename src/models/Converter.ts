import { GET_TYPE_FROM_VALUE } from '../constants'
import { AllKeysAre, PropDeclaration } from '../global_declarations'
import { SchemeType } from '../scheme'
import { ModelWrapper } from './DeclaredModel'

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

const checkObjectOnDeclarationType = (declaredModel: any, property: any) => {
  // TODO: REMOVE MODEL_WRAPPER CHECK, BECAUSE DECLARED_MODEL NOW IS FUNCTION MODEL_WRAPPER
  if ((declaredModel as Function).name !== 'ModelWrapper') {
    throw new Error(
      `Declared object for ${property} is not module wrapper.` +
      `Please use "mapy()" function`
    )
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
      const { scheme } = declaration[key]

      model[key] = null

      const originalValue = originalModel[scheme.from.name]
      switch (scheme.schemeType) {
        case SchemeType.ONE_STRING:
        case SchemeType.TWO_STRINGS:
        case SchemeType.THREE_STRINGS:
          if (scheme.to.type === GET_TYPE_FROM_VALUE) {
            const originalType = typeof originalValue
            scheme.to.type = originalType
            scheme.from.type = originalType
          }
          checkOnExistingProperty(originalModel, scheme.from.name)
          checkOnExistingCastType(scheme.to.type, scheme.from.name)
          model[key] = castTo[scheme.to.type as string](originalValue)
          break
        case SchemeType.STRING_AND_CLASS:
          checkOnExistingProperty(originalModel, scheme.from.name)
          checkObjectOnDeclarationType(scheme.from.type, scheme.from.name)
          model[key] = new (scheme.from.type as ModelWrapper<any>)(originalValue)
          break
        case SchemeType.CUSTOM_CONVERTERS:
          if (typeof scheme.from.converter !== 'function') {
            throw new Error('Custom handler should be exist and have type functions')
          }
          model[key] = scheme.from.converter(originalModel)
          break
        case SchemeType.STRING_AND_CLASS_FOR_ARRAY:
          checkOnExistingProperty(originalModel, scheme.from.name)
          checkObjectOnDeclarationType(scheme.from.type, scheme.from.name)
          if (!(originalValue instanceof Array)) {
            throw new Error(
              `For ${scheme.from.name} property you are use 'fromArray' and ` +
              `because of this property ${scheme.from.name} should have type array`
            )
          }
          model[key] = (originalValue as object[]).map(part => new (scheme.from.type as ModelWrapper<any>)(part))
          break
        default: throw new Error('Unknown scheme type: ' + scheme.schemeType)
      }
    }
  })
  return model
}

export const convertUsageToOriginalModel = <D extends AllKeysAre<PropDeclaration>>(
  usageModel: object,
  declaration: D
) => {
  const model = {}
// TODO: aggregate all properties
  Object.keys(declaration).forEach(key => {
    if (declaration[key]['@@property_declaration']) {

      // class FamilyDeclaration {
      //   childCount = field('ChildrenCount', 'number', 'string')
      //   spouse = field('Spouse', 'boolean')
      // }
      // const family = new FamilyModel({
      //   ChildrenCount: 40,
      //   Spouse: false,
      // })
      // {
      //   '@@array_property_declaration': false,
      //   '@@property_declaration': true,
      //   'scheme': {
      //     'from': {
      //       'converter': null,
      //       'name': 'ChildrenCount',
      //       'type': 'number'
      //     },
      //     'schemeType':
      //     '@TWO_STRINGS',
      //     'to': {
      //       'converter': null,
      //       'name': 'childCount',
      //       'type': 'string'
      //     }
      //   },
      //   'to': null
      // }
      const { scheme } = declaration[key]

      if (scheme.from.name) {
        model[scheme.from.name] = null
      }

      const originalValue = usageModel[scheme.to.name]

      switch (scheme.schemeType) {
        case SchemeType.ONE_STRING:
        case SchemeType.TWO_STRINGS:
        case SchemeType.THREE_STRINGS:
          checkOnExistingProperty(usageModel, scheme.to.name)
          checkOnExistingCastType(scheme.from.type, scheme.to.name)
          model[scheme.from.name] = castTo[scheme.from.type as string](originalValue)
          break
        case SchemeType.STRING_AND_CLASS:
          checkOnExistingProperty(usageModel, scheme.to.name)
          checkObjectOnDeclarationType(scheme.from.type, scheme.to.name)
          // TODO: here is needed to use reverse convertation
          model[scheme.from.name] = (originalValue as InstanceType<ModelWrapper<any>>).convertToOriginal()
          break
        case SchemeType.CUSTOM_CONVERTERS:
          if (typeof scheme.to.converter === 'function') {
            // TODO: also needed to send originalModel as second argument to converter
            const partialModel = scheme.to.converter(usageModel)
            if (partialModel instanceof Array || typeof partialModel !== 'object') {
              throw new Error(
                'Return value of callback function of property .to() should have type object\r\n' +
                'Because return value will be merged into result object model'
              )
            }
            Object.assign(model, partialModel)
          } else {
            delete model[scheme.from.name]
          }
          break
        case SchemeType.STRING_AND_CLASS_FOR_ARRAY:
          checkOnExistingProperty(usageModel, scheme.to.name)
          checkObjectOnDeclarationType(scheme.from.type, scheme.to.name)
          if (!(originalValue instanceof Array)) {
            throw new Error(
              `For ${scheme.to.name} property you are use 'fromArray' and ` +
              `because of this property ${scheme.to.name} should have type array`
            )
          }
          model[scheme.from.name] =
            (originalValue as object[]).map(part => (part as InstanceType<ModelWrapper<any>>).convertToOriginal())
          break
        default: throw new Error('Unknown scheme type: ' + scheme.schemeType)
      }
    }
  })
  return model
}
