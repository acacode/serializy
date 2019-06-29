import { NAME_OF_CLASS_PROP, SchemeType, TYPE_OF_CLASS_PROP_VALUE } from './constants'
import { AllKeysAre } from './global_types'
import { createModel, ModelWrapper } from './model_wrapper'
import { PropDeclaration, PropDeclarationConfig } from './prop_declaration'

export interface SchemeConfig<T = any> {
  serializer: null | Function,
  name: typeof NAME_OF_CLASS_PROP | string,
  type: typeof TYPE_OF_CLASS_PROP_VALUE | null | string | Function | ModelWrapper<T> | AllKeysAre<PropDeclaration>,
}

export declare interface Scheme<T = any> {
  from: SchemeConfig<T>
  to: SchemeConfig<T>
  schemeType: SchemeType | null
  arrayType: boolean
}

export const createSchemeFromOptions = <M = any>(config: PropDeclarationConfig<M>): Scheme => {

  const { options } = config

  const scheme: Scheme = {
    arrayType: !!config.arrayType,
    from: {
      name: '',
      serializer: null,
      type: null,
    },
    schemeType: null,
    to: {
      name: '',
      serializer: null,
      type: null,
    },
  }

  const [option1,option2,option3] = options

  // Count of arguments is 1
  if (options.length === 1) {

    if (typeof option1 === 'string') {
      scheme.schemeType = SchemeType.ONE_STRING
      scheme.from.name = option1
      scheme.from.type = TYPE_OF_CLASS_PROP_VALUE
      scheme.to.name = NAME_OF_CLASS_PROP
      scheme.to.type = TYPE_OF_CLASS_PROP_VALUE
    }
  }

  // Count of arguments is 2
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
        scheme.schemeType = SchemeType.STRING_AND_CLASS
        scheme.from.name = option1
        scheme.from.type = option2
        scheme.to.name = NAME_OF_CLASS_PROP
        scheme.to.type = option2
      }

      if (typeof option2 === 'object') {
        scheme.schemeType = SchemeType.STRING_AND_CLASS
        scheme.from.name = option1
        scheme.from.type = createModel(option2)
        scheme.to.name = NAME_OF_CLASS_PROP
        scheme.to.type = createModel(option2)
      }
    }

    if (typeof option1 === 'function') {
      if (typeof option2 !== 'function') {
        throw new Error('Second argument should be function which needed to deserialize usage model to original')
      }

      scheme.schemeType = SchemeType.SERIALIZERS
      scheme.to.name = NAME_OF_CLASS_PROP
      scheme.from.serializer = option1
      scheme.to.serializer = option2
    }
  }

  // Count of arguments is 3
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
