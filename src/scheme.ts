import { ModelWrapper } from './class_definitions'
import { NAME_OF_CLASS_PROP, TYPE_OF_CLASS_PROP_VALUE } from './constants'
import { FromAnyDeclaration, FromArrayDeclaration, PropDeclaration } from './global_types'

export enum SchemeType {
  ONE_STRING = '@ONLY_STRINGS',
  TWO_STRINGS = '@ONLY_STRINGS',
  THREE_STRINGS = '@ONLY_STRINGS',
  STRING_AND_CLASS = '@STRING_AND_CLASS',
  CUSTOM_CONVERTERS = '@CUSTOM_CONVERTERS',
  STRING_AND_CLASS_FOR_ARRAY = '@STRING_AND_CLASS_FOR_ARRAY',
}

export interface SchemeConfig<T = any> {
  converter: null | Function,
  name: typeof NAME_OF_CLASS_PROP | string,
  type: typeof TYPE_OF_CLASS_PROP_VALUE | null | string | ModelWrapper<T>,
}

export declare interface Scheme<T = any> {
  from: SchemeConfig<T>
  to: SchemeConfig<T>
  schemeType: SchemeType | null
}

export const createSchemeFromOptions = <M extends object = any>(
    options: FromAnyDeclaration<M> | FromArrayDeclaration,
    propDeclaration: PropDeclaration
  ): Scheme => {

  const { scheme } = propDeclaration

  const [option1,option2,option3] = options

  if (options.length === 1) {

    if (typeof option1 === 'string') {
      scheme.schemeType = SchemeType.ONE_STRING
      scheme.from.name = option1
      scheme.from.type = TYPE_OF_CLASS_PROP_VALUE
      scheme.to.name = NAME_OF_CLASS_PROP
      scheme.to.type = TYPE_OF_CLASS_PROP_VALUE
    }

    if (typeof option1 === 'function') {
      scheme.schemeType = SchemeType.CUSTOM_CONVERTERS
      scheme.to.name = NAME_OF_CLASS_PROP
      scheme.from.converter = option1
      propDeclaration.to = (converter: (usageModel: any, originalModel: any) => object) => {
        scheme.to.converter = converter
        return propDeclaration
      }
    }
  }

  if (options.length === 2) {

    if (typeof option1 === 'string') {

      if (typeof option2 === 'string') {
        scheme.schemeType = SchemeType.TWO_STRINGS
        scheme.from.name = option1
        scheme.from.type = option2
        scheme.to.name = NAME_OF_CLASS_PROP
        scheme.to.type = option2
      }

      if (typeof option2 === 'function') {
        scheme.schemeType = propDeclaration['@@array_property_declaration'] ?
          SchemeType.STRING_AND_CLASS_FOR_ARRAY : SchemeType.STRING_AND_CLASS
        scheme.from.name = option1
        scheme.from.type = option2 as ModelWrapper<any>
        scheme.to.name = NAME_OF_CLASS_PROP
        scheme.to.type = option2 as ModelWrapper<any>
      }
    }
  }

  if (options.length === 3) {

    if (typeof option1 === 'string' && typeof option2 === 'string' && typeof option3 === 'string') {
      scheme.schemeType = SchemeType.THREE_STRINGS
      scheme.from.name = option1
      scheme.from.type = option2
      scheme.to.name = NAME_OF_CLASS_PROP
      scheme.to.type = option3
    }
  }

  if (scheme.schemeType === null) {
    throw new Error('Scheme is null!\r\n This case where your parameters is not compatible with current mapster scheme')
  }

  return scheme
}
