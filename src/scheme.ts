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

const SERIALIZER_NOOP = () => ({})

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
      name: NAME_OF_CLASS_PROP,
      serializer: null,
      type: null,
    },
    writeOnly: !!writeOnly,
  }

  const makeScheme = (type: SchemeType, from?: Partial<SchemeConfig>, to?: Partial<SchemeConfig>) => {
    scheme.schemeType = type
    Object.assign(scheme.from, from || {})
    Object.assign(scheme.to, to || {})
  }

  const [option1,option2,option3] = options

  // Count of arguments is 1
  if (options.length === 1) {

    if (typeof option1 === 'string') {
      /*
        field('PropertyName')
      */
      makeScheme(
        SchemeType.ONE_STRING,
        { name: option1, type: TYPE_OF_CLASS_PROP_VALUE },
        { type: TYPE_OF_CLASS_PROP_VALUE }
      )

    }

    if (typeof option1 === 'object') {
      /*
        field({ name: 'PropertyName' })
      */

      if (!option1.name) {
        error('field configuration should contains at least "name" property')
      }

      const type = option1.type || TYPE_OF_CLASS_PROP_VALUE

      makeScheme(
        SchemeType.ONE_STRING,
        { name: option1.name, type },
        { type: option1.usageType || type }
      )

      scheme.readOnly = !!readOnly
      scheme.writeOnly = !!writeOnly
    }

    if (typeof option1 === 'function') {
      /*
        field(function CustomSerializer(){})
      */

      makeScheme(
        SchemeType.SERIALIZERS,
        { serializer: option1 },
        { serializer: SERIALIZER_NOOP }
      )
    }
  }

  // Count of arguments is 2
  if (options.length === 2) {

    if (typeof option1 === 'string') {

      if (typeof option2 === 'string') {
        /*
          field('PropertyName','propertyType')
        */
        makeScheme(
          SchemeType.TWO_STRINGS,
          { name: option1, type: option2 },
          { type: option2 }
        )
      }

      if (typeof option2 === 'function' || typeof option2 === 'object') {
        /*
          field('PropertyName', Model)
        */
        /*
          field('PropertyName', SimpleObjectModel)
        */

        const model = typeof option2 === 'object' ? createModel(option2) : option2

        makeScheme(
          SchemeType.STRING_AND_CLASS,
          { name: option1, type: model },
          { type: model }
        )
      }
    }

    if (typeof option1 === 'function') {
      /*
        field(function CustomSerializer(){},function CustomDeserializer(){})
      */

      if (typeof option2 !== 'function') {
        error('Second argument should be function which needed to deserialize usage model to original')
      }

      makeScheme(
        SchemeType.SERIALIZERS,
        { serializer: option1 },
        { serializer: option2 as Function }
      )
    }
  }

  // Count of arguments is 3
  if (options.length === 3) {

    if (typeof option1 === 'string' && typeof option2 === 'string' && typeof option3 === 'string') {
      /*
        field('PropertyName','propertyType','usagePropertyType')
      */
      makeScheme(
        SchemeType.THREE_STRINGS,
        { name: option1, type: option2 },
        { type: option3 }
      )
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
