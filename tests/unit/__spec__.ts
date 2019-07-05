
export const createModelUsingSpec = ({
  field,
  fieldArray,
  model
}: any) => {

  const BarModel = model(class BarModel {
    anyBarP = field('AnyBarP', 'any')
    stringBarP = field('StringBarP', 'string')
    numberBarP = field('NumberBarP', 'number')
    BooleanBarP = field('BooleanBarP', 'boolean')
    objectBarP = field('ObjectBarP', 'object')
  })

  const SpecModel = model(
    class ModelUsingSpec {
      bar = field('Bar', 'number')
      barModel = field('BarModel', BarModel)
      baz = fieldArray('Baz', 'number')
      foo = field('Foo', 'string', 'string')
      foo1 = field('Foo1', 'object')
      fooSerialDeserialP = field(({ Foo, Bar }: any) => `foo bar - ${Foo}:${Bar}`)
      fooSerialP = field(({ Foo, Bar }: any) => `foo bar - ${Foo}:${Bar}`)
    }
  )

  const symbol = Symbol('supersymbol')

  const originalStructure = {
    Bar: 1,
    BarModel: {
      AnyBarP: symbol,
      BooleanBarP: false,
      NumberBarP: 50001,
      ObjectBarP: {
        key1: 1,
        key2: 2
      },
      StringBarP: 'string',
    },
    Baz: [1,2,3,4],
    Foo: 'foo',
    Foo1: {
      foo1Key1: 1,
      foo1Key2: 1
    }
  }

  const usageStructure = {
    'bar': 1,
    'barModel': {
      'BooleanBarP': false,
      'anyBarP': symbol,
      'numberBarP': 50001,
      'objectBarP': {
        'key1': 1,
        'key2': 2,
      },
      'stringBarP': 'string',
    },
    'baz': [ 1, 2, 3, 4, ],
    'foo': 'foo',
    'foo1': {
      'foo1Key1': 1,
      'foo1Key2': 1,
    },
    'fooSerialDeserialP': 'foo bar - foo:1',
    'fooSerialP': 'foo bar - foo:1',
  }

  const serializedModel = new (SpecModel)(originalStructure)

  return { serializedModel, originalStructure, usageStructure }
}
