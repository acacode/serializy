import { field, fieldArray, model } from '../../lib/serializy.min'

import { testAllCases } from './__helpers__'
import { createModelUsingSpec } from './__spec__'

describe('Using minified JS files (lib)', () => {
  const funcs: any = {
    field: [
      ['should be defined', () => {
        expect(field).toBeDefined()
      }],
    ],
    fieldArray: [
      ['should be defined', () => {
        expect(fieldArray).toBeDefined()
      }],
    ],
    model: [
      ['should be defined', () => {
        expect(model).toBeDefined()
      }],
    ]
  }

  testAllCases(funcs, func => `${func}()`)

  test('Should be able to serialize and deserialize structure', () => {
    expect(createModelUsingSpec(field, fieldArray, model)).toStrictEqual({
      'Bar': 1,
      'Baz': [1, 2, 3, 4 ],
      'Foo': 'foo',
    })
  })
})
