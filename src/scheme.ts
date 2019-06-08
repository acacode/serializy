import { NEED_TO_GET_NAME_TO_FROM_CLASS_PROP, NEED_TO_GET_TYPE_FROM_VALUE } from './constants'
import { FromAnyDeclaration, FromArrayDeclaration, PropDeclaration } from './global_declarations'

export const createSchemeFromOptions = <M extends object = any>(
    options: FromAnyDeclaration<M> | FromArrayDeclaration,
    propDeclaration: PropDeclaration
  ): typeof scheme => {

  interface SchemeConfig {
    customHandler: null | Function,
    name: string,
    type: null | string | object,
  }

  const scheme: { from: SchemeConfig, to: SchemeConfig } = {
    from: {
      customHandler: null,
      name: '',
      type: null,
    },
    to: {
      customHandler: null,
      name: '',
      type: null,
    },
  }

  const [option1,option2,option3] = options

    // 1, 2, 4, 3, 5-6, 7

  if (options.length === 1) {

      // here we have one string - name of original property
    if (typeof option1 === 'string') {
        // TODO: 1 case
      scheme.from.name = option1
      scheme.from.type = NEED_TO_GET_TYPE_FROM_VALUE
      scheme.to.name = NEED_TO_GET_NAME_TO_FROM_CLASS_PROP
      scheme.to.type = NEED_TO_GET_TYPE_FROM_VALUE
    }

      // specified for complex declarations using function
    if (typeof option1 === 'function') {
        // TODO: 5-6 case
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
        scheme.from.name = option1
        scheme.from.type = option2
        scheme.to.name = NEED_TO_GET_NAME_TO_FROM_CLASS_PROP
        scheme.to.type = option2
      }

      if (typeof option2 === 'object') {
        if (propDeclaration['@@array_property_declaration']) {
            // TODO: 7 case
        } else {
            // TODO: 4 case
          scheme.from.name = option1
          scheme.from.type = option2
          scheme.to.name = NEED_TO_GET_NAME_TO_FROM_CLASS_PROP
          scheme.to.type = option2
        }
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
      scheme.from.name = option1
      scheme.from.type = option2
      scheme.to.name = NEED_TO_GET_NAME_TO_FROM_CLASS_PROP
      scheme.to.type = option3
    }
  }

  return scheme
}
