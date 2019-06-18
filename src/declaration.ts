import { DECLARATION_PROP, NAME_OF_CLASS_PROP, TYPE_OF_CLASS_PROP_VALUE } from './constants'
import { PropDeclaration, PropDeclarationConfiguration, ValueOf } from './global_types'

import { createSchemeFromOptions } from './scheme'

export const createPropDeclaration = <M extends object = any>(
  config: PropDeclarationConfiguration<M>
): PropDeclaration => {
  const baseOptions: PropDeclaration = {
    '@@array_property_declaration': !!config['@@array_property_declaration'],
    [DECLARATION_PROP]: true,
    scheme: {
      from: {
        converter: null,
        name: '',
        type: null,
      },
      schemeType: null,
      to: {
        converter: null,
        name: '',
        type: null,
      },
    },
    to: null as any,
  }

  const scheme = createSchemeFromOptions(config.options, baseOptions)

  return {
    ...baseOptions,
    scheme
  } as PropDeclaration
}

export const createDeclaration = <T>(
  objectWithDeclarations: ValueOf<T>,
  originalModel: object
) =>
  Object.keys(objectWithDeclarations).reduce((declaration, propName) => {
    const property: PropDeclaration = objectWithDeclarations[propName]
    if (property[DECLARATION_PROP]) {
      const { scheme } = property

      if (scheme.to.name === NAME_OF_CLASS_PROP) {
        scheme.to.name = propName
      }

      if (scheme.to.type === TYPE_OF_CLASS_PROP_VALUE) {
        const originalType = typeof originalModel[scheme.from.name]
        scheme.to.type = originalType
        scheme.from.type = originalType
      }

      declaration[propName] = { ...property }
      delete objectWithDeclarations[propName]
    }

    return declaration
  }, {})
