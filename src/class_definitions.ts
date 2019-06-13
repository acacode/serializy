import {
    createSchemeFromOptions,
    FromAnyDeclaration,
    FromArrayDeclaration,
    PropDeclaration,
    PropDeclarationConfiguration
} from '.'
import { AllKeysAre } from './global_declarations'
import { createDeclaration, createModelWrapper, ModelWrapper } from './models'

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

export const createModel = <T = any>(rawDeclaration: T): ModelWrapper<AllKeysAre<PropDeclaration>> => {
  const declaration = createDeclaration<T>(rawDeclaration)
  return createModelWrapper(declaration)
}

export const field = <M extends object = any>(...args: FromAnyDeclaration<M>) =>
    createPropDeclaration<M>({
      options: args,
    })

export const fieldArray = (...args: FromArrayDeclaration) =>
    createPropDeclaration({
      '@@array_property_declaration': true,
      options: args,
    })
