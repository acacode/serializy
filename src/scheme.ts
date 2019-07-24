import { NAME_OF_CLASS_PROP, SchemeType, TYPE_OF_CLASS_PROP_VALUE } from './constants'
import { BasePropertyOptions, CommonPropertyOptions, ModelDeclaration } from './field_declaration'
import { error } from './helpers'
import { createModel } from './model_wrapper'
import { PropDeclarationConfig } from './prop_declaration'

export interface SchemeConfig<T = any> {
  serializer: null | Function,
  name: typeof NAME_OF_CLASS_PROP | string,
  type: typeof TYPE_OF_CLASS_PROP_VALUE | null | string | Function | ModelDeclaration,
}

export declare interface Scheme<T = any> extends BasePropertyOptions, CommonPropertyOptions {
  from: SchemeConfig<T>
  to: SchemeConfig<T>
  schemeType: SchemeType
}

export const createSchemeFromOptions = <M = any>(
  { options, writeOnly, arrayType, readOnly }: PropDeclarationConfig<M>
): Scheme => {

  const scheme: Scheme = {
    arrayType: !!arrayType,
    from: {
      name: '',
      serializer: null,
      type: null,
    },
    readOnly: !!readOnly,
    schemeType: null as any,
    to: {
      name: '',
      serializer: null,
      type: null,
    },
    writeOnly: !!writeOnly,
  }

  const [option1,option2,option3] = options

  // Count of arguments is 1
  if (options.length === 1) {

    if (typeof option1 === 'string') {
      /*
        field('PropertyName')
      */
      scheme.schemeType = SchemeType.ONE_STRING
      scheme.from.name = option1
      scheme.from.type = TYPE_OF_CLASS_PROP_VALUE
      scheme.to.name = NAME_OF_CLASS_PROP
      scheme.to.type = TYPE_OF_CLASS_PROP_VALUE
    }

    if (typeof option1 === 'object') {
      /*
        field({ name: 'PropertyName' })
      */
      if (!option1.name) {
        error('field configuration should contains at least "name" property')
      }

      scheme.schemeType = SchemeType.ONE_STRING
      scheme.from.name = option1.name
      scheme.from.type = option1.type || TYPE_OF_CLASS_PROP_VALUE
      scheme.to.name = NAME_OF_CLASS_PROP
      scheme.to.type = option1.usageType || scheme.from.type

      scheme.readOnly = !!option1.readOnly
      scheme.writeOnly = !!option1.writeOnly
    }

    if (typeof option1 === 'function') {
      /*
        field(function CustomSerializer(){})
      */
      scheme.schemeType = SchemeType.SERIALIZERS
      scheme.to.name = NAME_OF_CLASS_PROP
      scheme.from.serializer = option1
      scheme.to.serializer = () => ({})
    }
  }

  // Count of arguments is 2
  if (options.length === 2) {

    if (typeof option1 === 'string') {

      if (typeof option2 === 'string') {
        /*
          field('PropertyName','propertyType')
        */
        scheme.schemeType = SchemeType.TWO_STRINGS
        scheme.from.name = option1
        scheme.from.type = option2
        scheme.to.name = NAME_OF_CLASS_PROP
        scheme.to.type = option2
      }

      if (typeof option2 === 'function') {
        /*
          field('PropertyName', Model)
        */
        scheme.schemeType = SchemeType.STRING_AND_CLASS
        scheme.from.name = option1
        scheme.from.type = option2
        scheme.to.name = NAME_OF_CLASS_PROP
        scheme.to.type = option2
      }

      if (typeof option2 === 'object') {
        /*
          field('PropertyName', SimpleObjectModel)
        */
        scheme.schemeType = SchemeType.STRING_AND_CLASS
        scheme.from.name = option1
        scheme.from.type = createModel(option2)
        scheme.to.name = NAME_OF_CLASS_PROP
        scheme.to.type = createModel(option2)
      }
    }

    if (typeof option1 === 'function') {
      /*
        field(function CustomSerializer(){},function CustomDeserializer(){})
      */

      if (typeof option2 !== 'function') {
        error('Second argument should be function which needed to deserialize usage model to original')
      }

      scheme.schemeType = SchemeType.SERIALIZERS
      scheme.to.name = NAME_OF_CLASS_PROP
      scheme.from.serializer = option1
      scheme.to.serializer = option2 as Function
    }
  }

  // Count of arguments is 3
  if (options.length === 3) {

    if (typeof option1 === 'string' && typeof option2 === 'string' && typeof option3 === 'string') {
      /*
        field('PropertyName','propertyType','usagePropertyType')
      */
      scheme.schemeType = SchemeType.THREE_STRINGS
      scheme.from.name = option1
      scheme.from.type = option2
      scheme.to.name = NAME_OF_CLASS_PROP
      scheme.to.type = option3
    }
  }

  if (!scheme.schemeType) {
    error(
      `Unknown scheme type\r\n` +
      `Probably it happened because you send to field()/fieldArray() invalid arguments`
    )
  }

  return scheme
}
