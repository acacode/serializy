import { DECLARATION_PROP, EMPTY_NAME } from './constants'
import {
  BasePropertyOptions,
  CommonFieldCreator,
  CommonPropertyOptions,
  FieldArrayDeclaration,
  FieldOptions
} from './field_declaration'
import { AllKeysAre } from './global_types'
import { Scheme } from './scheme'

export declare interface PropDeclaration {
  [DECLARATION_PROP]: boolean
  scheme: Scheme
}

export declare interface PropDeclarationConfig
  extends BasePropertyOptions,
    CommonPropertyOptions {
  options: FieldOptions | FieldArrayDeclaration
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

        if (scheme.to.name === EMPTY_NAME) {
          scheme.to.name = propName
        }

        declarations.push({ ...propertyData })

        delete objectWithDeclarations[propName]
      }

      return declarations
    },
    []
  )
