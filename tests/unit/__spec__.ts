import { field, fieldArray, model } from '../../src'
import { FieldCreatorDeclaration, FieldsArrayCreatorDeclaration } from '../../src/field_declaration'
import { ModelWrapper } from '../../src/model_wrapper'

export const createModelUsingSpec = (
  specField: FieldCreatorDeclaration = field,
  specFieldArray: FieldsArrayCreatorDeclaration = fieldArray,
  specModel: ((...args: any[]) => ModelWrapper<any>) = model
) => {

  const BarModel = specModel(class BarModel {
    anyBarP = specField('AnyBarP', 'any')
    stringBarP = specField('StringBarP', 'string')
    numberBarP = specField('NumberBarP', 'number')
    BooleanBarP = specField('BooleanBarP', 'boolean')
    objectBarP = specField('ObjectBarP', 'object')
  })

  return new (specModel(
    class ModelUsingSpec {
      foo = specField('Foo', 'string', 'string')
      bar = specField('Bar', 'number')
      baz = specFieldArray('Baz', 'number')
      foo1 = specField('Foo1', 'object')
      barModel = specField('BarModel', BarModel)
      fooSerialP = specField(({ Foo, Bar }: any) => `foo bar - ${Foo}:${Bar}`)
      fooSerialDeserialP = specField(({ Foo, Bar }: any) => `foo bar - ${Foo}:${Bar}`)
    }
  ))({
    Bar: 1,
    Baz: [1,2,3,4],
    Foo: 'foo',
  }).deserialize()
}
