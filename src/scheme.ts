import { EMPTY_NAME, SchemeType } from './constants'
import {
  BasePropertyOptions,
  CommonPropertyOptions,
  ModelDeclaration
} from './field_declaration'
import { criticalError } from './helpers'
import { createModel } from './model_wrapper'
import { PropDeclarationConfig } from './prop_declaration'

export interface FieldScheme<T = any> {
  serializer: null | Function
  name: typeof EMPTY_NAME | string
  type: null | string | Function | ModelDeclaration
}

export declare interface Scheme<T = any>
  extends BasePropertyOptions,
    CommonPropertyOptions {
  from: FieldScheme<T>
  to: FieldScheme<T>
  schemeType: SchemeType
}

const SERIALIZER_NOOP = () => ({})

export const createSchemeFromOptions = <M = any>({
  options,
  arrayType,
  optional
}: PropDeclarationConfig): Scheme => {
  const scheme: Scheme = {
    arrayType: !!arrayType,
    from: {
      name: '',
      serializer: null,
      type: null
    },
    optional: !!optional,
    schemeType: null as any,
    to: {
      name: EMPTY_NAME,
      serializer: null,
      type: null
    }
  }

  const makeScheme = (
    type: SchemeType,
    from?: Partial<FieldScheme>,
    to?: Partial<FieldScheme>
  ) => {
    scheme.schemeType = type
    Object.assign(scheme.from, from || {})
    Object.assign(scheme.to, to || {})
  }

  const [option1, option2, option3] = options

  const DEFAULT_TYPE = 'any'

  // Count of arguments is 1
  if (options.length === 1) {
    if (typeof option1 === 'string') {
      /*
        field('PropertyName')
      */
      makeScheme(
        SchemeType.STRINGS,
        { name: option1, type: DEFAULT_TYPE },
        { type: DEFAULT_TYPE }
      )
    }

    if (typeof option1 === 'object') {
      /*
        field({ name: 'PropertyName' })
      */

      if (!option1.name) {
        criticalError('field configuration should contains "name" property')
      }

      const type = option1.type || DEFAULT_TYPE

      makeScheme(
        SchemeType.STRINGS,
        { name: option1.name, type },
        { type: option1.usageType || type }
      )

      scheme.optional = !!option1.optional
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
          SchemeType.STRINGS,
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

        const model =
          typeof option2 === 'object' ? createModel(option2) : option2

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

      makeScheme(
        SchemeType.SERIALIZERS,
        { serializer: option1 },
        {
          serializer: typeof option2 === 'function' ? option2 : SERIALIZER_NOOP
        }
      )
    }
  }

  // Count of arguments is 3
  if (options.length === 3) {
    if (
      typeof option1 === 'string' &&
      typeof option2 === 'string' &&
      typeof option3 === 'string'
    ) {
      /*
        field('PropertyName','propertyType','usagePropertyType')
      */
      makeScheme(
        SchemeType.STRINGS,
        { name: option1, type: option2 },
        { type: option3 }
      )
    }
  }

  if (scheme.schemeType !== SchemeType.SERIALIZERS && !scheme.from.name) {
    criticalError(
      'Invalid scheme\r\n' +
        `First argument of field()/fieldArray() should be not empty string`
    )
  }

  if (!scheme.schemeType) {
    criticalError(
      `Unknown scheme type\r\n` +
        `Probably it happened because you send to field()/fieldArray() invalid arguments`
    )
  }

  return scheme
}
