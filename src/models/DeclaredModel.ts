import { ModelConfiguration } from '../class_definitions'
import { GET_NAME_TO_FROM_CLASS_PROP } from '../constants'
import { PropDeclaration, ValueOf } from '../global_declarations'
import { convertOriginalToUsageModel, convertUsageToOriginalModel } from './Converter'

export declare type ModelWrapper<T> = new (originalModel: object | object[]) => {
  [field: string]: any
  convertToOriginal: () => object
}

export const createModelWrapper = <T>(
  rawDeclaration: T,
  modelConfiguration: ModelConfiguration
): ModelWrapper<T> => {
  const ModelWrapper = class ModelWrapper {

    constructor (originalModel: object | object[]) {

      // @ts-ignore
      const instance = new (rawDeclaration as (new () => ValueOf<T>))()

      const declaration = {}

      Object.keys(instance).forEach(propName => {
        const property: PropDeclaration = instance[propName]
        if (property['@@property_declaration']) {
          if (property.scheme.to.name === GET_NAME_TO_FROM_CLASS_PROP) {
            property.scheme.to.name = propName
          }

          declaration[propName] = { ...property }
          delete instance[propName]
        }
      })

      // TODO: think about it
      // if (originalModel instanceof Array) {
      //   return (originalModel as object[]).map(model => new ModelWrapper(model))
      // }

      Object.assign(instance, convertOriginalToUsageModel(originalModel, declaration as any))

      // @ts-ignore
      instance.__proto__['@@serializy_data'] = { declaration }
      // @ts-ignore
      instance.__proto__.convertToOriginal = () => convertUsageToOriginalModel(instance, declaration)

      return instance
    }

  } as ModelWrapper<T>

  return ModelWrapper as ModelWrapper<T>
}
