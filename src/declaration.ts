import { DECLARATION_ARRAY_PROP, DECLARATION_PROP, NAME_OF_CLASS_PROP, TYPE_OF_CLASS_PROP_VALUE } from './constants'
import { PropDeclaration, PropDeclarationConfiguration, ValueOf } from './global_types'

import { createSchemeFromOptions } from './scheme'

export const createPropDeclaration = <M extends object = any>(
  config: PropDeclarationConfiguration<M>
): PropDeclaration => {
  const baseOptions: PropDeclaration = {
    [DECLARATION_ARRAY_PROP]: !!config[DECLARATION_ARRAY_PROP],
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

export declare interface ModelOptions {
  // TODO: add more flexible configuration of defaultValues (as nullable, use empty value of type)
  defaultValues: boolean
  warnings: boolean,
}

const DEFAULT_MODEL_OPTIONS: ModelOptions = {
  defaultValues: false,
  warnings: true,
}

export declare interface ModelConfiguration {
  options: ModelOptions
  declarations: PropDeclaration[]
}

export const createModelConfig = <T>(
  objectWithDeclarations: ValueOf<T>,
  originalModel: object,
  modelOptions?: Partial<ModelOptions>
): ModelConfiguration => {

  const options = {
    ...DEFAULT_MODEL_OPTIONS,
    ...(modelOptions || {})
  }

  return {
    declarations: Object.keys(objectWithDeclarations).reduce((
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
    }, []),
    options,
  }
}
