import { GET_NAME_TO_FROM_CLASS_PROP } from '../constants'
import { AllKeysAre, PropDeclaration } from '../global_declarations'
import { convertOriginalToUsageModel, convertUsageToOriginalModel } from './Converter'

export const createDeclaration = <T>(rawDeclaration: T): AllKeysAre<PropDeclaration | any> => {
  let declaration: any = null
  if (typeof rawDeclaration === 'function') {
    declaration = new (rawDeclaration as any)()
  }
  if (typeof rawDeclaration === 'object' && !(rawDeclaration instanceof Array)) {
    declaration = rawDeclaration
  }

  if (!declaration) {
    throw new Error('Declaration should be class or object')
  }

  Object.keys(declaration).forEach(propName => {
    const property: PropDeclaration = declaration[propName]
    if (property['@@property_declaration']) {
      if (property.scheme.to.name === GET_NAME_TO_FROM_CLASS_PROP) {
        property.scheme.to.name = propName
      }
    }
  })

  return declaration
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

      const proto = (this as any).__proto__

      proto['@@serializy_data'] = { declaration }
      proto.convertToOriginal = () => convertUsageToOriginalModel.call(null, this, declaration)
    }

  } as ModelWrapper<T>
