import { GET_NAME_TO_FROM_CLASS_PROP } from '../constants'
import { AllKeysAre, PropDeclaration, ValueOf } from '../global_declarations'
import { convertOriginalToUsageModel } from './Converter'

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

export declare interface ModelWrapper<T> {
  ['@@model_wrapper']: true,
  declaration: T
  makeFrom: (originalModel: object) => any,
  makeTo: (usageModel: object) => any,
}

export const createModelWrapper = <T extends AllKeysAre<PropDeclaration>>(declaration: T): ModelWrapper<T> => ({
  ['@@model_wrapper']: true,
  declaration,
  makeFrom: (originalModel) => {
    const usageModel = convertOriginalToUsageModel<T>(originalModel, declaration)
    return usageModel
  },
  makeTo: (usageModel) => {
    console.log('usageModel', usageModel)
  },
})
