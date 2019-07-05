import { field, fieldArray, model } from '../../src'

export const createModelUsingSpec = (
  specField: any = field,
  specFieldArray: any = fieldArray,
  specModel: any = model) => new (specModel(
  class ModelUsingSpec {
    foo = specField('Foo', 'string')
    bar = specField('Bar', 'number')
    baz = specFieldArray('Baz', 'number')
  }
))({
  Bar: 1,
  Baz: [1,2,3,4],
  Foo: 'foo',
}).deserialize()
