import { DECLARATION_PROP, NAME_OF_CLASS_PROP } from './constants'
import { FieldArrayDeclaration, FieldDeclaration } from './field_declaration'
import { ValueOf } from './global_types'
import { Scheme } from './scheme'

export declare interface PropDeclaration {
  [DECLARATION_PROP]: boolean,
  scheme: Scheme
}

export declare interface PropDeclarationConfig<M = any> {
  arrayType: boolean
  options: FieldDeclaration<M> | FieldArrayDeclaration
}

export const preparePropDeclarations = <T>(objectWithDeclarations: ValueOf<T>) =>
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

      declarations.push({ ...property })

      delete objectWithDeclarations[propName]
    }

    return declarations
  }, [])
