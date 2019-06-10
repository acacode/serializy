import { GET_NAME_TO_FROM_CLASS_PROP } from '../constants'
import { AllKeysAre, PropDeclaration, ValueOf } from '../global_declarations'
import { convertOriginalToUsageModel } from './Converter'

export const createDeclaration = <T>(rawDeclaration: T): AllKeysAre<PropDeclaration | any> => {
    // @ts-ignore
  const declarationInstance = new (rawDeclaration as (new () => ValueOf<T>))()

  Object.keys(declarationInstance).forEach(propName => {
    const property: PropDeclaration = declarationInstance[propName]
    if (property['@@property_declaration']) {
      // TODO: useless if condition
      if (property.scheme) {
        if (property.scheme.to.name === GET_NAME_TO_FROM_CLASS_PROP) {
          property.scheme.to.name = propName
        }
      }
    }
  })

  return declarationInstance
}

export declare interface ModelWrapper<T> {
  declaration: T
  make: (originalModel: object) => any,
}

export const createModelWrapper = <T extends AllKeysAre<PropDeclaration>>(declaration: T): ModelWrapper<T> => ({
  declaration,
  make: (originalModel) => {
    const usageModel = convertOriginalToUsageModel<T>(originalModel, declaration)
    return usageModel
  }
})
