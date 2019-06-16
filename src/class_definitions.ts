import {
  AllKeysAre,
  FromAnyDeclaration,
  FromArrayDeclaration,
  PropDeclaration,
  PropDeclarationConfiguration
} from './global_declarations'
import { createModelWrapper, ModelWrapper } from './models'
import { createSchemeFromOptions } from './scheme'

const createPropDeclaration = <M extends object = any>(
    config: PropDeclarationConfiguration<M>
  ): PropDeclaration => {

  const baseOptions: PropDeclaration = {
    '@@array_property_declaration': !!config['@@array_property_declaration'],
    '@@property_declaration': true,
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

export declare interface ModelConfiguration {
  defaultValues: boolean
  warnings: boolean,
}

const DEFAULT_MODEL_CONFIGURATION: ModelConfiguration = {
  defaultValues: true,
  warnings: true,
}

export const createModel = <T = any>(
  rawDeclaration: T,
  modelConfiguration?: Partial<ModelConfiguration>
): ModelWrapper<AllKeysAre<PropDeclaration>> => {
  return createModelWrapper<T>(rawDeclaration, {
    ...DEFAULT_MODEL_CONFIGURATION,
    ...(modelConfiguration || {})
  })
}

export const field = <M extends object = any>(...options: FromAnyDeclaration<M>) =>
    createPropDeclaration<M>({ options })

export const fieldArray = (...options: FromArrayDeclaration) =>
    createPropDeclaration({ '@@array_property_declaration': true, options })
