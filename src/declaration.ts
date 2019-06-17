import { DECLARATION_PROP, NAME_OF_CLASS_PROP, TYPE_OF_CLASS_PROP_VALUE } from './constants'
import { PropDeclaration, ValueOf } from './global_types'

export const createDeclaration = <T>(objectWithDeclarations: ValueOf<T>, originalModel: object) =>
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
