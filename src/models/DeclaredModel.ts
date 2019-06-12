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
      const usageModel = convertOriginalToUsageModel<T>(originalModel, declaration)
      // @ts-ignore
      usageModel.__proto__['@@mapy_data'] = { declaration }
      // @ts-ignore
      usageModel.__proto__.convertToOriginal = convertUsageToOriginalModel.bind(null, usageModel, declaration)
      return usageModel
    }

  } as ModelWrapper<T>
