import { AllKeysAre, PropDeclaration } from 'src/global_declarations'
import { SchemeType } from 'src/scheme'

export const convertOriginalToUsageModel = <D extends AllKeysAre<PropDeclaration>>(
    originalModel: object,
    declaration: D
) => {
  const model = {}
  // TODO: aggregate all properties
  Object.keys(declaration).forEach(key => {
    if (originalModel[key] && declaration[key]['@@property_declaration']) {
      model[key] = null
      const { scheme, to } = declaration[key]
      const originalType = typeof originalModel[key]
      switch (declaration[key].scheme.schemeType) {
        case SchemeType.ONE_STRING:
          console.log('scheme.from.name', scheme.from.name)
          break
        case SchemeType.TWO_STRINGS:
          break
        case SchemeType.THREE_STRINGS:
          break
        case SchemeType.STRING_AND_DECLARE_MODEL:
          break
        case SchemeType.CONFIGURATORS:
          console.log('to', to)
          break
        case SchemeType.STRING_AND_DECLARE_MODEL_FOR_ARRAY:
          break
        default: throw new Error('Unknown scheme type: ' + declaration[key].scheme.schemeType)
      }
    }
  })
  console.log('originalModel', originalModel, declaration)
}
