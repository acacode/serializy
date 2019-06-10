import { GET_NAME_TO_FROM_CLASS_PROP, GET_TYPE_FROM_VALUE } from './constants'
import { FromAnyDeclaration, FromArrayDeclaration, PropDeclaration } from './global_declarations'

export enum SchemeType {
  ONE_STRING,
  TWO_STRINGS,
  THREE_STRINGS,
  STRING_AND_DECLARE_MODEL,
  CONFIGURATORS,
  STRING_AND_DECLARE_MODEL_FOR_ARRAY,
}

export interface SchemeConfig {
  customHandler: null | Function,
  name: typeof GET_NAME_TO_FROM_CLASS_PROP | string,
  type: typeof GET_TYPE_FROM_VALUE | null | string | object,
}

export declare interface Scheme {
  from: SchemeConfig
  to: SchemeConfig
  schemeType: SchemeType | null
}

export const createSchemeFromOptions = <M extends object = any>(
    options: FromAnyDeclaration<M> | FromArrayDeclaration,
    propDeclaration: PropDeclaration
  ): Scheme => {

  const { scheme } = propDeclaration

  const [option1,option2,option3] = options

    // 1, 2, 4, 3, 5-6, 7

  if (options.length === 1) {

      // here we have one string - name of original property
    if (typeof option1 === 'string') {
        // TODO: 1 case
      scheme.schemeType = SchemeType.ONE_STRING
      scheme.from.name = option1
      scheme.from.type = GET_TYPE_FROM_VALUE
      scheme.to.name = GET_NAME_TO_FROM_CLASS_PROP
      scheme.to.type = GET_TYPE_FROM_VALUE
    }

      // specified for complex declarations using function
    if (typeof option1 === 'function') {
        // TODO: 5-6 case
      scheme.schemeType = SchemeType.CONFIGURATORS
      scheme.from.customHandler = option1
      propDeclaration.to = (customHandler: (usageModel: any, originalModel: any) => object) => {
          // TODO: process modify handler
        scheme.to.customHandler = customHandler
        return propDeclaration
      }
    }
  }

  if (options.length === 2) {

    if (typeof option1 === 'string') {

        // here we have a couple strings where
        // first string - name of original property
        // second string - type which we want to cast
      if (typeof option2 === 'string') {
          // TODO: 2 case
        scheme.schemeType = SchemeType.TWO_STRINGS
        scheme.from.name = option1
        scheme.from.type = option2
        scheme.to.name = GET_NAME_TO_FROM_CLASS_PROP
        scheme.to.type = option2
      }

      if (typeof option2 === 'object') {
        scheme.schemeType = propDeclaration['@@array_property_declaration'] ?
          SchemeType.STRING_AND_DECLARE_MODEL_FOR_ARRAY : SchemeType.STRING_AND_DECLARE_MODEL
        scheme.from.name = option1
        scheme.from.type = option2
        scheme.to.name = GET_NAME_TO_FROM_CLASS_PROP
        scheme.to.type = option2
      }
    }
  }

  if (options.length === 3) {

      // here we have a three strings where
      // first string - name of original property
      // second string - type which we want to cast
      // third string - type which we want to convert where we will prepare model to server
    if (typeof option1 === 'string' && typeof option2 === 'string' && typeof option3 === 'string') {
        // TODO: 3 case
      scheme.schemeType = SchemeType.THREE_STRINGS
      scheme.from.name = option1
      scheme.from.type = option2
      scheme.to.name = GET_NAME_TO_FROM_CLASS_PROP
      scheme.to.type = option3
    }
  }

  if (scheme.schemeType === null) {
    throw new Error('Scheme is null!\r\n This case where your parameters is not compatible with current mapster scheme')
  }

  return scheme
}
