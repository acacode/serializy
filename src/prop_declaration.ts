import { DECLARATION_PROP, NAME_OF_CLASS_PROP } from './constants'
import {
  BasePropertyOptions,
  CommonFieldCreator,
  CommonPropertyOptions,
  FieldArrayDeclaration,
  FieldDeclaration
} from './field_declaration'
import { AllKeysAre } from './global_types'
import { Scheme } from './scheme'

export declare interface PropDeclaration {
  [DECLARATION_PROP]: boolean
  scheme: Scheme
}

export declare interface PropDeclarationConfig<M = any>
  extends BasePropertyOptions,
    CommonPropertyOptions {
  options: FieldDeclaration<M> | FieldArrayDeclaration
}

export const preparePropDeclarations = <T>(
  objectWithDeclarations: AllKeysAre<PropDeclaration | CommonFieldCreator>
) =>
  Object.keys(objectWithDeclarations).reduce(
    (declarations: PropDeclaration[], propName: string) => {
      const property: PropDeclaration | CommonFieldCreator =
        objectWithDeclarations[propName]
      if (property[DECLARATION_PROP]) {
        const propertyData =
          typeof property === 'function' ? property({}) : property
        const { scheme } = propertyData

        if (scheme.to.name === NAME_OF_CLASS_PROP) {
          scheme.to.name = propName
        }

        declarations.push({ ...propertyData })

        delete objectWithDeclarations[propName]
      }

      return declarations
    },
    []
  )
