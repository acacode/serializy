import { GET_NAME_TO_FROM_CLASS_PROP } from '../constants'
import { AllKeysAre, PropDeclaration, ValueOf } from '../global_declarations'
import { convertOriginalToUsageModel, convertUsageToOriginalModel } from './Converter'

export const createDeclaration = <T>(rawDeclaration: T): AllKeysAre<PropDeclaration | any> => {
    // @ts-ignore
  const declarationInstance = new (rawDeclaration as (new () => ValueOf<T>))()

  Object.keys(declarationInstance).forEach(propName => {
    const property: PropDeclaration = declarationInstance[propName]
    if (property['@@property_declaration']) {
      if (property.scheme.to.name === GET_NAME_TO_FROM_CLASS_PROP) {
        property.scheme.to.name = propName
      }
    }
  })

  return declarationInstance
}

export declare type ModelWrapper<T> = new (originalModel: object | object[]) => {
  [field: string]: any
  convertToOriginal: () => object
}

export const createModelWrapper = <T extends AllKeysAre<PropDeclaration>>(declaration: T): ModelWrapper<T> =>
  class ModelWrapper {

    constructor (originalModel: object | object[]) {

      // TODO: think about it
      // if (originalModel instanceof Array) {
      //   return (originalModel as object[]).map(model => new ModelWrapper(model))
      // }

      Object.assign(this, convertOriginalToUsageModel<T>(originalModel, declaration))
      // @ts-ignore
      this.__proto__['@@serializy_data'] = { declaration }
      // @ts-ignore
      this.__proto__.convertToOriginal = () => convertUsageToOriginalModel.call(null, this, declaration)
    }

  } as ModelWrapper<T>
