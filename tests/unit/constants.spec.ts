
import { DECLARATION_PROP, NAME_OF_CLASS_PROP, SchemeType, TYPE_OF_CLASS_PROP_VALUE } from '../../src/constants'

describe('constants', () => {
  test('DECLARATION_PROP', () => {
    expect(DECLARATION_PROP).toEqual('@@property_declaration')
  })
  test('NAME_OF_CLASS_PROP', () => {
    expect(NAME_OF_CLASS_PROP).toEqual('@@CLASS_PROP_NAME')
  })
  test('TYPE_OF_CLASS_PROP_VALUE', () => {
    expect(TYPE_OF_CLASS_PROP_VALUE).toEqual('@@VALUE_TYPE')
  })

  test('SchemeType', () => {
    expect(SchemeType).toStrictEqual({
      ONE_STRING: '@ONLY_STRINGS',
      SERIALIZERS: '@SERIALIZERS',
      STRING_AND_CLASS: '@STRING_AND_CLASS',
      THREE_STRINGS: '@ONLY_STRINGS',
      TWO_STRINGS: '@ONLY_STRINGS',
    })
  })
})
