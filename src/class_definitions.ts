import { DECLARATION_PROP } from './constants'
import { convertModel } from './converter'
import { createDeclaration } from './declaration'
import {
  FromAnyDeclaration,
  FromArrayDeclaration,
  PropDeclaration,
  PropDeclarationConfiguration,
  ValueOf
} from './global_types'
import { createSchemeFromOptions } from './scheme'

const createPropDeclaration = <M extends object = any>(
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

export declare interface ModelConfiguration {
  defaultValues: boolean
  warnings: boolean,
}

// const DEFAULT_MODEL_CONFIGURATION: ModelConfiguration = {
//   defaultValues: true,
//   warnings: true,
// }

export declare type ModelWrapper<T> = new (originalModel: object) => {
  [field: string]: any
  convertToOriginal: () => object
}

export const createModel = <T extends new () => ValueOf<T>>(
  ModelDeclaration: T,
  partialModelConfiguration?: Partial<ModelConfiguration>
): ModelWrapper<T> => class ModelWrapper {

  constructor (originalModel: object) {

    const instance = new ModelDeclaration()

    // const modelConfiguration = {
    //   ...DEFAULT_MODEL_CONFIGURATION,
    //   ...(partialModelConfiguration || {})
    // }

    // TODO: Add handlers for configuration
    // console.log('TODO: modelConfiguration', modelConfiguration)

    const declaration = createDeclaration<T>(instance, originalModel)

    // TODO: think about it
    // if (originalModel instanceof Array) {
    //   return (originalModel as object[]).map(model => new ModelWrapper(model))
    // }

    Object.assign(instance, convertModel(originalModel, declaration, false))

    // @ts-ignore
    instance.__proto__.convertToOriginal = () => convertModel(instance, declaration, true)

    return instance
  }

} as ModelWrapper<T>

export const field = <M extends object = any>(...options: FromAnyDeclaration<M>) =>
    createPropDeclaration<M>({ options })

export const fieldArray = (...options: FromArrayDeclaration) =>
    createPropDeclaration({ '@@array_property_declaration': true, options })
