import { DECLARATION_ARRAY_PROP, DECLARATION_PROP, NAME_OF_CLASS_PROP, TYPE_OF_CLASS_PROP_VALUE } from './constants'
import { FieldArrayDeclaration, FieldDeclaration } from './field_declaration'
import { ValueOf } from './global_types'
import { Scheme } from './scheme'

export declare interface PropDeclaration {
  [DECLARATION_ARRAY_PROP]: boolean
  [DECLARATION_PROP]: boolean,

  scheme: Scheme
}

export declare interface PropDeclarationConfig<M = any> {
  [DECLARATION_ARRAY_PROP]?: boolean
  options: FieldDeclaration<M> | FieldArrayDeclaration
}

export const preparePropDeclarations = <T>(
  objectWithDeclarations: ValueOf<T>,
  originalModel: object,
) =>
  Object.keys(objectWithDeclarations).reduce((
    declarations: PropDeclaration[],
    propName: string
  ) => {
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

      declarations.push({ ...property })

      delete objectWithDeclarations[propName]
    }

    return declarations
  }, [])
