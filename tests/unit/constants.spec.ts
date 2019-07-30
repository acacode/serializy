import { DECLARATION_PROP, EMPTY_NAME, SchemeType } from '../../src/constants'

describe('constants', () => {
  test('DECLARATION_PROP', () => {
    expect(DECLARATION_PROP).toEqual('@@property_declaration')
  })
  test('EMPTY_NAME', () => {
    expect(EMPTY_NAME).toEqual('@@EMPTY_NAME')
  })

  test('SchemeType', () => {
    expect(SchemeType).toStrictEqual({
      SERIALIZERS: '@SERIALIZERS',
      STRINGS: '@STRINGS',
      STRING_AND_CLASS: '@STRING_AND_CLASS'
    })
  })
})
